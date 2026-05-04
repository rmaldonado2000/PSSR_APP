# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path | Purpose | Evidence |
|------|---------|----------|
| .github/ | Repo-specific Copilot instructions, prompts, and engineering guidance | .github/copilot-instructions.md; .github/instructions/services-layer.instructions.md |
| .power/ | Power Apps schema metadata consumed by the Dataverse client layer | src/app/dataverseRepository.ts |
| docs/ | Product behavior, schema, UI reference docs, and generated codebase docs | docs/copilot-context.md; docs/pssr-lifecycle-schema.md |
| public/ | Static public assets served by Vite | package.json; workspace root listing |
| src/ | Application source code | src/main.tsx; src/App.tsx |
| package.json | Scripts, dependencies, and dev tooling manifests | package.json |
| power.config.json | Power Apps app/environment metadata and Dataverse datasource bindings | power.config.json |
| vite.config.ts | Vite build configuration | vite.config.ts |

### 2) Entry Points

- Main runtime entry: src/main.tsx
- Secondary entry points (worker/cli/jobs): NONE found
- How entry is selected (script/config): `npm run dev` runs `vite`, and `npm run build` runs `tsc -b && vite build`; `src/main.tsx` renders `src/App.tsx`

### 3) Module Boundaries

| Boundary | What belongs here | What must not be here |
|----------|-------------------|------------------------|
| src/screens | Presentational screens and UI interaction props | Direct connector/data-source calls |
| src/app | App orchestration, routing, lifecycle logic, repository functions, shared types, formatting, i18n, telemetry | Generated connector clients |
| src/components | Reusable UI primitives and responsive helpers | Dataverse read/write logic |
| src/generated | Generated models and service clients from the Power Apps/Dataverse toolchain | Manually maintained business rules |
| docs | Product and engineering reference documentation | Runtime code |

### 4) Naming and Organization Rules

- File naming pattern: PascalCase for screen/component files such as `PlansScreen.tsx` and `TemplateLibraryScreen.tsx`; camelCase for app utility files such as `router.ts`, `templateAccess.ts`, and `dataverseRepository.ts`
- Directory organization pattern: hybrid layer-based structure under `src/` (`app`, `components`, `generated`, `screens`, `ui`)
- Import aliasing or path conventions: relative imports are used throughout; no TypeScript `paths` alias is configured in `tsconfig.app.json`

### 5) Evidence

- src/main.tsx
- src/App.tsx
- src/app/dataverseRepository.ts
- src/components/ui.tsx
- src/screens/PlansScreen.tsx
- tsconfig.app.json
- package.json
- docs/copilot-context.md
