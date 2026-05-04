---
applyTo: "**/*.{ts,tsx}"
---
# React + TypeScript rules (Code App)

- Use functional React components + hooks. Avoid class components.
- Keep UI components presentational; move business logic to hooks/services.
- Prefer strong typing. Avoid `any` unless unavoidable; if used, add a short comment why.
- Keep components small and composable; extract reusable logic into `src/shared` or feature folders.
- Always implement loading + error + empty states for async flows.
- Prefer minimal changes; do not refactor unrelated code.