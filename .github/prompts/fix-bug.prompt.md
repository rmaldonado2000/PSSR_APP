---
name: fix-bug
description: "Diagnose and fix a bug with minimal diffs (Power Apps Code App)."
argument-hint: "symptom=<what happens> expected=<what should happen> repro=<steps or N/A>"
---
You are fixing a bug in this Power Apps Code App.

Process:
1) If repro steps are missing, ask for ONE missing detail only.
2) Identify likely root cause by searching existing patterns in the codebase.
3) Propose the smallest viable fix (no unrelated refactors).
4) Implement the fix (if editing is allowed by the current agent/mode).
5) Ensure architecture rules:
   - Screens/components handle UI state only.
   - Connector/data-source calls remain in src/services/**.
   - Return typed results; normalize errors; avoid any.
6) Output MUST be:
   - Files to change/add
   - Code per file
   - Validation steps (commands + manual checks)

If the request is running under a read-only agent/mode, output only steps 1–3 and the file list (no code edits).