# aathoos — Linux

The native Linux application target for aathoos.

## What This Is

The Linux app built with platform-native technologies. It provides a native Linux user interface (GTK4/libadwaita or Qt6 — TBD), integrates with Linux desktop APIs (D-Bus notifications, system tray), and calls into `core/` for all business logic and data operations.

## Dependencies

- `core/` — platform-independent business logic (required)
- GTK4/libadwaita or Qt6 (TBD)
- GCC 12+ or Clang 15+
- Targets: Debian/Ubuntu LTS, Fedora, Arch

## Status

Early stage. No source code yet. Architecture decisions are being finalized. See `ARCHITECTURE.md` and `docs/decisions/` for context.

## Contributing

If you want to help shape the Linux target — technology choices, UI toolkit, packaging formats — open a discussion or issue on GitHub. This is the right time to get involved before decisions are locked in.
