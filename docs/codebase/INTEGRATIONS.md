# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| Dataverse | Power Platform data service / API-backed data store | Stores plans, checklists, deficiencies, approvals, team members, templates, and user profiles | Current user is resolved from the Power Apps context and `systemusers`; exact token flow is [TODO] | high | power.config.json; src/app/dataverseRepository.ts; src/App.tsx |
| Power Apps host / Local Play | Managed application host/runtime | Supplies app context and is required for connector-backed local execution | Host-provided session/context; exact auth flow is [TODO] | high | power.config.json; src/App.tsx; docs/copilot-context.md |
| Console telemetry | Local logging sink | Emits view/flow/error telemetry to browser console | N/A | low | src/app/telemetry.ts |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Dataverse (`crc07_pssr_*` tables and `systemusers`) | Primary persistence and lookup store | src/app/dataverseRepository.ts wrapping generated services | Client-side business rules may diverge from server-side permissions if Dataverse security is not aligned | power.config.json; src/app/dataverseRepository.ts; docs/pssr-lifecycle-schema.md |

### 3) Secrets and Credentials Handling

- Credential sources: no committed `.env*` files were found; Power Apps app/environment metadata is stored in `power.config.json`
- Hardcoding checks: no secrets or tokens were found in the reviewed configs; `power.config.json` contains app/environment identifiers and datasource metadata, not secret values
- Rotation or lifecycle notes: [TODO] The repo does not document secret rotation or runtime credential provisioning

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: implemented for mutations through `withMutationRetry` with up to 3 attempts; some reads use fallback query attempts
- Timeout policy: read operations are wrapped with a 12-second client-side timeout via `withReadTimeout`
- Circuit-breaker or fallback behavior: no circuit breaker found; partial fallback query shapes exist for `getPlans` and `getTemplateChecklists`

### 5) Observability for Integrations

- Logging around external calls: partial; view/flow/error events are logged through `src/app/telemetry.ts`, but repository functions do not emit a separate tracing layer
- Metrics/tracing coverage: no external metrics, tracing, or APM integration was found
- Missing visibility gaps: no external telemetry sink, no dedicated integration metrics, and no committed alerting/monitoring configuration

### 6) Evidence

- power.config.json
- src/App.tsx
- src/app/dataverseRepository.ts
- src/app/telemetry.ts
- docs/copilot-context.md
- docs/pssr-lifecycle-schema.md
