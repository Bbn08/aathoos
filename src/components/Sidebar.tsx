import type { Page } from "../types";

interface NavItem {
  page: Page;
  icon: string;
  label: string;
  kbd: string;
}

const NAV: NavItem[] = [
  { page: "dashboard", icon: "⊞",  label: "Dashboard",    kbd: "1" },
  { page: "tasks",     icon: "✓",  label: "Tasks",         kbd: "2" },
  { page: "notes",     icon: "≡",  label: "Notes",         kbd: "3" },
  { page: "study",     icon: "⏱",  label: "Study Planner", kbd: "4" },
  { page: "goals",     icon: "◎",  label: "Goals",         kbd: "5" },
  { page: "focus",     icon: "⬤",  label: "Focus Mode",    kbd: "6" },
];

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
}

export default function Sidebar({ current, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar__branding">
        <div className="sidebar__logo">
          <div className="sidebar__badge">A</div>
          <div>
            <div className="sidebar__name">aathoos</div>
            <div className="sidebar__sub">Student OS</div>
          </div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map(({ page, icon, label, kbd }) => (
          <button
            key={page}
            className={`sidebar__nav-btn${current === page ? " active" : ""}`}
            onClick={() => onNavigate(page)}
          >
            <span className="sidebar__nav-icon">{icon}</span>
            <span>{label}</span>
            <span className="sidebar__kbd">⌘{kbd}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__version">v1.0.0</span>
      </div>
    </aside>
  );
}
