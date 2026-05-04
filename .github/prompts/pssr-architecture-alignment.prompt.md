# PSSR Architecture Alignment Prompt

Use this prompt in GitHub Copilot Agent/Edit mode only for intentional architecture assessment, architecture modernization, folder-structure alignment, service/data-layer cleanup, UI pattern consolidation, or Code App architecture alignment work for the PSSR Power Platform Code App.

Do not use this prompt for normal bug fixes, small enhancements, or regular new feature implementation.

Architecture Alignment means intentionally analyzing and potentially changing how the repo is organized or how core patterns are structured.

## Before starting

Open and read the repo documentation set relevant to this architecture alignment request, including:

- `/docs/copilot-context.md`
- `README.md` if present
- `/docs/pssr-lifecycle-behavior.md` if lifecycle/status/permission architecture is affected
- `/docs/pssr-lifecycle-schema.md` if Dataverse lifecycle schema, status, phase, choices, mappings, or generated files are affected
- `/docs/ui-gallery-card-anatomy.md` if card/gallery UI architecture is affected
- `/docs/ui-pill-standard.md` if pill/badge/status UI architecture is affected
- Any relevant `/docs/*-process.md`

Inspect the current codebase before recommending or editing anything.

Treat the current source code and repo documentation set as authoritative project context.

Do not paste, quote, duplicate, or summarize the full content of any repo documentation file.

## Existing architecture rule

The current PSSR source code is the implementation truth.

Do not assume a generic Microsoft starter template is automatically the correct target for PSSR.

The goal is not to blindly match a template.

The goal is to align PSSR to a sustainable Code App architecture while preserving current behavior, Suncor governance expectations, Dataverse safety, lifecycle safety, UI consistency, documentation accuracy, and maintainability.

If source code and documentation conflict:

1. Treat current source code as implementation truth.
2. Treat documentation as intended guidance.
3. Flag the inconsistency.
4. Recommend whether code or documentation should be updated.
5. Do not silently choose one without calling out the mismatch.

## Objective

Assess the current PSSR repo architecture against approved Code App architecture principles and produce a phased alignment plan.

Architecture alignment objective:

TBC (not provided)

## Required intake

Before planning or implementing, confirm or infer from the request:

- Architecture concern or alignment objective
- Scope of alignment
- Whether this is assessment-only or implementation
- Areas allowed to change
- Areas that must not change
- Risk tolerance
- Acceptance criteria
- Documentation update expectations
- Validation expectations

If required information is missing, ask only one question at a time.

Do not ask the user to fill a template.

If a detail cannot be confirmed from the request, repo docs, or source code, write:

`TBC (not confirmed from current codebase)`

## Assessment areas

Assess the current repo across these areas:

1. Repo/folder structure
2. Route/page/screen organization
3. Component organization and reuse
4. Hooks/utilities organization
5. Services/repository/data access boundaries
6. Dataverse generated files and custom mapping separation
7. Dataverse choice/status/phase handling
8. Lifecycle/status/permission utilities
9. UI components, cards, pills, badges, dialogs, forms, and styling patterns
10. Fluent UI usage, provider, theme, tokens, wrappers, and version consistency
11. Validation/error/loading/empty/disabled/read-only state patterns
12. TypeScript configuration
13. Vite configuration
14. Power Platform SDK / PAC / npm Code App command usage
15. Package scripts and validation readiness
16. Documentation accuracy and ownership
17. Test/lint/build readiness
18. ALM/governance impact

## Target architecture principles

The target PSSR architecture must prioritize:

- Current behavior preservation
- Minimal safe migration
- Clear separation of concerns
- Service/repository boundaries for Dataverse and connector calls
- Generated file protection
- Reusable mapping helpers
- Reusable lifecycle/status/permission utilities
- Defense-in-depth for restricted lifecycle operations
- Consistent PSSR UI patterns
- Controlled Fluent UI usage
- Concise and accurate repo documentation
- Build/type/lint/test validation
- Incremental migration with rollback options

Do not propose a broad rewrite.

Do not propose replacing working architecture with a generic template unless there is a clear, validated benefit and explicit approval.

## Gap classification

Classify each architecture gap as one of:

- Must fix now
- Should fix during related work
- Backlog modernization
- Do not change

Use this guidance:

- `Must fix now`: Current architecture creates active defects, security/lifecycle bypass, Dataverse risk, build risk, or blocks required work.
- `Should fix during related work`: The gap should be corrected when touching the same area.
- `Backlog modernization`: Useful improvement but not required for current delivery.
- `Do not change`: Current repo pattern is acceptable or changing it creates more risk than value.

## Architecture alignment planning rules

Before recommending any architecture change:

1. Confirm the current pattern from source code.
2. Confirm relevant documentation.
3. Identify the risk of changing it.
4. Identify the risk of leaving it as-is.
5. Identify validation needed.
6. Identify documentation updates needed.
7. Identify rollback considerations.
8. Prefer the smallest migration phase possible.

## Implementation rules

Do not implement architecture changes unless the user explicitly asks for implementation after reviewing the plan.

If implementation is approved:

1. Implement only one small phase at a time.
2. Preserve behavior.
3. Avoid unrelated cleanup.
4. Avoid broad file moves.
5. Avoid dependency changes unless explicitly approved.
6. Do not modify generated Dataverse files unless strictly required and consistent with existing workflow.
7. Update documentation only where required.
8. Validate after each phase.

## Dataverse architecture rules

If architecture alignment affects Dataverse or data access:

1. Follow `.github/instructions/pssr-dataverse.instructions.md`.
2. Keep Dataverse calls in the existing service/repository/data access layer or migrate toward that boundary only through approved phases.
3. Protect generated Dataverse files.
4. Do not invent schema, fields, choices, relationships, or option values.
5. Do not hardcode choice/status/phase values unless already established.
6. Preserve mapping behavior.
7. Validate both read and write paths.
8. Validate data reload behavior.
9. Update Dataverse documentation only if behavior, mappings, fields, choices, or constraints change.

## Lifecycle architecture rules

If architecture alignment affects lifecycle/status/permission behavior:

1. Follow `.github/instructions/pssr-lifecycle.instructions.md`.
2. Preserve defense in depth.
3. UI gating and write-path enforcement must remain aligned.
4. Do not create duplicate lifecycle/status utilities.
5. Do not broaden permissions.
6. Validate allowed and restricted states.
7. Update lifecycle documentation only if behavior changes.

## UI architecture rules

If architecture alignment affects UI:

1. Follow `.github/instructions/pssr-ui.instructions.md`.
2. Preserve existing PSSR UI standards.
3. Reuse existing components and styling patterns.
4. Do not introduce new design systems or UI libraries unless explicitly approved.
5. Do not add, upgrade, or migrate Fluent UI unless explicitly approved.
6. Do not replace existing PSSR UI components with Fluent UI during architecture alignment unless the approved scope explicitly requires it.
7. Validate desktop and mobile behavior.
8. Update UI documentation only if standards or behavior change.

## Documentation architecture rules

Follow `.github/instructions/pssr-documentation.instructions.md`.

Architecture alignment documentation must:

1. Document current state.
2. Document target state only after approval.
3. Document phased migration plan.
4. Document validation approach.
5. Document rollback considerations when relevant.
6. Update `/docs/copilot-context.md` only for high-level architecture context.
7. Update specialized docs only for their owned topics.
8. Avoid duplicating content across docs.

Do not update README unless setup, run, build, validation, deployment, or developer onboarding changes.

## Validation rules

Follow `.github/instructions/pssr-validation.instructions.md`.

Use only validation commands confirmed from:

- `README.md`
- `package.json`
- Existing repo scripts
- Existing CI/developer docs

Do not invent commands.

Architecture alignment validation must include:

1. TypeScript/build validation if available.
2. Lint/tests if configured and relevant.
3. Manual regression checks for touched workflows.
4. Dataverse read/write/reload validation if data access changed.
5. Lifecycle allowed/restricted validation if lifecycle changed.
6. Desktop/mobile validation if UI changed.
7. Documentation validation if docs changed.
8. Import/path validation if files moved or renamed.
9. Rollback consideration for each phase.

## Constraints and anti-patterns to avoid

Do not:

- Treat generic starter templates as mandatory target architecture.
- Perform broad rewrites.
- Move files or rename folders without an approved phase.
- Add new architectural layers without approval.
- Add dependencies without approval.
- Introduce new design systems.
- Add, upgrade, or migrate Fluent UI without approval.
- Modify generated Dataverse files casually.
- Create duplicate services, repositories, components, lifecycle utilities, mapping helpers, or styling patterns.
- Add direct Dataverse calls inside screens/pages/components.
- Implement lifecycle restrictions only in the UI.
- Rewrite unrelated documentation.
- Claim validation passed unless it was actually run or verified.
- Proceed silently when documentation and code conflict.

## Required output format for assessment/planning

If the request is assessment or planning, respond using exactly these headings:

## 1. Request classification

Architecture Alignment

State whether this is:

- Assessment only
- Plan only
- Implementation requested

## 2. Documentation inspected

List repo documentation inspected.

If relevant documentation was missing, state:

`Relevant but not found in repo.`

Do not paste documentation content.

## 3. Current architecture summary

Summarize the confirmed current architecture.

## 4. Target architecture principles

Describe the target PSSR architecture principles.

Do not blindly copy a generic template.

## 5. Alignment gap analysis

For each gap, include:

- Area
- Current state
- Target state
- Risk of changing
- Risk of not changing
- Priority
- Migration complexity

## 6. What should not change

List patterns, files, boundaries, or behaviors that should be preserved.

## 7. Proposed phased migration plan

For each phase, include:

- Scope
- Files/areas affected
- Risk
- Validation
- Documentation update
- Rollback consideration

## 8. First safe phase recommendation

Recommend the first low-risk phase only.

## 9. Dataverse/data impact

State one of:

- No Dataverse impact identified.
- Dataverse impact identified.
- TBC (not confirmed from current codebase).

## 10. Lifecycle/status/permission impact

State one of:

- No lifecycle/status/permission impact identified.
- Lifecycle/status/permission impact identified.
- TBC (not confirmed from current codebase).

## 11. UI/UX impact

Summarize UI, responsive, card/gallery, pill/badge, Fluent UI, validation/error/disabled-state impact if applicable.

## 12. Documentation update plan

List docs that should be updated and why.

## 13. Validation plan

List confirmed commands and required manual checks.

Do not invent commands.

## 14. Risks and open questions

List risks and only the open questions that block safe planning or implementation.

## Required output format for approved implementation

If implementation is explicitly approved, respond using exactly these headings:

## 1. Request classification

Architecture Alignment

## 2. Documentation inspected

List repo documentation inspected.

If relevant documentation was missing, state:

`Relevant but not found in repo.`

Do not paste documentation content.

## 3. Approved phase implemented

State the approved phase.

## 4. Files changed/added/moved

List files changed, added, moved, or renamed.

## 5. Summary of implementation

Summarize the implemented architecture alignment in concise bullets.

## 6. Behavior preservation

Summarize how existing behavior was preserved.

## 7. Dataverse/data impact

State one of:

- No Dataverse impact.
- Dataverse impact implemented.
- TBC (not confirmed from current codebase).

## 8. Lifecycle/status/permission impact

State one of:

- No lifecycle/status/permission impact.
- Lifecycle/status/permission impact implemented.
- TBC (not confirmed from current codebase).

## 9. UI/UX impact

Summarize UI, responsive, card/gallery, pill/badge, Fluent UI, validation/error/disabled-state impact if applicable.

## 10. Documentation updated

State one of:

- Documentation update not required.
- Documentation updated.
- Documentation update required but not completed.

List updated docs if applicable.

## 11. Validation completed

List commands run and results.

Do not claim validation passed unless it was actually run or verified.

## 12. Validation not run

List commands/checks not run and why.

## 13. Manual checks required

List specific manual checks aligned to the approved phase.

## 14. Rollback considerations

List how to revert or reduce risk if the phase causes issues.

## 15. Risks or follow-ups

List remaining risks or follow-ups.

If none, write:

`None identified.`