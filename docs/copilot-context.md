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
- On startup, plans load first; template checklists load in the background after the initial plans request settles
- Standalone localhost sessions attempt redirect to Power Apps Local Play using `power.config.json`

## Current Source Layout

- `src/app`: routing, lifecycle rules, lifecycle transitions, repository, formatting, i18n, telemetry, shared types, template access helpers
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
- Current user profile is resolved from `systemusers` by AAD object id or UPN and now carries both choice labels and numeric codes for `crc07_role` and `crc07_site`
- Template checklist and template question writes are guarded in the repository using centralized role/site access rules
- Copy-to-plan now allows any app user to open the plan checklist template picker, but filters visible template checklists and copied template questions by the destination plan site
- Copy-to-plan applies enterprise-first then site-specific ordering, re-sequences contiguously, and de-duplicates repeated question text within a copied template

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
- Team editable through Approval; locked in Completion and after final sign off
- Question answering enabled only after Plan approval and during Execution; also locked when a checklist is already complete
- Deficiency creation allowed only from a `No` response during Execution
- Existing deficiencies may still be edited in Approval and Completion until final sign off; closed deficiencies are locked

## Screens And Tabs

- `PlansScreen`: searchable and filterable plan gallery with a mobile filter drawer that opens from the right and stages filter edits until the user taps Apply; closing the drawer discards draft filter changes
- `PlanDetailsScreen`: summary, lifecycle rail, and tabs for details, checklists, deficiencies, approvals, and team; existing team member rows open an add/edit/delete role dialog; when a plan remains in Plan and PSSR-Lead approval is Approved, the Plan step shows a green approval check without advancing the phase
- `ChecklistDetailsScreen`: questions, details, and deficiencies tabs; supports swipe-based mobile answer staging and defers question-linked deficiency creates/updates/deletes until the checklist save action is confirmed
- `TemplateLibraryScreen`: template checklist and template question management plus copy-to-plan flow; enterprise templates/questions render read-only affordances for non-enterprise Site Admin users, while site-scoped add-question remains available on enterprise templates for that admin's site
- Template question editing now validates sequence ranges in the dialog before save; valid sequence is `1..N+1` for a new question and `1..N` for an existing question
- Site Admin users adding site-scoped questions to enterprise templates can set an explicit sequence value, but the app does not run editable-subset resequencing for that enterprise-template case

## UI Conventions

- Shared primitives are exported from `src/components/ui.tsx`
- Reusable building blocks include `SectionPanel`, `DataState`, `ResponsiveButton`, `AppDialog`, `RowCard`, `GalleryCard`, `VirtualizedList`, and `SearchableCombobox`
- `AppDialog` now standardizes dialog sizing with shared `confirm`, `form`, and `wide` variants for responsive modal layouts
- Status/phase badges use `Pill`; accent colors come from shared token utilities
- App shell uses Fluent `makeStyles` plus `src/index.css`
- Mobile-specific layout logic is common in plan and checklist detail headers
- Mobile overlay controls should prefer Fluent positioning/overlay behavior over custom panel animation; the Plans screen drawer uses local draft state plus explicit Apply/Discard semantics instead of live-updating filters while open
- Template library rows and question cards now show Enterprise vs Site scope directly in the UI

## Telemetry And Localization

- Telemetry functions currently emit to `console.info`; no external telemetry sink is implemented in current code
- `src/app/i18n.ts` contains a small `en`/`fr` dictionary used for selected labels only

## Current Constraints For Future Prompts

- `src/App.tsx` is still the main stateful composition root; avoid assuming feature ownership is fully split across screen containers
- Checklist question response staging and question-linked deficiency staging are both orchestrated in `src/App.tsx`; checklist-linked deficiency Dataverse writes are deferred until the checklist save flow runs
- Template access is role- and site-gated in current app code through `src/app/templateAccess.ts`
- Only `Enterprise Admin` and `Site Admin` users can access template management; non-enterprise Site Admin users can view enterprise templates read-only, manage only their site-scoped template records, and add site-scoped questions to enterprise templates
- Any user can add a checklist to a plan from the template picker when checklist structure is otherwise unlocked by lifecycle rules
- Template selection for plan checklist copy is filtered by the selected plan site, not by the current user site
- Template question preview in the plan template picker is filtered by the selected plan site, not by template-library role access
- Template question sequence validation and resequencing rules live in `src/app/templateAccess.ts`; out-of-range values are blocked in the dialog and on save, and site-admin enterprise-template question edits skip resequencing they are not permitted to manage globally
- Lifecycle behavior is implemented in app code and covered by `src/app/lifecycleTransitions.test.ts`
- Dataverse table permissions and any server-side enforcement beyond the client app are Not confirmed from current codebase.
