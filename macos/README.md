# aathoos — macOS

The native macOS application target for aathoos.

## What This Is

The macOS app built with platform-native technologies. It provides the macOS-native user interface, integrates with macOS system APIs (notifications, Spotlight, menu bar), and calls into `core/` for all business logic and data operations.

## Dependencies

- `core/` — platform-independent business logic (required)
- macOS 13.0+ (Ventura or later)
- Xcode 15+ (version TBD)

## Status

Early stage. No source code yet. Architecture decisions are being finalized. See `ARCHITECTURE.md` and `docs/decisions/` for context.

## Contributing

If you want to help shape the macOS target — technology choices, UI patterns, architecture — open a discussion or issue on GitHub. This is the right time to get involved before decisions are locked in.
