# Architecture

High-level design decisions for aathoos.

## Why Native?

aathoos is a native desktop app, not an Electron/web wrapper. Reasons:

- **Performance** — native apps start faster, use less memory, and feel responsive
- **OS integration** — deep access to notifications, file system, system tray, keyboard shortcuts, accessibility APIs
- **Offline-first** — no server dependency, your data lives on your machine
- **Student-friendly** — doesn't eat your laptop's battery or RAM while you're already running a browser, IDE, and Zoom

## Core / Platform Split

The codebase is split into two layers:

```
┌─────────┐  ┌───────────┐  ┌─────────┐
│  macOS  │  │  Windows  │  │  Linux  │
│   UI    │  │    UI     │  │   UI    │
└────┬────┘  └─────┬─────┘  └────┬────┘
     │             │              │
     └─────────────┼──────────────┘
                   │
            ┌──────┴──────┐
            │    core/    │
            │             │
            │ Data models │
            │ Storage     │
            │ Business    │
            │ logic       │
            └─────────────┘
```

- **`core/`** — platform-independent. Data models, storage (SQLite or equivalent), business rules, application state. No OS-specific APIs. Must compile on all targets.
- **`macos/`**, **`windows/`**, **`linux/`** — platform-specific UI and OS integration. Each imports `core/` and wraps it in a native interface.

## Local-First Data

All data is stored locally on the user's machine. There is no cloud backend, no accounts, no syncing (for now). This keeps things simple, private, and fast.

If sync is ever added, it will be opt-in and built on top of the local storage layer — not the other way around.

## Tech Stack

**Not yet decided.** The language and framework choices for `core/` and the platform targets are the most important decisions the project will make. They will be documented as Architecture Decision Records in `docs/decisions/`.

Candidates under consideration:

| Component | Options |
|-----------|---------|
| `core/` | Rust, C++, Go |
| `macos/` | Swift/SwiftUI, Rust + native bindings |
| `windows/` | C++/WinUI 3, Rust + native bindings |
| `linux/` | GTK4/libadwaita, Qt6 |
| Storage | SQLite, custom file format |

## Web

The `web/` directory is **not** the product. It's a simple React landing page that explains what aathoos is and links to downloads. The product is the desktop app.
