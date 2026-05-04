---
description: "PSSR-specific documentation update rules for repo docs, README.md, copilot-context, lifecycle docs, UI docs, process docs, and documentation/code consistency."
applyTo: "**/*.{md,ts,tsx,js,jsx,json}"
---

# PSSR Documentation Instructions

These instructions apply to documentation updates in the PSSR Power Platform Code App.

Use these instructions when the request involves:

- Updating `/docs/copilot-context.md`
- Updating `README.md`
- Updating lifecycle documentation
- Updating UI standards documentation
- Creating or updating process documentation
- Updating support guidance
- Updating documentation after code changes
- Reviewing documentation/code consistency

## Priority

Follow this priority order:

1. Current PSSR source code and existing implementation patterns.
2. `PSSR_app/.github/copilot-instructions.md`.
3. Existing repo documentation set.
4. This targeted documentation instruction.
5. Generic user-level documentation instructions.

If this instruction conflicts with generic user-level documentation instructions, follow this PSSR-specific instruction.

If documentation conflicts with source code, treat current source code as implementation truth and documentation as intended guidance. Flag the inconsistency.

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

Do not paste, quote, duplicate, or summarize the full content of repo documentation files.

## Mandatory first steps

Before updating documentation:

1. Inspect the relevant source code.
2. Inspect existing repo documentation.
3. Identify which documentation file owns the topic.
4. Confirm whether the change actually requires documentation.
5. Update only relevant sections.
6. Keep documentation concise, factual, and based on current codebase inspection.
7. Do not invent behavior.
8. Do not create new documentation files unless required.
9. Do not rewrite unrelated documentation.

## Documentation ownership rules

Use the correct documentation target.

### `/docs/copilot-context.md`

Use for high-level authoritative app context.

Update when changes affect:

- App behavior
- Architecture
- Major patterns
- Dataverse integration
- Lifecycle/status/permission rules
- UI standards summary
- Process/workflow summary
- Support-critical behavior
- Constraints or anti-patterns

Do not duplicate detailed process docs or UI standards here.

Keep this file concise and high-level.

### `README.md`

Update only when changes affect:

- Project setup
- Local development
- Required tools
- Install/run/build scripts
- Environment configuration
- Deployment guidance
- Developer onboarding
- Repo structure overview
- Validation commands

Do not update README for every feature unless the feature changes setup, usage, developer workflow, or onboarding guidance.

### `/docs/pssr-lifecycle-behavior.md`

Update when changes affect:

- Lifecycle behavior
- Status/phase transitions
- Role or permission behavior
- Lock/read-only behavior
- Disabled or hidden actions
- Approval/assignment behavior
- Allowed/restricted actions
- Workflow behavior driven by lifecycle

### `/docs/pssr-lifecycle-schema.md`

Update when changes affect:

- Dataverse lifecycle fields
- Status/phase fields
- Choice/status mappings
- Lifecycle schema assumptions
- Record-state mapping
- Generated type usage related to lifecycle
- Dataverse values used by lifecycle logic

Do not invent schema or option values.

If not confirmed, write:

`Not confirmed from current codebase`

### `/docs/ui-gallery-card-anatomy.md`

Update when changes affect:

- Gallery card structure
- Card layout
- Card sections
- Metadata placement
- Card action placement
- Responsive card behavior
- Card visual hierarchy

### `/docs/ui-pill-standard.md`

Update when changes affect:

- Pills
- Badges
- Status indicators
- Lifecycle labels
- Phase/status label display
- Semantic colors
- Pill/badge sizing or placement
- Visual state indicator rules

### `/docs/<feature-slug>-process.md`

Create or update only when a feature introduces or changes an end-to-end workflow/process.

Process docs should include:

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

Do not create process docs for minor UI-only, validation-only, or localized bug-fix changes unless explicitly requested.

## When documentation must be updated

Update documentation when a change affects:

- User-visible behavior
- Developer setup or scripts
- App architecture
- Dataverse mapping
- Dataverse field/choice/status/phase usage
- Lifecycle/status/permission behavior
- UI standards
- Card/gallery standards
- Pill/badge/status indicator standards
- Process/workflow steps
- Validation or support guidance
- Known limitations or constraints

## When documentation is not required

Documentation update is usually not required for:

- Pure internal refactoring with no behavior or pattern change
- Minor bug fix that restores documented behavior
- Styling tweak that does not change UI standards
- Localized code cleanup
- Test-only changes
- Type-only fixes
- Internal implementation detail that users/developers do not need to know

In the final response, state:

`Documentation update not required`

and briefly explain why.

## README-specific rules

Do not automatically update `README.md` for every code change.

Update `README.md` only if the change affects:

- Setup
- Installation
- Required tools
- Local run commands
- Build commands
- Validation commands
- Environment variables
- Deployment steps
- Developer onboarding
- High-level repo structure

Do not add feature-level details to README if the correct owner is `/docs/copilot-context.md` or a process document.

## Changelog rules

Do not create or update `CHANGELOG.md` unless:

1. The repo already uses `CHANGELOG.md`, or
2. The user explicitly requests changelog updates, or
3. The current task is release/version documentation.

If `CHANGELOG.md` exists and is part of the repo workflow, update it only when the change is user-facing or release-relevant.

## API documentation rules

Do not create API, OpenAPI, Swagger, endpoint, or API reference documentation unless the repo actually contains API endpoints or the request explicitly requires API documentation.

For PSSR Code App UI/data-access changes, prefer updating:

- `/docs/copilot-context.md`
- lifecycle docs
- UI docs
- process docs

based on ownership rules.

## Automation and tooling rules

Do not invent documentation automation scripts.

Only run or recommend documentation validation commands that exist in:

- `package.json`
- README.md
- Existing repo scripts
- Existing CI guidance

If documentation validation commands are not confirmed, write:

`TBC (not confirmed from current codebase)`

Do not add markdownlint, link checkers, spell checkers, docs generators, pre-commit hooks, or CI checks unless explicitly requested and approved.

## Documentation quality rules

Documentation must be:

- Concise
- Factual
- Based on current codebase inspection
- Limited to relevant sections
- Consistent with existing terminology
- Consistent with existing file structure
- Useful for developers, support users, or future maintainers

Avoid:

- Long generated summaries
- Duplicate content across docs
- Generic best-practice filler
- Unconfirmed behavior
- Implementation details that do not help future work
- Large pasted code blocks unless necessary
- Rewriting unrelated sections

If something is unknown, write:

`Not confirmed from current codebase`

## Code example rules

Only add code examples when they are necessary and useful.

When adding examples:

1. Keep examples minimal.
2. Use existing repo patterns.
3. Do not introduce new libraries or patterns in documentation examples.
4. Ensure examples match current code.
5. Avoid examples that could become stale quickly.

Do not add generic examples from templates unless they reflect the actual PSSR repo.

## Documentation/code inconsistency rule

If documentation and source code appear inconsistent:

1. Treat current source code as implementation truth.
2. Treat documentation as intended guidance.
3. Flag the inconsistency.
4. Recommend whether documentation or code should be updated.
5. If the correct behavior is unclear, ask one focused question.
6. Do not silently choose one without calling out the mismatch.

## Architecture alignment documentation rule

For normal bug fixes, enhancements, and feature work:

- Do not rewrite architecture documentation to match a generic template.
- Document the current PSSR architecture as it actually exists.
- Flag architecture gaps as non-blocking recommendations.

For explicit Architecture Alignment work:

1. Document current state.
2. Document target state.
3. Document phased migration plan.
4. Document validation and rollback considerations.
5. Update related docs only after approved architecture changes are implemented.

## Documentation update workflow

When documentation update is required:

1. Identify the owning document.
2. Inspect the related code.
3. Update only relevant sections.
4. Remove or correct outdated statements.
5. Keep wording concise and factual.
6. Validate links and references where practical.
7. Ensure documentation does not conflict with source code.
8. Ensure documentation does not duplicate content unnecessarily.

## Validation rules

For documentation-related work, validation should include applicable checks from repo scripts.

Run or recommend commands based on `README.md` or `package.json`, such as:

- TypeScript check, if code changed
- Lint, if configured
- Tests, if configured
- Build, if code changed
- Documentation validation commands, only if they exist

If commands are not confirmed, write:

`TBC (not confirmed from current codebase)`

Manual documentation checks should include:

- Updated document is the correct owner for the topic.
- Documentation matches current code.
- No unrelated sections were rewritten.
- No duplicate content was introduced.
- No unconfirmed behavior was documented.
- Outdated statements were removed or corrected.
- Links and file references are still accurate where practical.

## Final response documentation statement

When finishing a task, always state one of:

- `Documentation update not required.`
- `Documentation updated.`
- `Documentation update required but not completed.`

If documentation was updated, list the files.

If documentation was not required, briefly state why.

## Anti-patterns to avoid

Do not:

- Automatically update README.md for every code change.
- Create CHANGELOG.md unless the repo already uses it or the user requests it.
- Create API/OpenAPI/Swagger docs unless the repo has APIs or the user requests it.
- Invent documentation validation scripts.
- Add documentation tooling without approval.
- Rewrite unrelated documentation.
- Duplicate `/docs/copilot-context.md` content into other files.
- Paste large documentation content in responses.
- Document features that do not exist.
- Document behavior not confirmed from current codebase.
- Use generic template documentation that does not match PSSR.
- Ignore specialized docs when they own the topic.
- Proceed silently when documentation and code conflict.