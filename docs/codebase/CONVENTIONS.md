# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| Files | PascalCase for screens/components; camelCase for app utilities | `PlansScreen.tsx`, `TemplateLibraryScreen.tsx`, `templateAccess.ts`, `dataverseRepository.ts` | src/screens/PlansScreen.tsx; src/app/templateAccess.ts |
| Functions/methods | camelCase | `getPlans`, `parseHashRoute`, `trackError` | src/app/dataverseRepository.ts; src/app/router.ts; src/app/telemetry.ts |
| Types/interfaces | PascalCase, often with `Vm`, `Props`, or `Draft` suffixes | `PlanVm`, `PlansScreenProps`, `TemplateAccessContext` | src/app/types.ts; src/screens/PlansScreen.tsx; src/app/templateAccess.ts |
| Constants/env vars | UPPER_SNAKE_CASE for constants | `ALL_OPTION_VALUE`, `READ_TIMEOUT_MS`, `DEFAULT_LOCALE` | src/screens/PlansScreen.tsx; src/app/dataverseRepository.ts; src/app/i18n.ts |

### 2) Formatting and Linting

- Formatter: [TODO] No Prettier or other formatter config file was found in the repo root
- Linter: ESLint flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`
- Most relevant enforced rules: TypeScript strict mode, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Run commands: `npm run lint`, `npm run build`, `npm run test`

### 3) Import and Module Conventions

- Import grouping/order: external packages first, then app-relative modules, then side-effect stylesheet imports
- Alias vs relative import policy: relative imports are used; no TS path alias is configured in `tsconfig.app.json`
- Public exports/barrel policy: generated clients are imported from the `src/generated` barrel, while most app modules import direct file paths

### 4) Error and Logging Conventions

- Error strategy by layer: `src/app/dataverseRepository.ts` throws `Error` objects after timeout/retry/normalization; UI layers keep `error` state as strings and render them through `DataState`/`MessageBar`
- Logging style and required context fields: telemetry helpers call `console.info('[telemetry]', event, payload ?? {})`; event names are grouped as `view.open`, `flow.event`, and `error`
- Sensitive-data redaction rules: repo instructions forbid secrets, tokens, tenant IDs, endpoints, credentials, and PII in logs; no automatic redaction layer was found in `src/app/telemetry.ts`, so safe logging currently depends on caller behavior

### 5) Testing Conventions

- Test file naming/location rule: co-located `*.test.ts` files under `src/app`
- Mocking strategy norm: local factory helpers plus `vi.fn` test doubles from Vitest
- Coverage expectation: [TODO] No committed coverage threshold or coverage config file was found

### 6) Evidence

- eslint.config.js
- tsconfig.app.json
- src/app/dataverseRepository.ts
- src/app/router.ts
- src/app/telemetry.ts
- src/app/i18n.ts
- src/screens/PlansScreen.tsx
- src/app/lifecycleTransitions.test.ts
- .github/copilot-instructions.md
