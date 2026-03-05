import { useState, useEffect } from "react";
import { goalListAll, goalCreate, goalSetProgress, goalDelete } from "../api";
import type { Goal } from "../types";

function AddGoalModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (title: string, description: string | null) => void;
}) {
  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim() || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__title">New Goal</div>
        <div className="form-group">
          <label className="input-label">Title</label>
          <input
            className="input"
            autoFocus
            placeholder="What do you want to achieve?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Description (optional)</label>
          <textarea
            className="input input-area"
            placeholder="More details about this goal..."
            value={description}
            onChange={e => setDesc(e.target.value)}
            rows={3}
          />
        </div>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={!title.trim()}>
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals]     = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter]   = useState<"all" | "active" | "done">("all");

  const load = () => goalListAll().then(setGoals);
  useEffect(() => { load(); }, []);

  const add = async (title: string, description: string | null) => {
    await goalCreate(title, description);
    load();
  };

  const adjustProgress = async (g: Goal, delta: number) => {
    const next = Math.max(0, Math.min(1, g.progress + delta));
    await goalSetProgress(g.id, next);
    load();
  };

  const remove = async (id: string) => {
    await goalDelete(id);
    load();
  };

  const active   = goals.filter(g => !g.is_completed).length;
  const done     = goals.filter(g => g.is_completed).length;

  const filtered = goals.filter(g =>
    filter === "all"    ? true :
    filter === "active" ? !g.is_completed :
                          g.is_completed
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Goals</h1>
          <p className="page-sub">{active} active · {done} completed</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + New Goal
        </button>
      </div>

      <div className="page-body">
        <div className="filter-row">
          {(["all", "active", "done"] as const).map(f => (
            <button
              key={f}
              className={`chip${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? `All (${goals.length})` :
               f === "active" ? `Active (${active})` :
               `Done (${done})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">◎</div>
            <div className="empty-state__title">No goals here</div>
            <div className="empty-state__sub">Set a goal and track your progress</div>
          </div>
        ) : (
          <div className="wrap-panel">
            {filtered.map(g => (
              <div
                key={g.id}
                className={`goal-card${g.is_completed ? " completed" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--fg)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      marginRight: 8,
                    }}
                  >
                    {g.title}
                  </span>
                  {g.is_completed && (
                    <span className="badge badge-done">Done</span>
                  )}
                </div>

                {g.description && (
                  <p
                    className="text-muted text-sm"
                    style={{ marginBottom: 14, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                  >
                    {g.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted text-xs">Progress</span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: g.is_completed ? "var(--success)" : "var(--fg)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {Math.round(g.progress * 100)}%
                  </span>
                </div>
                <div className="progress-track" style={{ marginBottom: 16, height: 7 }}>
                  <div
                    className={`progress-fill${g.is_completed ? " progress-fill--success" : ""}`}
                    style={{ width: `${g.progress * 100}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => adjustProgress(g, -0.1)}
                    disabled={g.is_completed}
                  >
                    −10%
                  </button>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => adjustProgress(g, 0.1)}
                    disabled={g.is_completed}
                  >
                    +10%
                  </button>
                  <button
                    className="btn btn-surface btn-xs"
                    onClick={() => adjustProgress(g, 1)}
                    disabled={g.is_completed}
                    style={{ marginLeft: "auto" }}
                  >
                    ✓ Done
                  </button>
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => remove(g.id)}
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
        <AddGoalModal onClose={() => setShowAdd(false)} onAdd={add} />
      )}
    </>
  );
}
