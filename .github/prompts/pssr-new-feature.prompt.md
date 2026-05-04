# PSSR New Feature Prompt

Use this prompt in GitHub Copilot Agent/Edit mode when implementing a new feature in the PSSR Power Platform Code App.

A new feature is a new capability, screen, workflow, interaction, data operation, lifecycle behavior, role-based behavior, or end-to-end process that goes beyond a localized enhancement.

Do not use this prompt for bug fixes, small localized enhancements, broad refactors, architecture alignment, or UI modernization unless the request explicitly includes those scopes.

## Before starting

Open and read the repo documentation set relevant to this feature, including:

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

Do not reshape the repo to match a generic Code App template while implementing a new feature.

If the feature exposes an architecture gap:

1. Implement the feature using the current repo pattern.
2. Flag the architecture gap as a non-blocking recommendation.
3. Do not move files, rename folders, introduce new layers, replace service patterns, or reorganize generated files unless explicitly approved as Architecture Alignment.

If the requested feature cannot be implemented safely without architecture changes, stop and ask whether the work should be classified as Architecture Alignment.

## Objective

Implement the requested new feature in the smallest maintainable way.

Feature summary:

TBC (not provided)

## Required intake

Before implementing, confirm or infer from the request:

- Feature objective
- Impacted area
- Intended user flow
- Acceptance criteria
- User roles impacted, if applicable
- Dataverse/data impact, if applicable
- Lifecycle/status/permission impact, if applicable
- Responsive/mobile requirements, if layout-specific
- UI impact if layout, cards, pills, badges, forms, dialogs, actions, Fluent UI, or responsive behavior is involved
- Process documentation need if the feature introduces or changes an end-to-end workflow

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
- Similar existing features or workflows

Do not invent filenames. Search and confirm actual files before editing.

## Current context to respect

Before editing:

1. Identify similar existing features or workflows.
2. Identify reusable components, hooks, helpers, services, repositories, validation logic, lifecycle utilities, and styling patterns.
3. Identify whether the feature affects UI only, data handling, lifecycle behavior, permissions, validation, documentation, routing, or configuration.
4. Identify current documentation ownership for the feature area.
5. Avoid introducing parallel patterns.
6. Avoid broad rewrites unless explicitly required and approved.

## Implementation instructions

Implement only the requested feature.

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

Prefer extending existing abstractions over creating new parallel implementations.

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
8. Validate data reload after the feature operation.
9. Do not introduce schema assumptions not confirmed from current codebase or documentation.

If Dataverse is not affected, state:

`No Dataverse impact.`

## Lifecycle/status/permission requirements

Assume no lifecycle/status/permission impact unless the request mentions lock, disable, phase, status, role, owner, approval, assignment, transition, read-only behavior, permission behavior, workflow gating, or restricted actions.

If lifecycle/status/permission behavior is affected:

1. Follow `.github/instructions/pssr-lifecycle.instructions.md`.
2. Apply defense in depth.
3. If an action is not allowed, disable or hide it in the UI when applicable.
4. Also block restricted writes/updates in the service/repository/business logic path.
5. Do not rely only on disabled UI.
6. Reuse existing lifecycle/status/permission utilities.
7. Do not broaden permissions unless explicitly required by acceptance criteria.
8. Validate allowed and restricted states.
9. Update lifecycle documentation only if behavior changes.

If lifecycle/status/permission behavior is not affected, state:

`No lifecycle/status/permission impact.`

## UI/UX requirements

If the feature affects UI behavior:

1. Follow `.github/instructions/pssr-ui.instructions.md`.
2. Reuse existing PSSR components and styling patterns.
3. Preserve responsive behavior for desktop and mobile unless explicitly scoped otherwise.
4. Preserve existing loading, empty, error, disabled, read-only, validation, and success-state patterns.
5. Keep labels, helper text, and validation messages concise and consistent with the app.
6. If cards/gallery UI are affected, follow `/docs/ui-gallery-card-anatomy.md`.
7. If pills/badges/status indicators are affected, follow `/docs/ui-pill-standard.md`.
8. If Fluent UI is touched, reuse existing Fluent UI version, provider, theme, tokens, and wrapper patterns.
9. Do not add, upgrade, or migrate Fluent UI unless explicitly approved.
10. Do not introduce a new visual pattern unless acceptance criteria require it.

If UI is not affected, state:

`No UI/UX impact.`

## Responsive/mobile requirements

Unless explicitly scoped otherwise, assume the feature must work on both desktop and mobile.

Validate:

- No horizontal overflow.
- Primary actions remain reachable.
- Forms remain usable.
- Cards/lists remain readable.
- Pills/badges/status indicators remain readable.
- Dialogs fit within viewport constraints.
- Tables or dense layouts have an existing responsive pattern or safe fallback.
- Existing responsive patterns are preserved.

## Documentation requirements

Follow `.github/instructions/pssr-documentation.instructions.md`.

Update documentation if the feature changes:

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

## Process documentation requirement

If the feature introduces or changes an end-to-end workflow/process, create or update a focused process document:

`/docs/<feature-slug>-process.md`

Include only relevant sections:

- Purpose
- Roles
- Entry points
- Steps
- Status/phase transitions
- Validations
- Edge cases
- Dataverse impact
- UI impact
- Support/troubleshooting notes if applicable

Do not create a process document for minor UI-only, validation-only, or localized behavior unless explicitly requested.

## Validation requirements

Follow `.github/instructions/pssr-validation.instructions.md`.

Use only validation commands confirmed from:

- `README.md`
- `package.json`
- Existing repo scripts
- Existing CI/developer docs

Do not invent commands.

For new features, validate:

1. Feature entry point is visible and usable.
2. Happy path works.
3. Validation/error path works.
4. Empty/loading states work if applicable.
5. Dataverse read/write/reload path if data is involved.
6. Lifecycle allowed/restricted path if lifecycle is involved.
7. Desktop/mobile behavior if UI is involved.
8. Related existing workflows still work.
9. Documentation accuracy if docs were updated.

New features must not be considered complete without manual validation steps aligned to acceptance criteria.

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
- Create a process document unless the feature introduces or changes an end-to-end workflow.
- Ignore repo documentation when relevant.
- Paste repo documentation content into the response.
- Proceed silently when documentation and code conflict.
- Claim validation passed unless it was actually run or verified.

## Acceptance criteria

TBC (not provided)

Minimum Definition of Done:

- Requested feature works.
- Existing related behavior remains unchanged.
- No unrelated refactors are introduced.
- Existing architecture and patterns are preserved.
- TypeScript has no errors if checked.
- App builds successfully if build command exists.
- Lint/tests pass if configured and run.
- Manual validation checks pass.
- Documentation is updated only if required.
- Process documentation is created or updated only if required.

## Required final response format

After implementation, respond using exactly these headings:

## 1. Request classification

New Feature

## 2. Documentation inspected

List repo documentation inspected.

If relevant documentation was missing, state:

`Relevant but not found in repo.`

Do not paste documentation content.

## 3. Files changed/added

List files changed or added.

## 4. Feature summary

Summarize the feature in concise bullets.

## 5. Existing behavior preserved

Summarize what existing behavior was preserved.

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

## 10. Process documentation

State one of:

- Process documentation not required.
- Process documentation created.
- Process documentation updated.
- Process documentation required but not completed.

List process docs if applicable.

## 11. Validation completed

List commands run and results.

Do not claim validation passed unless it was actually run or verified.

## 12. Validation not run

List commands/checks not run and why.

## 13. Manual checks required

List specific manual checks aligned to the acceptance criteria.

## 14. Risks or follow-ups

List remaining risks or follow-ups.

If none, write:

`None identified.`