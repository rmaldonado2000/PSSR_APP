# PSSR App - Copilot Context

## Purpose

Single-page PSSR management app for plans, plan checklists, checklist questions, deficiencies, approvals, and team members, backed by Dataverse.

## Verified Stack

- React 19 + TypeScript + Vite
- Fluent UI React Components
- Power Apps integration via `@microsoft/power-apps`, `@microsoft/power-apps/data`, and the Vite `powerApps()` plugin
- Dataverse access through generated services in `src/generated` and a repository layer in `src/app/dataverseRepository.ts`
- Vitest for lifecycle tests
- ESLint configured at repo root

## Runtime Shape

- App entry is `src/main.tsx`; main orchestration lives in `src/App.tsx`
- Routing is hash-based, not React Router
- Current views: `plans`, `plan-details`, `checklist-details`, `template-library`
- Route patterns:
	- `#/plans`
	- `#/plans/:planId?tab=details|checklists|deficiencies|approvals|team`
	- `#/plans/:planId/checklists/:checklistId?tab=questions|details|deficiencies`
	- `#/templates?planId=:planId`
- On startup, plans load first; template checklists load in the background
- Standalone localhost sessions attempt redirect to Power Apps Local Play using `power.config.json`

## Current Source Layout

- `src/app`: routing, lifecycle rules, lifecycle transitions, repository, formatting, i18n, telemetry, shared types
- `src/components`: reusable UI primitives and responsive helpers
- `src/generated`: generated Dataverse models and service clients
- `src/screens`: `PlansScreen`, `PlanDetailsScreen`, `ChecklistDetailsScreen`, `TemplateLibraryScreen`
- `src/ui/tokens`: pill styling tokens
- `docs`: lifecycle and UI reference docs used by this repo

## Dataverse Scope

Primary functional tables confirmed in code:

- `crc07_pssr_plans`
- `crc07_pssr_checklists`
- `crc07_pssr_checklist_questions`
- `crc07_pssr_deficiencies`
- `crc07_pssr_approvals`
- `crc07_pssr_team_members`
- `crc07_pssr_template_checklists`
- `crc07_pssr_template_questions`
- `systemusers`

Repository behavior confirmed in `src/app/dataverseRepository.ts`:

- Reads use explicit client-side timeouts
- Many reads use fallback query shapes when richer Dataverse selects fail
- Template checklist question counts are computed client-side
- Current user profile is resolved from `systemusers` by AAD object id or UPN

## Lifecycle Model

Plan stage option values are implemented in `src/app/lifecycle.ts`:

- Draft
- Plan
- Execution
- Approval
- Completion

Key enforced rules:

- Draft -> Plan requires originator, at least one checklist, a `PSSR_Lead`, and a `PU_Lead`
- Plan approval is performed by `PSSR_Lead`
- Execution -> Approval requires all checklists complete, accepted category on every deficiency, and all category `A` deficiencies closed
- Approval approval is performed by `PU_Lead`
- Final sign off is performed by `PSSR_Lead` and requires all deficiencies closed
- First successful question response can auto-transition Plan -> Execution when Plan approval is already approved

Edit/interaction locks currently enforced:

- Plan metadata editable only in Draft, and in Plan before plan approval
- Checklist structure editable only in Draft, and in Plan before plan approval
- Team editable through Execution; locked from Approval onward
- Question answering enabled only after Plan approval and during Execution; also locked when a checklist is already complete
- Deficiency creation allowed only from a `No` response during Execution
- Existing deficiencies may still be edited in Approval and Completion until final sign off; closed deficiencies are locked

## Screens And Tabs

- `PlansScreen`: searchable and filterable plan gallery with mobile filter drawer
- `PlanDetailsScreen`: summary, lifecycle rail, and tabs for details, checklists, deficiencies, approvals, and team
- `ChecklistDetailsScreen`: questions, details, and deficiencies tabs; supports swipe-based mobile answer staging
- `TemplateLibraryScreen`: template checklist and template question management plus copy-to-plan flow

## UI Conventions

- Shared primitives are exported from `src/components/ui.tsx`
- Reusable building blocks include `SectionPanel`, `DataState`, `ResponsiveButton`, `AppDialog`, `RowCard`, `GalleryCard`, `VirtualizedList`, and `SearchableCombobox`
- Status/phase badges use `Pill`; accent colors come from shared token utilities
- App shell uses Fluent `makeStyles` plus `src/index.css`
- Mobile-specific layout logic is common in plan and checklist detail headers

## Telemetry And Localization

- Telemetry functions currently emit to `console.info`; no external telemetry sink is implemented in current code
- `src/app/i18n.ts` contains a small `en`/`fr` dictionary used for selected labels only

## Current Constraints For Future Prompts

- `src/App.tsx` is still the main stateful composition root; avoid assuming feature ownership is fully split across screen containers
- Template access is not role-gated in current app code: `hasTemplateAccess()` returns `true`
- Template empty-state copy still says `No templates available for your role/site`, but repository loading does not filter templates by current user in current code
- Lifecycle behavior is implemented in app code and covered by `src/app/lifecycleTransitions.test.ts`
- Dataverse table permissions and any server-side enforcement beyond the client app are Not confirmed from current codebase.
