import { getCurrentWindow } from "@tauri-apps/api/window";
import type { Page } from "../types";

const PAGE_LABELS: Record<Page, string> = {
  dashboard: "Dashboard",
  tasks:     "Tasks",
  notes:     "Notes",
  goals:     "Goals",
  study:     "Study Planner",
  focus:     "Focus Mode",
};

interface Props {
  page: Page;
}

const win = getCurrentWindow();

export default function TitleBar({ page }: Props) {
  return (
    <div className="titlebar">
      <div className="titlebar__logo">
        <div className="titlebar__badge">A</div>
        <span className="titlebar__name">aathoos</span>
      </div>

      <div className="titlebar__center">
        <span className="titlebar__page-title">{PAGE_LABELS[page]}</span>
      </div>

      <div className="titlebar__controls">
        <button
          className="titlebar__btn"
          onClick={() => win.minimize()}
          title="Minimize"
        >
          &#xE921;
        </button>
        <button
          className="titlebar__btn"
          onClick={() => win.toggleMaximize()}
          title="Maximize"
        >
          &#xE922;
        </button>
        <button
          className="titlebar__btn titlebar__btn--close"
          onClick={() => win.close()}
          title="Close"
        >
          &#xE8BB;
        </button>
      </div>
    </div>
  );
}
