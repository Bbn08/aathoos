import { useState, useEffect, useRef } from "react";
import { taskListAll, goalListAll, studyListAll } from "../api";
import type { Task, Goal, StudySession } from "../types";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function fmtDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function fmtStudy(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function priorityBadge(p: Task["priority"]) {
  const map = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
  return map[p];
}

// Animated counter hook
function useCounter(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// 7-day study bar chart
function StudyChart({ sessions }: { sessions: StudySession[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 1000;
    const dayEnd   = dayStart + 86400;
    const secs = sessions
      .filter(s => s.started_at >= dayStart && s.started_at < dayEnd)
      .reduce((acc, s) => acc + s.duration_secs, 0);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
      secs,
      isToday: i === 6,
    };
  });

  const maxSecs = Math.max(...days.map(d => d.secs), 1);

  return (
    <div className="study-chart">
      {days.map((d, i) => (
        <div key={i} className="study-chart__col">
          <div className="study-chart__bar-wrap">
            <div
              className={`study-chart__bar${d.isToday ? " today" : ""}`}
              style={{ height: `${Math.max((d.secs / maxSecs) * 100, d.secs > 0 ? 4 : 0)}%` }}
            />
          </div>
          <span className="study-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [goals, setGoals]     = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    Promise.all([taskListAll(), goalListAll(), studyListAll()]).then(
      ([t, g, s]) => { setTasks(t); setGoals(g); setSessions(s); }
    );
  }, []);

  const pending = tasks.filter(t => !t.is_completed).length;
  const activeGoals = goals.filter(g => !g.is_completed).length;

  const todayStart = new Date().setHours(0,0,0,0) / 1000;
  const todaySecs  = sessions
    .filter(s => s.started_at >= todayStart)
    .reduce((acc, s) => acc + s.duration_secs, 0);

  const cTasks  = useCounter(pending);
  const cNotes  = useCounter(0); // notes count not fetched here, keep 0 for perf
  const cGoals  = useCounter(activeGoals);

  const incompleteTasks = tasks.filter(t => !t.is_completed).slice(0, 7);
  const topGoals        = goals.filter(g => !g.is_completed).slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting()} 👋</h1>
          <p className="page-sub">{fmtDate()}</p>
        </div>
      </div>

      <div className="page-body">
        {/* Stat cards */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card__glow" style={{ background: "var(--accent)" }} />
            <span className="stat-card__icon">✓</span>
            <div className="stat-card__value">{cTasks}</div>
            <div className="stat-card__label">Pending tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__glow" style={{ background: "var(--info)" }} />
            <span className="stat-card__icon">≡</span>
            <div className="stat-card__value">{tasks.length}</div>
            <div className="stat-card__label">Total tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__glow" style={{ background: "var(--warning)" }} />
            <span className="stat-card__icon">◎</span>
            <div className="stat-card__value">{cGoals}</div>
            <div className="stat-card__label">Active goals</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__glow" style={{ background: "var(--success)" }} />
            <span className="stat-card__icon">⏱</span>
            <div className="stat-card__value">{fmtStudy(todaySecs)}</div>
            <div className="stat-card__label">Studied today</div>
          </div>
        </div>

        {/* Two column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16, marginBottom: 20 }}>
          {/* Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semi" style={{ fontSize: 14 }}>Pending Tasks</span>
              <span className="text-muted text-sm">{pending} remaining</span>
            </div>
            {incompleteTasks.length === 0 ? (
              <div className="text-muted text-sm" style={{ padding: "12px 0" }}>
                All caught up! ✓
              </div>
            ) : (
              incompleteTasks.map(t => (
                <div key={t.id} className="task-row" style={{ cursor: "default" }}>
                  <div
                    className="task-row__priority-bar"
                    style={{
                      background: t.priority === "High" ? "var(--error)"
                        : t.priority === "Medium" ? "var(--warning)" : "var(--info)"
                    }}
                  />
                  <span className="task-row__title">{t.title}</span>
                  <span className={`badge ${priorityBadge(t.priority)}`}>
                    {t.priority.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Goals */}
          <div className="card">
            <div className="font-semi mb-3" style={{ fontSize: 14 }}>Active Goals</div>
            {topGoals.length === 0 ? (
              <div className="text-muted text-sm">No goals yet.</div>
            ) : (
              topGoals.map(g => (
                <div key={g.id} style={{ marginBottom: 14 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                      {g.title}
                    </span>
                    <span className="text-muted text-xs">{Math.round(g.progress * 100)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${g.progress * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Study chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semi" style={{ fontSize: 14 }}>7-Day Study Activity</span>
            <span className="text-muted text-sm">{sessions.length} sessions total</span>
          </div>
          <StudyChart sessions={sessions} />
        </div>
      </div>
    </>
  );
}
