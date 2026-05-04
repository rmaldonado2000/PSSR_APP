# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: layered client-side SPA with a single composition root and a repository-backed data layer
- Why this classification: `src/main.tsx` renders one `App` component; `src/App.tsx` imports screens, routing helpers, lifecycle/template-access logic, and repository functions; `src/app/dataverseRepository.ts` wraps generated Dataverse service clients instead of exposing them directly to screens
- Primary constraints:
  - UI components are expected not to call connectors or data sources directly
  - Dataverse access depends on the Power Apps host/runtime and generated service clients
  - Navigation is hash-based and coordinated from `src/App.tsx`

### 2) System Flow

```text
index.html / Vite -> src/main.tsx -> src/App.tsx -> src/app/* logic -> src/app/dataverseRepository.ts -> src/generated services -> Dataverse / Power Apps host
```

Flow summary:

1. Vite serves the SPA, and `src/main.tsx` mounts `App` inside `StrictMode`.
2. `src/App.tsx` applies the Fluent provider, owns route/view state, loads the current Power Apps context, and lazy-loads screen components.
3. Route parsing and updates are handled through `src/app/router.ts` using hash routes.
4. Lifecycle, template-access, formatting, localization, and telemetry behaviors are delegated to focused modules under `src/app`.
5. Dataverse reads and writes go through `src/app/dataverseRepository.ts`, which wraps generated service clients with timeouts, retries, normalization, and view-model mapping.
6. Screens receive typed props and callbacks from `App` and render the UI without directly importing connector clients.

### 3) Layer/Module Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|-----------------|------|--------------|----------|
| src/main.tsx | Root DOM mount and app bootstrap | Business logic or data access | src/main.tsx |
| src/App.tsx | Global composition, routing, state coordination, screen wiring, modal orchestration | Generated connector calls directly from screens | src/App.tsx |
| src/screens | Screen rendering and UI interactions through props/callbacks | Direct Dataverse client imports | src/screens/PlansScreen.tsx; src/screens/TemplateLibraryScreen.tsx |
| src/app/dataverseRepository.ts | Dataverse reads/writes, retry/timeout policy, view-model normalization | Screen composition | src/app/dataverseRepository.ts |
| src/app/lifecycle.ts and src/app/templateAccess.ts | Business rules for lifecycle and template permissions | Rendering concerns | src/app/lifecycleTransitions.test.ts; src/app/templateAccess.ts |
| src/generated | Generated Dataverse services and models | Manual policy logic | src/app/dataverseRepository.ts; workspace structure |

### 4) Reused Patterns

| Pattern | Where found | Why it exists |
|---------|-------------|---------------|
| Repository wrapper | src/app/dataverseRepository.ts | Centralizes Dataverse access, retries, timeouts, and mapping to view models |
| Generated client layer | src/generated and imports from `../generated` | Keeps connector/schema-generated code separate from handwritten logic |
| Central composition root | src/App.tsx | Coordinates route state, data loading, modals, and cross-screen state in one place |
| Hash-route helper | src/app/router.ts | Encodes and decodes SPA route state without React Router |

### 5) Known Architectural Risks

- `src/App.tsx` is the highest-churn file in the last 90 days and owns a large amount of application state, which increases regression risk when adding cross-screen features.
- The repo instructions say data access should live in `src/services/**`, but the current handwritten data layer lives in `src/app/dataverseRepository.ts`, which is an intent-versus-reality divergence.
- Client-side lifecycle and template-access rules are implemented in app code, while server-side enforcement beyond Dataverse table permissions is not confirmed in the repo docs.

### 6) Evidence

- src/main.tsx
- src/App.tsx
- src/app/router.ts
- src/app/dataverseRepository.ts
- src/app/templateAccess.ts
- docs/copilot-context.md
- .github/copilot-instructions.md
