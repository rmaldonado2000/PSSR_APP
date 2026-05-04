# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| high | `src/App.tsx` is a large, central, stateful composition root and the top churn file in the last 90 days | src/App.tsx; terminal `git log --since=...` output | Cross-screen changes are likely to create regressions and make ownership boundaries harder to preserve | Extract stable slices behind hooks/components gradually and add behavior-scoped tests before large edits |
| high | The handwritten data-access layer lives in `src/app/dataverseRepository.ts`, while some architecture notes still imply a more service-sliced layout | .github/copilot-instructions.md; docs/codebase/ARCHITECTURE.md; src/app/dataverseRepository.ts | Architecture guidance and actual layout can be read inconsistently, which raises onboarding and consistency risk | [ASK USER] decide whether the current repository path is acceptable or should be documented as the long-term pattern |
| medium | Client-side lifecycle and template-access checks are present, but server-side enforcement beyond Dataverse permissions is not confirmed in repo docs | docs/copilot-context.md; src/app/templateAccess.ts; src/app/lifecycle.ts | If Dataverse security does not mirror app rules, users may see inconsistent or bypassable behavior | Verify Dataverse security roles/table permissions against client assumptions |
| medium | Telemetry emits arbitrary payloads to `console.info` and no redaction layer was found | src/app/telemetry.ts; .github/copilot-instructions.md | Callers can accidentally log user or record context that the repo rules say should not be exposed | Add a safe telemetry contract or payload scrubber before introducing external logging |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Centralized app orchestration | `App.tsx` coordinates routing, data loading, modal state, and cross-screen flows | src/App.tsx | Feature changes will keep concentrating complexity in one file | Split stable concerns into hooks or screen containers with prop interfaces |
| One large repository file for many Dataverse domains | All major entity reads/writes are kept in a single handwritten repository file | src/app/dataverseRepository.ts | Domain changes can cause accidental coupling and harder reviews | Separate domain-specific repository/service modules over time |
| Limited automated test scope | Only lifecycle and template-access logic are covered by tests | src/app/lifecycleTransitions.test.ts; src/app/templateAccess.test.ts | UI regressions and Dataverse integration behavior can slip through | Add focused screen-state tests and repository-level integration checks |
| Formatter policy is implicit | No formatter config file was found | repo root | Inconsistent formatting can increase noisy diffs | [ASK USER] confirm whether ESLint-only formatting is intentional |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| Access-control assumptions may live mostly in client code | A01: Broken Access Control | src/app/templateAccess.ts; src/app/lifecycle.ts; docs/copilot-context.md | Client-side gating exists; template writes are repository-guarded | Dataverse/server-side enforcement is [TODO] / not confirmed |
| Raw backend error details can reach the UI | A05: Security Misconfiguration / information disclosure | src/app/dataverseRepository.ts; src/components/ui.tsx | Errors are normalized into `Error` strings before surfacing | No separate sanitization layer was found before errors are rendered |
| Telemetry helper has no built-in payload scrubbing | N/A | src/app/telemetry.ts; .github/copilot-instructions.md | Repo instructions prohibit sensitive data in logs | There is no code-level redaction or schema enforcement |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Plan metrics are computed client-side from bulk checklist/deficiency reads | src/app/dataverseRepository.ts (`getPlans`) | Reads can pull up to 5000 related records and aggregate in memory | Larger Dataverse datasets will increase startup latency and browser work | Move more aggregation to server/query shape if available, or page data |
| Template checklist question counts are computed by loading all template questions | src/app/dataverseRepository.ts (`getTemplateChecklists`) | Full question set is fetched to build a count map | Template growth will make library load heavier | Precompute counts server-side or query per template with smaller scopes |
| Main orchestration file is both a logic and render hotspot | src/App.tsx | State changes can cascade across many views and dialogs | Future features will increase rerender and maintenance cost | Isolate feature state into hooks/components |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| src/App.tsx | Central route/data/modal orchestration and broad prop wiring | 11 touches in the last 90 days from terminal git-log summary | Prefer minimal edits, validate one flow at a time |
| src/app/dataverseRepository.ts | Shared data access for most entities and retry/timeout logic | 10 touches in the last 90 days from terminal git-log summary | Add or update narrow tests around touched repository functions |
| src/screens/PlanDetailsScreen.tsx | Dense view with multiple tabs and command surfaces | 9 touches in the last 90 days from terminal git-log summary | Limit changes to one tab/interaction slice per edit |

### 6) `[ASK USER]` Questions

1. [ASK USER] Should the handwritten Dataverse layer remain in `src/app/dataverseRepository.ts`, or do you want it migrated to `src/services/**` to match the repo rules?
2. [ASK USER] Is console-only telemetry intentional, or is an external telemetry/monitoring sink planned for this app?
3. [ASK USER] Are Dataverse table permissions and security roles the intended enforcement layer for lifecycle/template restrictions, or is additional server-side enforcement expected?
4. [ASK USER] Is the lack of a formatter config intentional, or should a formatter be standardized alongside ESLint?

### 7) Evidence

- src/App.tsx
- src/app/dataverseRepository.ts
- src/app/templateAccess.ts
- src/app/lifecycle.ts
- src/app/telemetry.ts
- src/components/ui.tsx
- src/app/lifecycleTransitions.test.ts
- src/app/templateAccess.test.ts
- docs/copilot-context.md
- .github/copilot-instructions.md
