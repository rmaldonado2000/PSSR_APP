---
name: pr-review
description: "Review a change/feature for sustainability: architecture, typing, security, UX."
argument-hint: "scope=<files or feature> focus=<all|security|services|typing|ux>"
---
You are reviewing changes in this Power Apps Code App.

Rules to enforce:
- UI/screens must NOT call connectors/data sources directly.
- All data access must be in src/services/** (wrap generated clients if present).
- Typed results; normalized errors; avoid any.
- Loading/success/error/empty states for async flows.
- No secrets/tokens/tenant IDs/endpoints. No PII in logs.
- Minimal diffs; no unrelated refactors.

Output format:
- Blockers (must fix)
- Majors (should fix)
- Minors (nice to fix)
- Suggested patch snippets (small)
- Validation checklist (commands + manual checks)

If scope is unclear, ask ONE question to narrow scope.
