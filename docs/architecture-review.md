# PSSR Architecture Alignment Assessment

## 1. Request classification

Architecture Alignment

Assessment only. Plan only. The request is to compare the current repo against Power Apps Code App architecture principles and repo documentation without implementing changes.

Planner boundary confirmation:
- No files were created, edited, deleted, renamed, moved, staged, committed, or otherwise modified.
- No implementation code was generated.

## 2. Documentation inspected

- copilot-context.md — inspected; authoritative runtime and architecture summary.
- README.md — inspected; confirms stack, scripts, structure, and workflow.
- pssr-lifecycle-behavior.md — inspected; relevant to lifecycle ownership and enforcement boundaries.
- pssr-lifecycle-schema.md — inspected; relevant to Dataverse lifecycle fields and choice handling.
- ui-gallery-card-anatomy.md — inspected; relevant to UI architecture standards.
- ui-pill-standard.md — inspected; relevant to status/phase indicator architecture.
- ARCHITECTURE.md — inspected; generated architecture snapshot and known risks.
- STRUCTURE.md — inspected; folder and module boundary reference.
- CONCERNS.md — inspected; confirms structural risks and documentation drift.
- Relevant process docs — Relevant but not found in repo.

## 3. Current architecture summary

The current architecture is a layered client-side SPA with a single main composition root. main.tsx mounts the app, and App.tsx owns the Fluent provider, Power Apps context bootstrap, route synchronization, screen selection, global loading and error state, and cross-screen orchestration.

Data access is separated from screens and centralized in dataverseRepository.ts, which wraps generated Dataverse services from index.ts, applies retry and timeout behavior, and maps records into view models. Lifecycle and permission logic are centralized in lifecycle.ts, lifecycleTransitions.ts, and templateAccess.ts.

UI architecture is consistent with repo guidance. Shared primitives live in ui.tsx, screens remain render-focused, and no direct Dataverse client usage was found in screen files. The main structural concern is concentration of orchestration in App.tsx and data logic in dataverseRepository.ts. The repo also has documentation drift in CONCERNS.md, which references a non-existent services-layer instruction file.

## 4. Target architecture principles

- Preserve current behavior first.
- Keep screens thin and free of direct Dataverse calls.
- Keep generated Dataverse files separate and protected.
- Keep lifecycle, status, permission, and template-access logic centralized.
- Preserve defense in depth between UI gating and write-path enforcement.
- Keep Fluent UI usage controlled under one provider and theme path.
- Prefer incremental extraction over broad rewrites.
- Reduce hotspot concentration in App.tsx and dataverseRepository.ts without changing runtime behavior.
- Keep documentation concise and aligned with source truth.

## 5. Alignment gap analysis

### Gap 1
- Area: Composition root concentration
- Current state: App.tsx owns provider setup, bootstrap, routing, app state, modals, and cross-screen flows.
- Target state: Keep App as the shell but extract stable orchestration slices into existing boundaries such as src/hooks or src/app.
- Risk of changing: Medium
- Risk of not changing: High ongoing regression and maintenance cost
- Priority: Should fix during related work
- Migration complexity: Medium

### Gap 2
- Area: Repository concentration
- Current state: dataverseRepository.ts contains many domain concerns in one handwritten file.
- Target state: Preserve one repository boundary from the UI perspective while splitting implementation internally by domain.
- Risk of changing: Medium to High
- Risk of not changing: Medium to High maintainability cost
- Priority: Should fix during related work
- Migration complexity: Medium to High

### Gap 3
- Area: Empty extension points versus actual ownership
- Current state: src/hooks and src/utils exist but are empty while stable extraction candidates remain concentrated elsewhere.
- Target state: Use those folders only for proven boundaries, not speculative reorganization.
- Risk of changing: Low if incremental
- Risk of not changing: Continued hotspot growth
- Priority: Backlog modernization
- Migration complexity: Low to Medium

### Gap 4
- Area: Architecture documentation drift
- Current state: CONCERNS.md references a non-existent services-layer instruction file and suggests a services-path expectation not reflected in current implementation truth.
- Target state: Architecture docs reflect actual current structure and clearly distinguish present state from future options.
- Risk of changing: Low
- Risk of not changing: Medium onboarding confusion
- Priority: Should fix during related work
- Migration complexity: Low

### Gap 5
- Area: Validation readiness for architecture work
- Current state: automated tests are focused on lifecycle and template-access logic, with limited characterization around App orchestration and repository behavior.
- Target state: add focused regression coverage before structural extraction.
- Risk of changing: Low to Medium
- Risk of not changing: Medium to High regression risk during refactors
- Priority: Should fix during related work
- Migration complexity: Medium

### Gap 6
- Area: Defense-in-depth verification clarity
- Current state: client and repository enforcement is present, but server-side enforcement beyond Dataverse permissions is not confirmed.
- Target state: preserve current client-side architecture and explicitly document or verify the intended server-side boundary.
- Risk of changing: Medium
- Risk of not changing: Medium governance ambiguity
- Priority: Backlog modernization
- Migration complexity: Medium

### Gap 7
- Area: Generic Code App guidance divergence
- Current state: the repo uses hash routing, relative imports, one main App shell, and repo-specific patterns that differ from generic starter guidance.
- Target state: preserve current repo truth unless a concrete problem is proven.
- Risk of changing: Medium with low validated benefit
- Risk of not changing: Low
- Priority: Do not change
- Migration complexity: Medium

## 6. What should not change

- The generated versus handwritten separation between index.ts and app logic.
- The rule that screens do not call Dataverse directly.
- Lifecycle ownership in lifecycle.ts and lifecycleTransitions.ts.
- Template-access ownership in templateAccess.ts.
- The existing hash-route model in router.ts.
- The single Fluent provider and theme path in App.tsx.
- Shared UI primitives in ui.tsx.
- Existing gallery and pill standards documented in ui-gallery-card-anatomy.md and ui-pill-standard.md.
- Power Apps Vite integration in vite.config.ts and current Local Play workflow in power.config.json and README.md.
- Existing Dataverse choice, status, phase, and generated-file behavior.

## 7. Proposed phased migration plan

### Phase 1
- Scope: Baseline hardening and documentation alignment
- Files or areas affected: App.tsx, router.ts, lifecycle.ts, lifecycleTransitions.ts, templateAccess.ts, dataverseRepository.ts, copilot-context.md, ARCHITECTURE.md, STRUCTURE.md, CONCERNS.md
- Risk: Low
- Validation: build, lint, test, and manual smoke checks
- Documentation update: Yes
- Rollback consideration: doc and test changes are easy to revert

### Phase 2
- Scope: Extract App orchestration into existing boundaries
- Files or areas affected: App.tsx, router.ts, screen files, and approved existing app or hook boundaries
- Risk: Medium
- Validation: build, lint, test, and manual navigation and draft-state regression checks
- Documentation update: copilot-context.md and codebase architecture docs if ownership materially changes
- Rollback consideration: keep each extraction slice independently reversible

### Phase 3
- Scope: Split repository implementation by domain behind a stable boundary
- Files or areas affected: dataverseRepository.ts, related app-layer modules, and current call sites
- Risk: Medium to High
- Validation: build, lint, test, and manual read/write/reload checks
- Documentation update: copilot-context.md and codebase architecture docs
- Rollback consideration: preserve compatibility exports while splitting internally

### Phase 4
- Scope: Governance and hardening follow-up
- Files or areas affected: lifecycle, repository, and validation documentation plus approved verification surfaces
- Risk: Medium
- Validation: normal build/lint/test plus allowed and restricted manual checks
- Documentation update: only docs that own enforcement assumptions
- Rollback consideration: documentation and validation changes are independently reversible

## 8. First safe phase recommendation

Phase 1 is the first safe phase.

It is the lowest-risk starting point because it does not require runtime restructuring, resolves confirmed documentation drift, and creates the regression baseline needed before touching App.tsx or dataverseRepository.ts.

## 9. Dataverse/data impact

Dataverse impact identified.

The current data architecture is already aligned with the core repo principle that screens should not call Dataverse directly. All confirmed read and write paths funnel through dataverseRepository.ts. No schema, generated-file, or option-set change is warranted for the first safe phase.

Any approved later phase must preserve:
- read path behavior
- write path behavior
- timeout and retry behavior
- fallback query behavior
- mapping symmetry
- current generated-file protection

## 10. Lifecycle/status/permission impact

Lifecycle, status, and permission impact identified.

The current architecture is strong because lifecycle rules are centralized in lifecycle.ts and lifecycleTransitions.ts, with template access centralized in templateAccess.ts. The first safe phase should not change that behavior.

Any later approved phase must:
- preserve UI gating and write-path enforcement alignment
- avoid duplicating lifecycle rules
- avoid broadening permissions
- validate both allowed and restricted states

## 11. UI/UX impact

The current UI architecture is largely aligned and should remain stable.

- Shared UI primitives are centralized in ui.tsx.
- Screens are split by experience and remain render-focused.
- One Fluent provider is confirmed in App.tsx.
- No Fluent UI migration or provider duplication is justified.

The main UI architecture concern is ownership concentration in App.tsx, not the visual system itself.

## 12. Documentation update plan

No documentation was updated in this assessment-only pass.

If implementation is later approved, update only the relevant docs:
- ARCHITECTURE.md
- STRUCTURE.md
- CONCERNS.md
- copilot-context.md only if high-level architecture ownership changes
- README.md only if setup, run, or validation guidance changes

Do not update lifecycle or UI standards docs unless approved architecture work changes behavior they own.

## 13. Validation plan

Confirmed commands from README.md and package.json:

- npm.cmd run build
- npm.cmd run lint
- npm.cmd run test
- npm.cmd run dev

Required manual checks for the first safe phase:
- app startup and plans-first bootstrap path still work
- hash-route navigation still works across all current views
- Fluent dialogs and themed surfaces still render correctly
- lifecycle command visibility and enablement remain unchanged
- template access gating remains unchanged
- no direct Dataverse calls are introduced into screens
- updated docs match current source behavior

These commands were confirmed but not run in the assessment-only pass.

## 14. Risks and open questions

- Extracting from App.tsx too broadly can break pending draft, modal, staging, or navigation flows.
- Splitting dataverseRepository.ts can regress timeout, fallback query, mapping, or reload behavior.
- Architecture work without added characterization coverage increases regression risk.
- Documentation drift will continue if codebase docs are not updated during approved alignment phases.

Open questions:
- Should the handwritten repository remain under src/app long-term, or move to a dedicated services boundary later?
- Is additional server-side enforcement beyond Dataverse table permissions expected for lifecycle and template restrictions?
- Should src/hooks become the approved destination for extracted App orchestration, or should those slices remain under src/app unless they are truly reusable?

If you want, I can turn this into a cleaner repo-ready Markdown draft next, with a title, front matter if you use it, and a recommended filename.