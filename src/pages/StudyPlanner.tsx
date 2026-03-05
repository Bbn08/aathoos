import { useState, useEffect } from "react";
import { studyListAll, studyCreate, studyDelete } from "../api";
import type { StudySession } from "../types";

const SUBJECT_COLORS = [
  "var(--accent)", "var(--info)", "var(--success)",
  "var(--warning)", "#a78bfa", "#f472b6",
];

function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

function LogSessionModal({
  onClose,
  onLog,
}: {
  onClose: () => void;
  onLog: (subject: string, durationSecs: number, notes: string | null) => void;
}) {
  const [subject, setSubject] = useState("");
  const [hours, setHours]     = useState("0");
  const [mins, setMins]       = useState("25");
  const [notes, setNotes]     = useState("");

  const submit = () => {
    if (!subject.trim()) return;
    const secs = parseInt(hours || "0") * 3600 + parseInt(mins || "0") * 60;
    if (secs <= 0) return;
    onLog(subject.trim(), secs, notes.trim() || null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__title">Log Study Session</div>
        <div className="form-group">
          <label className="input-label">Subject</label>
          <input
            className="input"
            autoFocus
            placeholder="e.g. Mathematics, Physics..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="input-label">Duration</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <input
                className="input"
                type="number"
                min="0"
                placeholder="0"
                value={hours}
                onChange={e => setHours(e.target.value)}
              />
              <span className="text-muted text-xs" style={{ marginTop: 4, display: "block" }}>hours</span>
            </div>
            <div>
              <input
                className="input"
                type="number"
                min="0"
                max="59"
                placeholder="25"
                value={mins}
                onChange={e => setMins(e.target.value)}
              />
              <span className="text-muted text-xs" style={{ marginTop: 4, display: "block" }}>minutes</span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="input-label">Notes (optional)</label>
          <textarea
            className="input input-area"
            placeholder="What did you cover?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Log Session</button>
        </div>
      </div>
    </div>
  );
}

export default function StudyPlanner() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showLog, setShowLog]   = useState(false);

  const load = () => studyListAll().then(setSessions);
  useEffect(() => { load(); }, []);

  const log = async (subject: string, durationSecs: number, notes: string | null) => {
    await studyCreate(subject, durationSecs, notes);
    load();
  };

  const remove = async (id: string) => {
    await studyDelete(id);
    load();
  };

  // Subject totals
  const subjectMap = new Map<string, number>();
  sessions.forEach(s => {
    subjectMap.set(s.subject, (subjectMap.get(s.subject) ?? 0) + s.duration_secs);
  });
  const subjects = Array.from(subjectMap.entries())
    .sort((a, b) => b[1] - a[1]);

  const totalSecs = sessions.reduce((acc, s) => acc + s.duration_secs, 0);
  const maxSecs   = subjects[0]?.[1] ?? 1;

  const recent = [...sessions]
    .sort((a, b) => b.started_at - a.started_at)
    .slice(0, 30);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Planner</h1>
          <p className="page-sub">
            {sessions.length} sessions · {fmtDuration(totalSecs)} total
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowLog(true)}>
          + Log Session
        </button>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          {/* Subject totals */}
          <div>
            <div className="section-label">By Subject</div>
            {subjects.length === 0 ? (
              <div className="text-muted text-sm">No sessions yet.</div>
            ) : (
              subjects.map(([subj, secs], i) => (
                <div key={subj} style={{ marginBottom: 16 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {subj}
                    </span>
                    <span className="text-muted text-xs">{fmtDuration(secs)}</span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(secs / maxSecs) * 100}%`,
                        background: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Session history */}
          <div>
            <div className="section-label">Recent Sessions</div>
            {recent.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">⏱</div>
                <div className="empty-state__title">No sessions logged yet</div>
                <div className="empty-state__sub">Click "Log Session" to get started</div>
              </div>
            ) : (
              <div className="card" style={{ padding: "8px" }}>
                {recent.map(s => (
                  <div key={s.id} className="task-row" style={{ cursor: "default" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, color: "var(--fg)", fontWeight: 500 }}>
                        {s.subject}
                      </div>
                      {s.notes && (
                        <div className="text-muted text-xs truncate" style={{ marginTop: 2 }}>
                          {s.notes}
                        </div>
                      )}
                    </div>
                    <span className="badge badge-accent">{fmtDuration(s.duration_secs)}</span>
                    <span className="text-muted text-xs" style={{ minWidth: 52, textAlign: "right" }}>
                      {fmtDate(s.started_at)}
                    </span>
                    <div className="task-row__actions">
                      <button
                        className="btn btn-icon"
                        style={{ color: "var(--error)", fontSize: 12 }}
                        onClick={() => remove(s.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showLog && (
        <LogSessionModal onClose={() => setShowLog(false)} onLog={log} />
      )}
    </>
  );
}
