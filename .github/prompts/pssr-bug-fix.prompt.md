# PSSR Bug Fix Prompt

Use this prompt in GitHub Copilot Agent/Edit mode when fixing a bug in the PSSR Power Platform Code App.

This prompt is for bug fixes only. Do not use this prompt for new features, broad refactors, architecture alignment, or UI modernization.

## Before starting

Open and read the repo documentation set relevant to this bug, including:

- `/docs/copilot-context.md`
- `README.md` if present
- `/docs/pssr-lifecycle-behavior.md` if lifecycle, status, phase, role, permission, lock, transition, or restricted-action behavior is involved
- `/docs/pssr-lifecycle-schema.md` if Dataverse lifecycle fields, status, phase, choices, or mappings are involved
- `/docs/ui-gallery-card-anatomy.md` if cards or gallery UI are involved
- `/docs/ui-pill-standard.md` if pills, badges, status indicators, or lifecycle labels are involved
- Any relevant `/docs/*-process.md`

Inspect the current codebase before editing.

Treat the current source code and repo documentation set as authoritative project context.

Do not paste, quote, duplicate, or summarize the full content of any repo documentation file.

## Existing architecture rule

The current PSSR source code is the implementation truth.

Do not reshape the repo to match a generic Code App template while fixing a bug.

If the bug exposes an architecture gap:

1. Fix the bug using the current repo pattern.
2. Flag the architecture gap as a non-blocking recommendation.
3. Do not move files, rename folders, introduce new layers, replace service patterns, or reorganize generated files unless explicitly approved as Architecture Alignment.

## Objective

Fix the reported bug with the smallest safe change.

Bug summary:

TBC (not provided)

## Required intake

Before implementing, confirm or infer from the request:

- Issue summary
- Expected behavior
- Observed behavior
- Reproduction steps
- Where the issue happens
- Environment if relevant
- Acceptance criteria
- Dataverse impact if data load/save/update/status/mapping is involved
- Lifecycle impact if lock/disable/status/phase/role/permission/transition behavior is involved
- UI impact if layout, cards, pills, badges, forms, dialogs, or responsive behavior is involved
- Documentation impact if behavior, lifecycle, Dataverse, UI standards, support guidance, or process docs change

If required information is missing, ask only one question at a time.

Do not ask the user to fill a template.

If a detail cannot be confirmed from the request, repo docs, or source code, write:

`TBC (not confirmed from current codebase)`

## Files/areas to inspect before editing

Search the repo and inspect the relevant:

- Screens/routes/pages
- Components
- Hooks/utilities
- Services/repository/data access layer
- Dataverse generated types/services/models
- Dataverse mapping helpers
- Lifecycle/status/permission utilities
- Validation helpers
- Styling/UI standards
- Card/gallery components if applicable
- Pill/badge/status indicator components if applicable
- Existing tests if present
- Relevant documentation files

Do not invent filenames. Search and confirm actual files before editing.

## Root-cause investigation instructions

Before changing code:

1. Reproduce or reason through the bug from the provided steps.
2. Identify the actual code path involved.
3. Identify the likely root cause.
4. Check whether the issue is caused by:
   - Component state
   - Props or event handlers
   - Conditional rendering
   - Data loading
   - Dataverse save/update/delete/submit behavior
   - Dataverse mapping
   - Choice/status/phase value handling
   - Lifecycle/status/permission checks
   - Validation logic
   - Responsive layout behavior
   - Documentation/code mismatch
5. Briefly state the likely root cause before applying the fix.

## Targeted fix instructions

Implement only what is required to satisfy the acceptance criteria.

Scope guard:

Change only what is required to fix the bug. Avoid unrelated edits, broad refactors, file reorganization, formatting-only changes, dependency changes, architecture migration, or duplicate implementations.

Preserve:

- Existing PSSR architecture
- Existing naming conventions
- Existing component patterns
- Existing service/repository boundaries
- Existing Dataverse patterns
- Existing lifecycle/status/permission behavior
- Existing UI standards
- Existing documentation conventions

## Dataverse/data requirements

If the bug affects Dataverse or data access:

1. Follow `.github/instructions/pssr-dataverse.instructions.md`.
2. Keep Dataverse calls in the existing service/repository/data access layer.
3. Do not call Dataverse directly from screens/pages/components.
4. Reuse existing mapping helpers.
5. Do not hardcode Dataverse choice/status/phase values unless already established in the repo.
6. Do not modify generated Dataverse files unless strictly required and consistent with the existing workflow.
7. Validate both read and write paths if saved data is affected.
8. Validate data reload after the fix.

If Dataverse is not affected, state:

`No Dataverse impact.`

## Lifecycle/status/permission requirements

If the bug affects lifecycle, status, phase, role, permission, lock, owner, approval, assignment, transition, disabled/read-only behavior, or restricted actions:

1. Follow `.github/instructions/pssr-lifecycle.instructions.md`.
2. Apply defense in depth.
3. If an action is not allowed, disable or hide it in the UI when applicable.
4. Also block restricted writes/updates in the service/repository/business logic path.
5. Do not rely only on disabled UI.
6. Reuse existing lifecycle/status/permission utilities.
7. Do not broaden permissions unless explicitly required by acceptance criteria.
8. Validate allowed and restricted states.

If lifecycle/status/permission behavior is not affected, state:

`No lifecycle/status/permission impact.`

## UI/UX requirements

If the bug affects UI behavior:

1. Follow `.github/instructions/pssr-ui.instructions.md`.
2. Reuse existing PSSR components and styling patterns.
3. Preserve responsive behavior for desktop and mobile unless the bug is platform-specific.
4. Preserve existing loading, empty, error, disabled, read-only, validation, and success-state patterns.
5. If cards/gallery UI are affected, follow `/docs/ui-gallery-card-anatomy.md`.
6. If pills/badges/status indicators are affected, follow `/docs/ui-pill-standard.md`.
7. If Fluent UI is touched, reuse existing Fluent UI version, provider, theme, tokens, and wrapper patterns.
8. Do not add, upgrade, or migrate Fluent UI unless explicitly approved.

If UI is not affected, state:

`No UI/UX impact.`

## Documentation requirements

Follow `.github/instructions/pssr-documentation.instructions.md`.

Update documentation only if the bug fix changes:

- User-visible behavior
- Dataverse mapping or behavior
- Lifecycle/status/permission behavior
- UI standards
- Process/workflow steps
- Support guidance
- Known constraints or limitations

Do not update README unless setup, run, build, deployment, validation commands, or developer onboarding changed.

Do not create or update CHANGELOG unless the repo already uses it or the user explicitly requests it.

If the bug fix restores already documented behavior, documentation is usually not required.

## Validation requirements

Follow `.github/instructions/pssr-validation.instructions.md`.

Use only validation commands confirmed from:

- `README.md`
- `package.json`
- Existing repo scripts
- Existing CI/developer docs

Do not invent commands.

For bug fixes, validate:

1. Original reproduction steps.
2. Expected behavior now works.
3. Observed broken behavior no longer occurs.
4. Related regression path still works.
5. Dataverse read/write/reload path if data is involved.
6. Lifecycle allowed/restricted path if lifecycle is involved.
7. Desktop/mobile behavior if UI is involved.
8. Documentation accuracy if docs were updated.

## Constraints and anti-patterns to avoid

Do not:

- Perform unrelated refactors.
- Rename unrelated files or symbols.
- Reorganize folders.
- Add new dependencies unless explicitly required and approved.
- Reshape the repo to match a generic template.
- Create duplicate components, helpers, services, repositories, validation logic, lifecycle logic, or styling patterns.
- Hardcode Dataverse choice/status/phase values unless already established.
- Modify generated Dataverse files unless strictly required.
- Add direct Dataverse calls inside screens/pages/components.
- Implement lifecycle restrictions only in the UI.
- Ignore repo documentation when relevant.
- Paste repo documentation content into the response.
- Proceed silently when documentation and code conflict.
- Claim validation passed unless it was actually run or verified.

## Acceptance criteria

TBC (not provided)

Minimum Definition of Done:

- Bug is fixed.
- Expected behavior works.
- Observed broken behavior no longer occurs.
- Existing related behavior remains unchanged.
- No unrelated refactors are introduced.
- TypeScript has no errors if checked.
- App builds successfully if build command exists.
- Lint/tests pass if configured and run.
- Manual regression checks pass.
- Documentation is updated only if required.

## Required final response format

After implementation, respond using exactly these headings:

## 1. Request classification

Bug Fix

## 2. Documentation inspected

List repo documentation inspected.

If relevant documentation was missing, state:

`Relevant but not found in repo.`

Do not paste documentation content.

## 3. Files changed/added

List files changed or added.

## 4. Root cause

Briefly state the confirmed or likely root cause.

## 5. Summary of fix

Summarize the fix in concise bullets.

## 6. Dataverse/data impact

State one of:

- No Dataverse impact.
- Dataverse impact implemented.
- TBC (not confirmed from current codebase).

## 7. Lifecycle/status/permission impact

State one of:

- No lifecycle/status/permission impact.
- Lifecycle/status/permission impact implemented.
- TBC (not confirmed from current codebase).

## 8. UI/UX impact

Summarize UI, responsive, card/gallery, pill/badge, Fluent UI, validation/error/disabled-state impact if applicable.

## 9. Documentation updated

State one of:

- Documentation update not required.
- Documentation updated.
- Documentation update required but not completed.

List updated docs if applicable.

## 10. Validation completed

List commands run and results.

Do not claim validation passed unless it was actually run or verified.

## 11. Validation not run

List commands/checks not run and why.

## 12. Manual checks required

List specific manual checks aligned to the acceptance criteria.

## 13. Risks or follow-ups

List remaining risks or follow-ups.

If none, write:

`None identified.`