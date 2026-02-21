# aathoos — Windows

The native Windows application target for aathoos.

## What This Is

The Windows app built with platform-native technologies. It provides the Windows-native user interface, integrates with Windows system APIs (taskbar, notifications, Action Center), and calls into `core/` for all business logic and data operations.

## Dependencies

- `core/` — platform-independent business logic (required)
- Windows 10 1903+ or later
- Visual Studio 2022+ or equivalent build toolchain

## Status

Early stage. No source code yet. Architecture decisions are being finalized. See `ARCHITECTURE.md` and `docs/decisions/` for context.

## Contributing

If you want to help shape the Windows target — technology choices, UI patterns, architecture — open a discussion or issue on GitHub. This is the right time to get involved before decisions are locked in.
