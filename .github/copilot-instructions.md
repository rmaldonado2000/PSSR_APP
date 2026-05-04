# PSSR App - GitHub Copilot Instructions

These instructions apply to the PSSR Power Platform Code App repository.

The app is a Vite + React + TypeScript Code App integrated with Dataverse. All Copilot work in this repo must preserve the existing architecture, Dataverse patterns, lifecycle/status/permission rules, UI standards, documentation structure, and validation expectations.

## Repo documentation set

The repo documentation set includes, when present:

- `README.md`
- `/docs/copilot-context.md`
- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- `/docs/ui-gallery-card-anatomy.md`
- `/docs/ui-pill-standard.md`
- `/docs/*-process.md`
- Any other request-relevant documentation in the repo

## Existing architecture rule

For normal bug fixes, small enhancements, new features, documentation updates, and investigations, the current PSSR source code is the implementation truth.

Do not reshape the repository to match a generic Code App template during normal implementation work.

If the current repo architecture differs from generic Microsoft Code Apps starter patterns:

1. Preserve the current repo pattern for the requested change.
2. Reuse existing folders, components, services, hooks, utilities, lifecycle logic, styling patterns, and Dataverse integration patterns.
3. Flag architecture gaps as non-blocking recommendations.
4. Do not move files, rename folders, introduce new layers, replace service patterns, or reorganize generated files unless the request is explicitly classified as Architecture Alignment.
5. If Architecture Alignment is requested, produce a phased migration plan before editing code.
6. Each architecture alignment phase must be small, independently validated, and documented.

## Mandatory first steps

Before answering, planning, reviewing, or editing:

1. Open and read `/docs/copilot-context.md` from the repo.
2. Open and read `README.md` from the repo root if present.
3. Inspect any specialized documentation relevant to the request.
4. Inspect any process documentation relevant to the request.
5. Inspect the current codebase before recommending or making changes.
6. Treat the repo documentation set and current source code as authoritative project context.
7. Do not paste, quote, duplicate, or summarize the full content of any repo documentation file.
8. If documentation and code conflict:
   - Treat current source code as implementation truth.
   - Treat documentation as intended guidance.
   - Call out the inconsistency.
   - Recommend whether code or documentation should be updated.
   - Do not silently choose one.

## Request classification

Classify work as one of:

- Bug Fix
- Small Enhancement
- New Feature
- Documentation Update
- Investigation Only
- Architecture Alignment

If classification is unclear, choose the safest classification and state the assumption.

## Scope guard

Change only what is required to satisfy the request and acceptance criteria.

Do not perform:

- Unrelated refactors
- Broad rewrites
- Folder reorganization
- Formatting-only noise
- Dependency changes unless explicitly required and justified
- Duplicate implementations
- Unrelated documentation rewrites

## Architecture rules

Preserve existing PSSR architecture.

Do not:

- Add direct Dataverse calls inside screen/page components.
- Create duplicate services or repository functions.
- Create duplicate UI components when existing components can be reused.
- Create duplicate hooks, helpers, validation logic, lifecycle logic, or styling patterns.
- Rename unrelated files or symbols.
- Modify unrelated files.
- Add new libraries unless explicitly required and justified.
- Reshape the app to match a generic starter template unless explicitly classified as Architecture Alignment.

Prefer:

- Reusing existing components, hooks, helpers, services, repositories, lifecycle utilities, validation utilities, and styling patterns.
- Extending existing abstractions when safe.
- Keeping changes local, minimal, and maintainable.

## Architecture Alignment rules

Only apply these rules when the request is explicitly classified as Architecture Alignment.

Architecture Alignment means intentionally modernizing or restructuring the repo to better align with approved Code App architecture patterns.

Before any Architecture Alignment implementation:

1. Inspect the repo documentation set.
2. Inspect the current codebase.
3. Produce a phased migration plan.
4. Identify risks, rollback strategy, validation steps, and documentation updates.
5. Do not implement architecture movement until the plan is approved.

Architecture Alignment must not be mixed into normal bug fixes, enhancements, or feature work.

