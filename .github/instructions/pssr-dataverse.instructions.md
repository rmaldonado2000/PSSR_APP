---
description: "PSSR-specific Dataverse, generated files, servicedescription: "PSSR-specific Dataverse, generated files, service/repository, mapping, choice/status, and data access rules."
- Data mapping
- Record state
- Lifecycle/status fields
- Service/repository/data access logic
- Any UI behavior driven by Dataverse values

## Priority

Follow this priority order:

1. Current PSSR source code and existing implementation patterns.
2. `PSSR_app/.github/copilot-instructions.md`.
3. Repo documentation set.
4. This targeted Dataverse instruction.
5. Generic user-level Code App instructions.

If this instruction conflicts with current repo code or project-level instructions, follow the repo-specific implementation truth and flag the inconsistency.

## Repo documentation set

Before changing Dataverse-related logic, inspect the relevant repo documentation set.

Always inspect:

- `/docs/copilot-context.md`
- `README.md` if present

Inspect when relevant:

- `/docs/pssr-lifecycle-schema.md`
- `/docs/pssr-lifecycle-behavior.md`
- Any relevant `/docs/*-process.md`
- Any other request-relevant documentation in the repo

Do not paste, quote, duplicate, or summarize the full content of repo documentation.

## Existing architecture rule

For normal bug fixes, small enhancements, new features, documentation updates, and investigations, the current PSSR source code is the implementation truth.

Do not reshape the Dataverse architecture to match a generic template during normal implementation work.

If the current repo differs from generic Code App starter patterns:

1. Preserve the current repo pattern for the requested change.
2. Reuse existing services, repositories, generated files, mapping helpers, hooks, utilities, and data-loading patterns.
3. Flag architecture gaps as non-blocking recommendations.
4. Do not move files, rename folders, introduce new data layers, replace service patterns, or reorganize generated files unless the request is explicitly classified as Architecture Alignment.

## Mandatory first steps

Before editing Dataverse-related code:

1. Inspect the relevant repo documentation.
2. Inspect existing data access patterns.
3. Identify the current read path.
4. Identify the current write path.
5. Identify existing generated services/models/types.
6. Identify existing mapping helpers.
7. Identify lifecycle/status/phase dependencies.
8. Confirm whether the change affects schema, choices, lookups, relationships, or generated files.
9. Confirm whether documentation must be updated.
10. Make the smallest safe change.

## Service/repository boundary rules

Dataverse and connector calls must stay in the existing service/repository/data access layer.

Do not add Dataverse calls directly inside:

- Screens
- Pages
- Route components
- Presentational components
- UI-only components

If a screen or component needs data:

1. Use the existing service/repository abstraction.
2. Extend the existing abstraction only if required.
3. Keep UI components focused on rendering, user interaction, validation display, and state orchestration.
4. Keep data retrieval, mutation, mapping, and API-specific logic outside UI components.

## Generated file rules

Generated Dataverse files are protected.

Do not modify generated services, generated models, generated types, or generated metadata files unless all conditions are true:

1. The requested change strictly requires it.
2. The repo workflow supports modifying or regenerating those files.
3. The change is consistent with the existing generated-file workflow.
4. The impact is documented.
5. The validation plan includes generated-file regression checks.

Prefer adding custom mapping or wrapper logic outside generated files.

If generated files appear outdated, flag the issue and recommend the correct regeneration or update workflow instead of manually editing generated code.

## Choice/status/phase value rules

Do not hardcode Dataverse choice, status, phase, or lifecycle values unless the same values are already established in the current repo.

Before using a choice/status/phase value:

1. Search existing code for constants, enums, generated types, mapping helpers, or documented values.
2. Reuse existing constants or helpers.
3. If values are only documented, confirm code usage before implementing.
4. If values are not confirmed, write:
   `TBC (not confirmed from current codebase)`
5. Do not invent numeric values, labels, option set values, or state transitions.

If lifecycle/status/phase behavior is involved, inspect:

- `/docs/pssr-lifecycle-schema.md`
- `/docs/pssr-lifecycle-behavior.md`
- Existing lifecycle/status utilities in source code

## Mapping rules

Follow existing PSSR mapping patterns.

When adding or changing mappings:

1. Preserve current naming conventions.
2. Preserve null and undefined handling.
3. Preserve date/time handling.
4. Preserve lookup handling.
5. Preserve choice/status/phase handling.
6. Preserve error handling.
7. Preserve read/write symmetry where applicable.
8. Avoid duplicate mapping functions.
9. Avoid mapping logic inside UI components.

If the change affects saved data, validate both directions:

- Dataverse record to app model
- App model to Dataverse payload

## Read path rules

For Dataverse read/load behavior:

1. Reuse existing service/repository calls.
2. Preserve existing loading and error handling.
3. Preserve existing filtering and ordering patterns.
4. Use efficient queries consistent with existing repo patterns.
5. Avoid unnecessary calls.
6. Avoid duplicate data loading if an existing hook/service already provides the data.
7. Validate empty, loading, success, and error states when UI is impacted.

## Write path rules

For Dataverse save/update/delete/submit behavior:

1. Reuse existing service/repository mutation patterns.
2. Validate required fields before writing.
3. Preserve existing error handling and user feedback.
4. Preserve existing optimistic or non-optimistic update behavior.
5. Do not write disallowed lifecycle/status/phase changes.
6. Do not bypass role/permission/lifecycle restrictions.
7. Validate saved data can be reloaded correctly.
8. Validate failure behavior does not leave UI in an inconsistent state.

## Lifecycle defense-in-depth

If Dataverse writes are affected by lifecycle, status, phase, role, permission, lock, owner, approval, assignment, or transition rules:

1. UI must disable or hide restricted actions when applicable.
2. Service/repository/business logic must block restricted writes or updates.
3. Do not rely only on disabled UI.
4. Reuse existing lifecycle/status utilities.
5. Do not create duplicate lifecycle rules.
6. Do not broaden permissions unless explicitly required by acceptance criteria.
7. Validate both allowed and restricted states.

## Error handling rules

Preserve existing PSSR error handling patterns.

Do not expose sensitive details in user-facing messages.

When handling Dataverse failures:

1. Preserve existing logging style.
2. Preserve existing user feedback style.
3. Handle connector/network/API failures gracefully.
4. Avoid swallowing errors silently.
5. Avoid adding retry behavior unless the repo already uses it for the same scenario or the request explicitly requires it.

## Documentation update rules

Update documentation only if Dataverse behavior changes.

Documentation may be required when changing:

- Dataverse fields
- Tables
- Relationships
- Lookups
- Choices
- Status/phase mapping
- Lifecycle schema
- Read behavior
- Write behavior
- Save/submit behavior
- Service/repository boundaries
- Generated-file workflow
- Data validation rules
- Support guidance

Potential documentation targets:

- `/docs/copilot-context.md`
- `/docs/pssr-lifecycle-schema.md`
- `/docs/pssr-lifecycle-behavior.md`
- Relevant `/docs/*-process.md`
- README.md if setup, scripts, or generated-file workflow changes

Documentation must be concise, factual, and limited to relevant sections.

If something is unknown, write:

`Not confirmed from current codebase`

Do not duplicate full documentation content.

## Validation rules

For Dataverse-related changes, validation must include applicable checks from repo scripts and manual checks.

Run or recommend commands based on `README.md` or `package.json`, such as:

- TypeScript check
- Lint
- Tests
- Build
- Local run/manual validation

If commands are not confirmed, write:

`TBC (not confirmed from current codebase)`

Manual checks should include, when applicable:

- Data loads successfully.
- Empty state works.
- Error state works.
- Save/update/delete/submit succeeds.
- Failed save/update/delete/submit is handled correctly.
- Data reload reflects saved values.
- Choice/status/phase values display correctly.
- Restricted lifecycle/status/permission writes are blocked.
- Allowed lifecycle/status/permission writes still work.
- Related existing workflows still work.

## Anti-patterns to avoid

Do not:

- Add Dataverse calls directly to screens/pages/components.
- Hardcode unconfirmed Dataverse choice/status/phase values.
- Modify generated Dataverse files casually.
- Invent schema, table names, field names, relationships, or option values.
- Create duplicate service/repository functions.
- Create duplicate mapping helpers.
- Create duplicate lifecycle/status logic.
- Implement lifecycle restrictions only in the UI.
- Add broad data-layer refactors during normal bug/enhancement/feature work.
- Move files or reorganize generated folders unless explicitly approved as Architecture Alignment.
- Ignore repo documentation when relevant.
- Proceed silently when documentation and code conflict.
applyTo: "**/*.{ts,tsx}"
---

# PSSR Dataverse Instructions

These instructions apply to Dataverse and data-access work in the PSSR Power Platform Code App.

Use these instructions when the request involves:

- Dataverse load/save/update/delete/submit behavior
- Dataverse tables, fields, relationships, lookups, choices, status, or phase values
