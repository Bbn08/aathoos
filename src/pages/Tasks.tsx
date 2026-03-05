import { useState, useEffect } from "react";
import { taskListAll, taskCreate, taskSetCompleted, taskDelete } from "../api";
import type { Task } from "../types";

type Filter = "all" | "active" | "completed";

function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (title: string, notes: string | null, priority: number) => void;
}) {
  const [title, setTitle]       = useState("");
  const [notes, setNotes]       = useState("");
  const [priority, setPriority] = useState(1);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), notes.trim() || null, priority);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__title">New Task</div>
        <div className="form-group">
          <label className="input-label">Title</label>
          <input
            className="input"
            autoFocus
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Notes (optional)</label>
          <textarea
            className="input input-area"
            placeholder="Additional details..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Priority</label>
          <div className="filter-row" style={{ marginBottom: 0 }}>
            {([0, 1, 2] as const).map(p => (
              <button
                key={p}
                className={`chip${priority === p ? " active" : ""}`}
                onClick={() => setPriority(p)}
              >
                {p === 0 ? "Low" : p === 1 ? "Medium" : "High"}
              </button>
            ))}
          </div>
        </div>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!title.trim()}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [filter, setFilter]   = useState<Filter>("all");
  const [showAdd, setShowAdd] = useState(false);

  const load = () => taskListAll().then(setTasks);
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t =>
    filter === "all"       ? true :
    filter === "active"    ? !t.is_completed :
                             t.is_completed
  );

  const toggle = async (id: string, done: boolean) => {
    await taskSetCompleted(id, done);
    load();
  };

  const remove = async (id: string) => {
    await taskDelete(id);
    load();
  };

  const add = async (title: string, notes: string | null, priority: number) => {
    await taskCreate(title, notes, priority);
    load();
  };

  const pending   = tasks.filter(t => !t.is_completed).length;
  const completed = tasks.filter(t => t.is_completed).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-sub">{pending} pending · {completed} completed</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + New Task
        </button>
      </div>

      <div className="page-body">
        <div className="filter-row">
          {(["all", "active", "completed"] as Filter[]).map(f => (
            <button
              key={f}
              className={`chip${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? `All (${tasks.length})` :
               f === "active" ? `Active (${pending})` :
               `Done (${completed})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✓</div>
            <div className="empty-state__title">
              {filter === "completed" ? "No completed tasks yet" : "All clear!"}
            </div>
            <div className="empty-state__sub">
              {filter !== "completed" && "Add a task to get started"}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "8px" }}>
            {filtered.map(t => (
              <div
                key={t.id}
                className={`task-row${t.is_completed ? " completed" : ""}`}
              >
                <div
                  className="task-row__priority-bar"
                  style={{
                    background:
                      t.priority === "High" ? "var(--error)" :
                      t.priority === "Medium" ? "var(--warning)" : "var(--info)",
                  }}
                />
                <div
                  className={`task-row__check${t.is_completed ? " checked" : ""}`}
                  onClick={() => toggle(t.id, !t.is_completed)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="task-row__title">{t.title}</div>
                  {t.notes && (
                    <div className="text-muted text-xs" style={{ marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.notes}
                    </div>
                  )}
                </div>
                <span className={`badge badge-${t.priority.toLowerCase()}`}>
                  {t.priority.slice(0, 3).toUpperCase()}
                </span>
                <div className="task-row__actions">
                  <button
                    className="btn btn-icon"
                    style={{ color: "var(--error)", fontSize: 13 }}
                    onClick={() => remove(t.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} onAdd={add} />
      )}
    </>
  );
}
