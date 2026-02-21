# Contributing to aathoos

Thanks for wanting to contribute! aathoos is a community-driven project and we welcome all kinds of contributions.

## Project Structure

```
macos/      macOS application target
windows/    Windows application target
linux/      Linux application target
core/       Cross-platform business logic (all platforms depend on this)
web/        Landing page (React + Vite)
docs/       Technical documentation and Architecture Decision Records
scripts/    Developer tooling and build scripts
assets/     Source brand assets (logo, icons)
design/     UI/UX wireframes and design specs
tests/      Cross-component integration tests
```

Each directory has its own `README.md` explaining what it is, what goes there, and what doesn't.

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your work (`git checkout -b feature/your-idea`)
4. **Make your changes** and test them
5. **Commit** with a clear message (`git commit -m 'add: your feature description'`)
6. **Push** to your fork (`git push origin feature/your-idea`)
7. **Open a Pull Request** against `main`

## Commit Message Format

Use this format for commit messages:

- `add: ...` — new feature
- `fix: ...` — bug fix
- `update: ...` — improvement to existing feature
- `refactor: ...` — code restructuring
- `docs: ...` — documentation only
- `test: ...` — adding or updating tests

## Platform-Specific Work

aathoos is a native desktop app targeting macOS, Windows, and Linux.

- `macos/` — macOS-specific code
- `windows/` — Windows-specific code
- `linux/` — Linux-specific code
- `core/` — cross-platform business logic (no OS-specific APIs)

If your contribution is platform-specific, make sure to note which OS it targets in your PR.

## Architecture Decision Records

Major technical decisions (language choice, UI toolkit, storage engine, etc.) are documented as ADRs in `docs/decisions/`. If you're proposing a significant architectural change, write an ADR first and open it as a PR for discussion before implementing.

See `docs/decisions/README.md` for the ADR format.

## Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Include your OS and version when reporting bugs
- One issue per bug or feature request
- For platform-specific issues, use the "Platform-Specific Issue" template

## Code of Conduct

Be respectful. We're all here to build something useful for students. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
