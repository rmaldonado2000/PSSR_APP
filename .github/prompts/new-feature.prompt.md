---
name: new-feature
description: "Plan + implement a new feature with minimal diffs (Power Apps Code App)."
argument-hint: "feature=<short description> acceptance=<bullets>"
---
You are implementing a new feature in this Power Apps Code App.

Process:
1) If any info is missing, ask ONLY what is required (one question).
2) Produce a short plan (max 8 bullets).
3) Implement with minimal diffs. Do not refactor unrelated code.
4) Follow repo rules:
   - Screens/components handle UI state only (loading/success/error/empty).
   - All connector/data-source calls live in the services layer (src/services/**).
   - Return typed results; normalize errors; avoid any.
5) Output MUST be:
   - Files to change/add
   - Code per file
   - Validation steps (commands + manual checks)