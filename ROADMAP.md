# Roadmap

Public roadmap for aathoos. Updated as the project progresses.

---

## Phase 0 — Foundation (current)

Setting up the project for real development.

- [x] Project vision and README
- [x] Landing page (`web/`)
- [x] Repository structure (platform dirs, core, docs, scripts)
- [x] Contributing guidelines and community docs
- [x] GitHub issue templates and CI
- [ ] Choose tech stack for `core/` (ADR pending)
- [ ] Choose UI toolkit for each platform (ADR pending)
- [ ] Set up build system

## Phase 1 — Core App Shell

Get a window on screen on all three platforms, powered by `core/`.

- [ ] Implement `core/` data models (Student, Course, Assignment, Note)
- [ ] Implement `core/` storage layer (local SQLite)
- [ ] macOS app shell — window, navigation, basic layout
- [ ] Windows app shell — window, navigation, basic layout
- [ ] Linux app shell — window, navigation, basic layout
- [ ] CI builds for all three platforms

## Phase 2 — Feature Modules

Build the features students actually need.

- [ ] Dashboard — overview of day, week, semester
- [ ] Task & Assignment Tracker — create, edit, prioritize, filter
- [ ] Notes — structured note-taking by subject
- [ ] Study Planner — schedule builder
- [ ] Goal Tracking — semester and weekly goals

## Phase 3 — Polish & Ecosystem

Make it feel like a real product.

- [ ] Focus Mode — distraction blocking with OS integration
- [ ] Resource Hub — organize files and references
- [ ] Dark/Light theme — system-aware with manual override
- [ ] Data export — JSON, CSV, Markdown
- [ ] First public release
- [ ] Package for distribution (DMG, MSI, AppImage/deb/rpm)

---

> This roadmap is a guide, not a contract. Priorities may shift based on community feedback and contributor interest.
