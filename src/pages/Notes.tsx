import { useState, useEffect, useRef } from "react";
import { noteListAll, noteCreate, noteUpdateBody, noteDelete } from "../api";
import type { Note } from "../types";

function relativeAge(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function AddNoteModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (title: string, body: string, subject: string | null) => void;
}) {
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [subject, setSubject] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), body.trim(), subject.trim() || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__title">New Note</div>
        <div className="form-group">
          <label className="input-label">Title</label>
          <input
            className="input"
            autoFocus
            placeholder="Note title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Subject (optional)</label>
          <input
            className="input"
            placeholder="e.g. Mathematics, Physics..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Body</label>
          <textarea
            className="input input-area"
            placeholder="Start writing..."
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
          />
        </div>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!title.trim()}>
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const [notes, setNotes]         = useState<Note[]>([]);
  const [selected, setSelected]   = useState<Note | null>(null);
  const [body, setBody]           = useState("");
  const [dirty, setDirty]         = useState(false);
  const [showAdd, setShowAdd]     = useState(false);
  const [search, setSearch]       = useState("");
  const saveTimer                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = async () => {
    const list = await noteListAll();
    setNotes(list);
    return list;
  };

  useEffect(() => { load(); }, []);

  const select = (n: Note) => {
    setSelected(n);
    setBody(n.body);
    setDirty(false);
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (selected) {
      saveTimer.current = setTimeout(async () => {
        await noteUpdateBody(selected.id, val);
        setDirty(false);
        const list = await load();
        const updated = list.find(n => n.id === selected.id);
        if (updated) setSelected(updated);
      }, 1200);
    }
  };

  const add = async (title: string, b: string, subject: string | null) => {
    const note = await noteCreate(title, b, subject);
    const list = await load();
    setSelected(note);
    setBody(note.body);
  };

  const remove = async (id: string) => {
    await noteDelete(id);
    if (selected?.id === id) { setSelected(null); setBody(""); }
    load();
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.subject?.toLowerCase().includes(search.toLowerCase()) ||
    n.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="two-panel" style={{ flex: 1 }}>
        {/* List panel */}
        <div className="two-panel__list">
          <div className="two-panel__list-header">
            <input
              className="input"
              style={{ flex: 1, padding: "7px 12px", fontSize: 13 }}
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+</button>
          </div>
          <div className="two-panel__list-body">
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>
                <div className="empty-state__icon">≡</div>
                <div className="empty-state__title">No notes yet</div>
              </div>
            ) : (
              filtered.map(n => (
                <div
                  key={n.id}
                  className={`note-item${selected?.id === n.id ? " active" : ""}`}
                  onClick={() => select(n)}
                >
                  <div className="note-item__title">{n.title}</div>
                  <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                    {n.subject && (
                      <span className="badge badge-accent" style={{ fontSize: 10 }}>
                        {n.subject}
                      </span>
                    )}
                    <span className="text-muted text-xs">{relativeAge(n.updated_at)}</span>
                  </div>
                  <div className="note-item__preview" style={{ marginTop: 4 }}>
                    {n.body || "No content"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor panel */}
        <div className="two-panel__main">
          {selected ? (
            <>
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>
                    {selected.title}
                  </div>
                  <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                    {selected.subject && (
                      <span className="badge badge-accent">{selected.subject}</span>
                    )}
                    <span className="text-muted text-xs">
                      {dirty ? "Saving..." : `Saved · ${relativeAge(selected.updated_at)}`}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(selected.id)}
                >
                  Delete
                </button>
              </div>
              <textarea
                value={body}
                onChange={e => handleBodyChange(e.target.value)}
                style={{
                  flex: 1,
                  width: "100%",
                  padding: "24px",
                  background: "transparent",
                  border: "none",
                  color: "var(--fg)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  resize: "none",
                  outline: "none",
                }}
                placeholder="Start writing..."
              />
            </>
          ) : (
            <div className="empty-state" style={{ height: "100%" }}>
              <div className="empty-state__icon">≡</div>
              <div className="empty-state__title">Select a note</div>
              <div className="empty-state__sub">or create a new one</div>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddNoteModal onClose={() => setShowAdd(false)} onAdd={add} />
      )}
    </div>
  );
}
