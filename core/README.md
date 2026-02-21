# aathoos — Core

Platform-independent application logic. This is the heart of aathoos.

## What This Is

All business logic, data models, storage layer, and application state live here. The three platform targets (`macos/`, `windows/`, `linux/`) depend on this directory for everything that isn't UI or OS-specific.

## Rules

- No platform-specific APIs allowed — this code must compile and run on all targets
- All data models (Student, Assignment, Goal, Note, etc.) are defined here
- Storage layer (SQLite or equivalent) is managed here
- Business rules (due date calculations, grade tracking, scheduling) live here

## Dependencies

None — this is the dependency, not the dependent. All platform targets import from here.

## Status

Early stage. Technology and language decisions are being finalized. See `ARCHITECTURE.md` and `docs/decisions/` for context.
