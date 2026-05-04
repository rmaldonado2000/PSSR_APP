---
description: "PSSR-specific lifecycle, status, phase, role, permission, lock, transition, and defense-in-depth rules."
applyTo: "**/*.{ts,tsx}"
---

# PSSR Lifecycle Instructions

These instructions apply to lifecycle, status, phase, permission, lock, transition, and restricted-action behavior in the PSSR Power Platform Code App.

Use these instructions when the request involves:

- Lifecycle state
- Status or phase values
- Role-based behavior
- Permission checks
- Lock/read-only behavior
- Disabled or hidden actions
- Approval or assignment behavior
- Submit, reopen, transition, or workflow actions
- Dataverse fields that drive lifecycle behavior
- UI behavior controlled by lifecycle/status/phase
- Service/repository write restrictions based on lifecycle/status/phase

## Priority

Follow this priority order:

1. Current PSSR source code and existing implementation patterns.
2. `PSSR_app/.github/copilot-instructions.md`.
3. Repo documentation set.
4. This targeted lifecycle instruction.
5. Generic user-level Code App instructions.

If this instruction conflicts with current repo code or project-level instructions, follow the repo-specific implementation truth and flag the inconsistency.

## Repo documentation set

Before changing lifecycle-related logic, inspect the relevant repo documentation set.

Always inspect:

- `/docs/copilot-context.md`
- `README.md` if present

Inspect when relevant:

- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- Any relevant `/docs/*-process.md`
- Any other request-relevant documentation in the repo

Do not paste, quote, duplicate, or summarize the full content of repo documentation.

## Existing architecture rule

For normal bug fixes, small enhancements, new features, documentation updates, and investigations, the current PSSR source code is the implementation truth.

Do not reshape lifecycle architecture to match a generic template during normal implementation work.

If the current repo differs from generic Code App starter patterns:

1. Preserve the current repo pattern for the requested change.
2. Reuse existing lifecycle utilities, status helpers, permission checks, services, hooks, UI patterns, and Dataverse mappings.
3. Flag architecture gaps as non-blocking recommendations.
4. Do not move files, rename folders, introduce new lifecycle layers, replace service patterns, or reorganize lifecycle logic unless the request is explicitly classified as Architecture Alignment.

## Mandatory first steps

Before editing lifecycle-related code:

1. Inspect the relevant repo documentation.
2. Inspect existing lifecycle/status/phase utilities.
3. Inspect current permission and role handling.
4. Inspect current UI gating behavior.
5. Inspect current service/repository write-path enforcement.
6. Identify current allowed states.
7. Identify current restricted states.
8. Identify any Dataverse status, phase, choice, or lifecycle field dependency.
9. Confirm whether documentation must be updated.
10. Make the smallest safe change.

## Defense-in-depth rule

Lifecycle and permission enforcement must use defense in depth.

If an action is not allowed:

1. The UI must disable or hide the action when applicable.
2. The service/repository/business logic path must also block the restricted write or update.
3. The implementation must not rely only on disabled UI.
4. The implementation must not rely only on client-side visual state.
5. The implementation must not allow stale UI state to bypass lifecycle rules.

This applies to actions such as:

- Save
- Submit
- Update status
- Update phase
- Approve
- Reject
- Assign
- Reopen
- Delete
- Edit locked fields
- Any workflow transition

## UI gating rules

When lifecycle/status/phase/permission rules affect UI:

1. Reuse existing PSSR UI gating patterns.
2. Reuse existing disabled, hidden, read-only, tooltip, helper text, or validation patterns.
3. Do not create a new visual pattern unless required by acceptance criteria.
4. Do not duplicate lifecycle logic inside JSX if reusable utilities already exist.
5. Keep UI rules aligned with service/repository write-path rules.
6. Validate that restricted actions are not available through alternate UI paths.

If the action is disabled, the UI should clearly follow existing app conventions for explaining or indicating why the action is unavailable.

## Write-path enforcement rules

When lifecycle/status/phase/permission rules affect data writes:

1. Enforce restrictions before Dataverse write/update/delete/submit operations.
2. Reuse existing lifecycle/status/permission utilities where available.
3. Do not duplicate lifecycle checks if a shared function exists.
4. Do not broaden write permissions unless explicitly required by acceptance criteria.
5. Do not allow disallowed status or phase transitions.
6. Do not allow restricted field updates when a record is locked or read-only.
7. Validate restricted writes fail safely and predictably.
8. Preserve existing error handling and user feedback patterns.

## Status/phase/choice value rules

Do not hardcode lifecycle, status, phase, or Dataverse choice values unless the same values are already established in the current repo.

Before using lifecycle values:

1. Search existing code for constants, enums, generated types, mapping helpers, or documented values.
2. Reuse existing constants or helpers.
3. Inspect `/docs/pssr-lifecycle-schema.md` when present.
4. Inspect `/docs/pssr-lifecycle-behavior.md` when present.
5. If values are not confirmed, write:
   `TBC (not confirmed from current codebase)`
6. Do not invent numeric values, labels, option set values, or transitions.

## Transition rules

For status, phase, approval, assignment, or lifecycle transitions:

1. Preserve existing transition rules unless acceptance criteria explicitly changes them.
2. Validate the source state.
3. Validate the target state.
4. Validate the user role or permission.
5. Validate required fields or preconditions.
6. Prevent invalid transitions in the UI.
7. Block invalid transitions in the write path.
8. Preserve existing audit/support guidance where present.
9. Update documentation if transition behavior changes.

## Role and permission rules

For role-based behavior:

1. Reuse existing role/permission utilities.
2. Do not infer or invent roles.
3. Do not broaden access unless explicitly required.
4. Do not implement role checks only in UI components.
5. Keep role checks consistent across UI and write path.
6. Validate both allowed and restricted users or role states when applicable.
7. If role source is unclear, write:
   `TBC (not confirmed from current codebase)`

## Dataverse integration rules

If lifecycle behavior depends on Dataverse fields, choices, lookups, status, phase, or record state:

1. Follow `pssr-dataverse.instructions.md`.
2. Keep Dataverse calls in the existing service/repository/data access layer.
3. Do not call Dataverse directly from screens/pages/components.
4. Reuse existing mapping helpers.
5. Do not hardcode choice/status/phase values unless already established.
6. Do not modify generated Dataverse files unless strictly required and consistent with the existing workflow.
7. Validate read and write paths.
8. Validate data reload after lifecycle updates.

## Documentation update rules

Update documentation only if lifecycle behavior changes.

Documentation may be required when changing:

- Lifecycle behavior
- Status/phase transition rules
- Role or permission rules
- Lock/read-only behavior
- Disabled or hidden action behavior
- Dataverse lifecycle schema
- Status/phase/choice mappings
- Process steps
- Support guidance
- UI lifecycle indicators

Potential documentation targets:

- `/docs/copilot-context.md`
- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- Relevant `/docs/*-process.md`
- `/docs/ui-pill-standard.md` if status/phase indicators change
- `/docs/ui-gallery-card-anatomy.md` if card lifecycle UI changes
- README.md if setup, scripts, or lifecycle workflow guidance changes

Documentation must be concise, factual, and limited to relevant sections.

If something is unknown, write:

`Not confirmed from current codebase`

Do not duplicate full documentation content.

## Documentation/code inconsistency rule

If lifecycle documentation and source code appear inconsistent:

1. Treat current source code as implementation truth.
2. Treat documentation as intended guidance.
3. Flag the inconsistency.
4. Recommend whether code or documentation should be updated.
5. If the correct behavior is unclear, ask one focused question.
6. Do not silently choose one without calling out the mismatch.

## Validation rules

For lifecycle-related changes, validation must include applicable checks from repo scripts and manual checks.

Run or recommend commands based on `README.md` or `package.json`, such as:

- TypeScript check
- Lint
- Tests
- Build
- Local run/manual validation

If commands are not confirmed, write:

`TBC (not confirmed from current codebase)`

Manual checks should include, when applicable:

- Allowed action is available and succeeds.
- Restricted action is disabled or hidden in the UI.
- Restricted write/update is blocked in the service/repository/business logic path.
- Invalid status/phase transition is blocked.
- Valid status/phase transition still works.
- Locked/read-only record behavior works.
- Required role/permission behavior works.
- Data reload reflects lifecycle updates correctly.
- UI indicators such as pills, badges, cards, or labels show the correct lifecycle state.
- Related existing workflows still work.

## Anti-patterns to avoid

Do not:

- Implement lifecycle restrictions only in the UI.
- Add lifecycle checks only inside JSX.
- Bypass service/repository write-path enforcement.
- Hardcode unconfirmed status, phase, lifecycle, or choice values.
- Invent lifecycle states, roles, permissions, or transitions.
- Broaden permissions without explicit acceptance criteria.
- Create duplicate lifecycle/status utilities.
- Create duplicate permission checks.
- Create duplicate UI gating logic.
- Add direct Dataverse calls inside screens/pages/components.
- Modify generated Dataverse files casually.
- Move files or reorganize lifecycle logic unless explicitly approved as Architecture Alignment.
- Ignore lifecycle documentation when relevant.
- Proceed silently when documentation and code conflict.