# PSSR Small Enhancement Prompt

Use this prompt in GitHub Copilot Agent/Edit mode when implementing a small enhancement in the PSSR Power Platform Code App.

A small enhancement is a scoped improvement to existing behavior, UI, validation, workflow, data handling, documentation, or usability that does not introduce a full new end-to-end feature or architecture change.

Do not use this prompt for broad refactors, architecture alignment, UI modernization, or large new workflows.

## Before starting

Open and read the repo documentation set relevant to this enhancement, including:

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

Do not reshape the repo to match a generic Code App template while implementing a small enhancement.

If the enhancement exposes an architecture gap:

1. Implement the enhancement using the current repo pattern.
2. Flag the architecture gap as a non-blocking recommendation.
3. Do not move files, rename folders, introduce new layers, replace service patterns, or reorganize generated files unless explicitly approved as Architecture Alignment.

## Objective

Implement the requested small enhancement with the smallest safe change.

Enhancement summary:

TBC (not provided)

## Required intake

Before implementing, confirm or infer from the request:

- Current behavior
- Desired behavior
- Where the enhancement applies
- Acceptance criteria
- Mobile/desktop impact if layout-specific
- Dataverse/data impact if save/load/update/status/mapping is involved
- Lifecycle/status/permission impact if lock, disable, phase, status, role, permission, or transition behavior is involved
- UI impact if layout, cards, pills, badges, forms, dialogs, actions, Fluent UI, or responsive behavior is involved
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
- Fluent UI usage if applicable
- Card/gallery components if applicable
- Pill/badge/status indicator components if applicable
- Existing tests if present
- Relevant documentation files

Do not invent filenames. Search and confirm actual files before editing.

## Existing behavior to preserve

Before editing:

1. Identify the current implementation path.
2. Identify the current behavior that must remain unchanged.
3. Identify reusable components, helpers, services, utilities, and documentation patterns.
4. Confirm whether the change affects UI only, data handling, lifecycle behavior, validation, documentation, or configuration.
5. Avoid introducing parallel patterns.

Preserve existing related behavior unless the acceptance criteria explicitly requires changing it.

## Targeted implementation instructions

Implement only the requested enhancement.

Scope guard:

Change only what is required to satisfy the acceptance criteria. Avoid unrelated edits, broad refactors, file reorganization, formatting-only changes, dependency changes, architecture migration, or duplicate implementations.

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

Assume no Dataverse impact unless the request mentions data load, save, update, delete, submit, status, choices, fields, relationships, record state, or data mapping.

If Dataverse or data access is affected:

1. Follow `.github/instructions/pssr-dataverse.instructions.md`.
2. Keep Dataverse calls in the existing service/repository/data access layer.
3. Do not call Dataverse directly from screens/pages/components.
4. Reuse existing mapping helpers.
5. Do not hardcode Dataverse choice/status/phase values unless already established in the repo.
6. Do not modify generated Dataverse files unless strictly required and consistent with the existing workflow.
7. Validate both read and write paths if saved data is affected.
8. Validate data reload after the enhancement.

If Dataverse is not affected, state:

`No Dataverse impact.`

## Lifecycle/status/permission requirements

Assume no lifecycle/status/permission impact unless the request mentions lock, disable, phase, status, role, owner, approval, assignment, transition, read-only behavior, permission behavior, or restricted actions.

If lifecycle/status/permission behavior is affected:

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

If the enhancement affects UI behavior:

1. Follow `.github/instructions/pssr-ui.instructions.md`.
2. Reuse existing PSSR components and styling patterns.
3. Preserve responsive behavior for desktop and mobile unless explicitly scoped otherwise.
4. Preserve existing loading, empty, error, disabled, read-only, validation, and success-state patterns.
5. If cards/gallery UI are affected, follow `/docs/ui-gallery-card-anatomy.md`.
6. If pills/badges/status indicators are affected, follow `/docs/ui-pill-standard.md`.
7. If Fluent UI is touched, reuse existing Fluent UI version, provider, theme, tokens, and wrapper patterns.
8. Do not add, upgrade, or migrate Fluent UI unless explicitly approved.
9. Do not introduce a new visual pattern unless acceptance criteria require it.

If UI is not affected, state:

`No UI/UX impact.`

## Responsive/mobile requirements

Unless explicitly scoped otherwise, assume the enhancement must work on both desktop and mobile.

Validate:

- No horizontal overflow.
- Primary actions remain reachable.
- Forms remain usable.
- Cards/lists remain readable.
- Pills/badges/status indicators remain readable.
- Dialogs fit within viewport constraints.
- Existing responsive patterns are preserved.

## Documentation requirements

Follow `.github/instructions/pssr-documentation.instructions.md`.

Update documentation only if the enhancement changes:

- User-visible behavior
- Dataverse mapping or behavior
- Lifecycle/status/permission behavior
- UI standards
- Process/workflow steps
- Support guidance
- Known constraints or limitations
- Setup, run, build, deployment, validation commands, or developer onboarding

Do not update README unless setup, run, build, deployment, validation commands, or developer onboarding changed.

Do not create or update CHANGELOG unless the repo already uses it or the user explicitly requests it.

If the enhancement does not change behavior, standards, workflow, or support guidance, documentation is usually not required.

## Validation requirements

Follow `.github/instructions/pssr-validation.instructions.md`.

Use only validation commands confirmed from:

- `README.md`
- `package.json`
- Existing repo scripts
- Existing CI/developer docs

Do not invent commands.

For small enhancements, validate:

1. Current behavior that should be preserved still works.
2. Desired behavior works.
3. Scope is localized.
4. No unrelated workflow changed.
5. UI remains consistent if UI is affected.
6. Dataverse read/write/reload path if data is involved.
7. Lifecycle allowed/restricted path if lifecycle is involved.
8. Desktop/mobile behavior if UI is involved.
9. Documentation accuracy if docs were updated.

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
- Add, upgrade, or migrate Fluent UI unless explicitly approved.
- Ignore repo documentation when relevant.
- Paste repo documentation content into the response.
- Proceed silently when documentation and code conflict.
- Claim validation passed unless it was actually run or verified.

## Acceptance criteria

TBC (not provided)

Minimum Definition of Done:

- Requested enhancement works.
- Existing related behavior remains unchanged.
- No unrelated refactors are introduced.
- TypeScript has no errors if checked.
- App builds successfully if build command exists.
- Lint/tests pass if configured and run.
- Manual validation checks pass.
- Documentation is updated only if required.

## Required final response format

After implementation, respond using exactly these headings:

## 1. Request classification

Small Enhancement

## 2. Documentation inspected

List repo documentation inspected.

If relevant documentation was missing, state:

`Relevant but not found in repo.`

Do not paste documentation content.

## 3. Files changed/added

List files changed or added.

## 4. Existing behavior preserved

Summarize what existing behavior was preserved.

## 5. Summary of enhancement

Summarize the enhancement in concise bullets.

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