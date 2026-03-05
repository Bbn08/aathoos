import { useState, useEffect, useRef, useCallback } from "react";
import { studyCreate } from "../api";

const WORK_SECS  = 25 * 60;
const SHORT_SECS = 5  * 60;
const LONG_SECS  = 15 * 60;

type Phase = "work" | "short-break" | "long-break";

const PHASE_LABELS: Record<Phase, string> = {
  "work":        "Focus",
  "short-break": "Short Break",
  "long-break":  "Long Break",
};

const PHASE_DURATIONS: Record<Phase, number> = {
  "work":        WORK_SECS,
  "short-break": SHORT_SECS,
  "long-break":  LONG_SECS,
};

function pad(n: number) { return String(n).padStart(2, "0"); }

function fmtTime(secs: number) {
  return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
}

const CIRCUMFERENCE = 2 * Math.PI * 110;  // radius = 110

export default function FocusMode() {
  const [phase, setPhase]       = useState<Phase>("work");
  const [remaining, setRemaining] = useState(WORK_SECS);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const [subject, setSubject]   = useState("Focus Session");
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const workStartRef            = useRef<number | null>(null);

  const total = PHASE_DURATIONS[phase];
  const ratio = remaining / total;
  const offset = CIRCUMFERENCE * (1 - ratio);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  const advance = useCallback(async () => {
    stop();
    // Log completed work session
    if (phase === "work") {
      const elapsed = WORK_SECS;
      await studyCreate(subject || "Focus Session", elapsed, null);
      const next = (sessions + 1) % 4 === 0 ? "long-break" : "short-break";
      setSessions(s => s + 1);
      setPhase(next);
      setRemaining(PHASE_DURATIONS[next]);
    } else {
      setPhase("work");
      setRemaining(WORK_SECS);
    }
  }, [phase, sessions, stop, subject]);

  useEffect(() => {
    if (!running) return;
    workStartRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { advance(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, advance]);

  const toggle = () => {
    if (running) stop();
    else setRunning(true);
  };

  const reset = () => {
    stop();
    setRemaining(PHASE_DURATIONS[phase]);
  };

  const switchPhase = (p: Phase) => {
    stop();
    setPhase(p);
    setRemaining(PHASE_DURATIONS[p]);
  };

  const phaseColor = phase === "work" ? "var(--accent)" : "var(--success)";

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Focus Mode</h1>
          <p className="page-sub">Pomodoro timer · {sessions} session{sessions !== 1 ? "s" : ""} today</p>
        </div>
      </div>

      <div className="page-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
        {/* Phase selector */}
        <div className="filter-row" style={{ justifyContent: "center", marginBottom: 32 }}>
          {(["work", "short-break", "long-break"] as Phase[]).map(p => (
            <button
              key={p}
              className={`chip${phase === p ? " active" : ""}`}
              onClick={() => switchPhase(p)}
            >
              {PHASE_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Ring timer */}
        <div className="focus-ring-wrap">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle
              className="focus-ring-track"
              cx="130" cy="130" r="110"
            />
            <circle
              className="focus-ring-progress"
              cx="130" cy="130" r="110"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              stroke={phaseColor}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
            />
          </svg>
          <div className="focus-time">
            <div className="focus-time__display">{fmtTime(remaining)}</div>
            <div className="focus-time__phase">{PHASE_LABELS[phase]}</div>
          </div>
        </div>

        {/* Subject input */}
        <div style={{ width: 260, marginBottom: 24 }}>
          <input
            className="input"
            style={{ textAlign: "center" }}
            placeholder="Subject (optional)"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3" style={{ marginBottom: 16 }}>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
          <button
            className="btn btn-primary"
            style={{
              minWidth: 110,
              background: running ? "var(--surface3)" : phaseColor,
              border: running ? "1px solid var(--border)" : "none",
              color: running ? "var(--fg)" : "white",
              fontSize: 15,
              padding: "10px 28px",
            }}
            onClick={toggle}
          >
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button className="btn btn-ghost" onClick={advance}>Skip →</button>
        </div>

        {/* Session dots */}
        {sessions > 0 && (
          <div className="flex gap-2" style={{ marginTop: 8 }}>
            {Array.from({ length: sessions }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--accent)",
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        )}

        {/* Tips */}
        <div
          className="card"
          style={{ marginTop: 32, width: "100%", maxWidth: 440, textAlign: "center", opacity: 0.7 }}
        >
          <div className="text-muted text-sm">
            {phase === "work"
              ? "🎯 Stay focused. Distractions can wait."
              : phase === "short-break"
              ? "☕ Take a quick stretch. You've earned it."
              : "🌿 Rest well. Longer breaks boost retention."}
          </div>
        </div>
      </div>
    </>
  );
}
