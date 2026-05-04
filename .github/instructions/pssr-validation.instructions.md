---
description: "PSSR-specific validation, build, test, lint, manual QA, regression, Dataverse, lifecycle, UI, and documentation verification rules."
applyTo: "**/*.{ts,tsx,js,jsx,json,md,css,scss}"
---

# PSSR Validation Instructions

These instructions apply to validation and quality gates for the PSSR Power Platform Code App.

Use these instructions when the request involves:

- Implementing code changes
- Reviewing code changes
- Running or recommending validation commands
- Validating Dataverse behavior
- Validating lifecycle/status/permission behavior
- Validating UI/responsive behavior
- Validating documentation updates
- Preparing final implementation or review responses

## Priority

Follow this priority order:

1. Current PSSR source code and existing implementation patterns.
2. `PSSR_APP/.github/copilot-instructions.md`.
3. Existing repo documentation set.
4. This targeted validation instruction.
5. Generic user-level validation or Code App instructions.

If this instruction conflicts with current repo code or project-level instructions, follow the repo-specific implementation truth and flag the inconsistency.

## Repo documentation set

Before defining validation steps, inspect the relevant repo documentation set.

Always inspect:

- `/docs/copilot-context.md`
- `README.md` if present
- `package.json` if present

Inspect when relevant:

- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- `/docs/ui-gallery-card-anatomy.md`
- `/docs/ui-pill-standard.md`
- Any relevant `/docs/*-process.md`
- Any other request-relevant documentation in the repo

Do not paste, quote, duplicate, or summarize the full content of repo documentation files.

## Mandatory first steps

Before recommending or completing validation:

1. Inspect `README.md` for documented setup, run, build, and validation commands.
2. Inspect `package.json` for available scripts.
3. Inspect the changed files.
4. Identify whether the change affects code, docs, Dataverse, lifecycle, UI, or configuration.
5. Select validation steps that match the change.
6. Do not invent commands or scripts.
7. If commands are not confirmed, write:
   `TBC (not confirmed from current codebase)`

## Command validation rules

Use only commands confirmed from:

- `package.json`
- `README.md`
- Existing repo scripts
- Existing CI guidance
- Existing developer documentation

Do not invent scripts such as:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run docs:check`
- `npm run validate`

unless those scripts exist in the repo.

If a command is expected but not confirmed, state:

`TBC (not confirmed from current codebase)`

## Common validation categories

Depending on confirmed repo scripts, validation may include:

- Dependency install
- TypeScript check
- Lint
- Unit tests
- Component tests
- Integration tests
- Build
- Local run
- Manual browser validation
- Documentation validation

Only run or recommend categories that apply to the change.

## Minimum validation expectation

For code changes, validation should normally include:

1. TypeScript or build validation, if available.
2. Lint validation, if configured.
3. Tests, if configured and relevant.
4. Manual validation aligned to acceptance criteria.
5. Regression checks for related behavior.

If validation cannot be run, the final response must state:

- Which validation was not run.
- Why it was not run.
- What manual checks are still required.

## Bug fix validation

For bug fixes, validate:

1. Original reproduction steps.
2. Expected behavior now works.
3. Observed broken behavior no longer occurs.
4. Root cause is addressed.
5. Related behavior still works.
6. No unrelated behavior changed.
7. Regression path is covered.

Manual checks should include:

- The original failing scenario.
- At least one related non-failing scenario.
- Error path if the bug involved failures.
- Desktop/mobile path if UI was involved.
- Dataverse reload/save path if data was involved.
- Lifecycle restricted/allowed path if lifecycle was involved.

## Small enhancement validation

For small enhancements, validate:

1. Current behavior that should be preserved still works.
2. Desired behavior works.
3. Scope is localized.
4. No unrelated workflow changed.
5. UI remains consistent, if UI is affected.
6. Data behavior remains correct, if Dataverse is affected.
7. Lifecycle restrictions remain enforced, if applicable.

Manual checks must align with acceptance criteria.

## New feature validation

For new features, validate:

1. Feature entry point is visible and usable.
2. Happy path works.
3. Validation/error path works.
4. Empty/loading states work if applicable.
5. Dataverse save/load/update path works if applicable.
6. Lifecycle/status/permission rules work if applicable.
7. Responsive desktop/mobile behavior works if applicable.
8. Related existing workflows still work.
9. Documentation was updated if required.

New features must not be considered complete without manual checks.

## Dataverse validation

If Dataverse or data access is affected, validate:

1. Data loads successfully.
2. Empty state works.
3. Error state works.
4. Save/update/delete/submit succeeds where applicable.
5. Failed save/update/delete/submit is handled correctly.
6. Data reload reflects saved values.
7. Mapping handles null and undefined values correctly.
8. Choice/status/phase values display correctly.
9. No hardcoded unconfirmed values were introduced.
10. Generated files were not modified unless strictly required and documented.
11. Related workflows still work.

If Dataverse writes are affected, validate both:

- App model to Dataverse payload.
- Dataverse record to app model/display.

## Lifecycle/status/permission validation

If lifecycle, status, phase, role, permission, lock, owner, approval, assignment, transition, or restricted actions are affected, validate:

1. Allowed action is available and succeeds.
2. Restricted action is disabled or hidden in the UI when applicable.
3. Restricted write/update is blocked outside the UI path.
4. Invalid status/phase transition is blocked.
5. Valid status/phase transition still works.
6. Locked/read-only record behavior works.
7. Required role/permission behavior works.
8. Data reload reflects lifecycle updates correctly.
9. UI indicators such as pills, badges, cards, or labels show the correct lifecycle state.
10. Related existing workflows still work.

Do not accept UI-only lifecycle validation when write-path enforcement is required.

## UI/UX validation

If UI is affected, validate:

1. Requested UI behavior works.
2. Existing related UI behavior still works.
3. Desktop layout works.
4. Mobile layout works.
5. No horizontal overflow.
6. Primary actions remain reachable.
7. Forms remain usable.
8. Cards/lists remain readable.
9. Pills/badges/status indicators remain readable.
10. Loading state works if applicable.
11. Empty state works if applicable.
12. Error state works if applicable.
13. Disabled/read-only state works if applicable.
14. Validation messages display correctly if applicable.
15. Dialog/menu focus behavior works where applicable.
16. Keyboard behavior is preserved where applicable.

If Fluent UI is touched, also validate:

1. Existing Fluent UI components still render correctly.
2. Existing provider/theme behavior still works.
3. No duplicate `FluentProvider` or theme system was introduced.
4. No Fluent UI version migration occurred unless explicitly requested.
5. Existing PSSR UI standards still take precedence.

## Documentation validation

If documentation is changed, validate:

1. Updated document is the correct owner for the topic.
2. Documentation matches current source code.
3. No unrelated sections were rewritten.
4. No duplicate content was introduced.
5. No unconfirmed behavior was documented.
6. Outdated statements were removed or corrected.
7. Links and file references are still accurate where practical.
8. README was updated only if setup/run/build/developer workflow changed.
9. `/docs/copilot-context.md` remains high-level and does not duplicate specialized docs.
10. Specialized docs remain focused on their domain.

If documentation was not updated, confirm whether documentation update was actually not required.

## Architecture alignment validation

If the request is explicitly classified as Architecture Alignment, validate:

1. A phased migration plan exists before implementation.
2. Current behavior is preserved.
3. File moves or renames are intentional and documented.
4. Imports and path aliases still resolve.
5. Generated files are not moved or modified casually.
6. Services/repository boundaries remain valid.
7. Dataverse read/write behavior still works.
8. Lifecycle/status/permission behavior still works.
9. UI behavior still works.
10. Documentation reflects the implemented architecture change.
11. Rollback considerations are documented.

Architecture Alignment validation must be stricter than normal feature validation.

## Configuration validation

If the change affects configuration files such as:

- `package.json`
- `tsconfig.json`
- `vite.config.*`
- `power.config.json`
- environment/config files

Validate:

1. Existing scripts still work.
2. Build still works.
3. TypeScript config remains compatible with the repo.
4. Vite config remains compatible with local development.
5. Power Platform/Code App config remains valid.
6. No unnecessary dependency was added.
7. No unsupported environment assumption was introduced.
8. README or setup documentation was updated if developer workflow changed.

## Security and governance validation

If the change affects authentication, authorization, roles, permissions, data access, environment configuration, or deployment behavior, validate:

1. No secrets are stored in code.
2. No sensitive details are exposed in logs or UI errors.
3. Existing authentication and authorization patterns are preserved.
4. Power Platform DLP and environment governance assumptions are not bypassed.
5. Permissions are not broadened unless explicitly required.
6. Protected operations are not enforced only in UI.
7. Documentation reflects any governance-relevant change.

## Final response validation requirement

Every implementation or review response must include:

1. Commands run and results.
2. Commands not run and reason.
3. Manual checks completed.
4. Manual checks still required.
5. Validation risks or follow-ups.

If no validation was run, state clearly:

`Validation not run.`

and explain why.

## Validation evidence format

Use this format in final responses:

### Validation completed

- `command` — result
- Manual check: description — result

### Validation not run

- `command or check` — reason

### Manual checks required

- Specific check aligned to acceptance criteria

Do not claim validation passed unless it was actually run or explicitly verified.

## Anti-patterns to avoid

Do not:

- Invent validation commands.
- Claim tests/build/lint passed without evidence.
- Skip manual validation for UI, Dataverse, or lifecycle changes.
- Treat build success as sufficient for behavior validation.
- Treat UI disabled state as sufficient for lifecycle/security validation.
- Ignore Dataverse reload/save validation when data writes changed.
- Ignore responsive validation when UI changed.
- Ignore documentation validation when docs changed.
- Add validation tooling without approval.
- Broaden validation scope into unrelated refactors.
- Proceed silently when validation cannot be confirmed.