import { useState, useEffect, useCallback } from "react";
import type { Page } from "./types";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import StudyPlanner from "./pages/StudyPlanner";
import FocusMode from "./pages/FocusMode";

const PAGE_ORDER: Page[] = ["dashboard", "tasks", "notes", "study", "goals", "focus"];

function PageContent({ page }: { page: Page }) {
  // key forces remount + re-animation on page change
  switch (page) {
    case "dashboard": return <Dashboard key="dashboard" />;
    case "tasks":     return <Tasks     key="tasks" />;
    case "notes":     return <Notes     key="notes" />;
    case "goals":     return <Goals     key="goals" />;
    case "study":     return <StudyPlanner key="study" />;
    case "focus":     return <FocusMode key="focus" />;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  // Keyboard shortcuts: Ctrl/Cmd + 1-6
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < PAGE_ORDER.length) {
        e.preventDefault();
        setPage(PAGE_ORDER[idx]);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="app">
      <TitleBar page={page} />
      <div className="layout">
        <Sidebar current={page} onNavigate={setPage} />
        <main className="content">
          <div key={page} className="page">
            <PageContent page={page} />
          </div>
        </main>
      </div>
    </div>
  );
}
