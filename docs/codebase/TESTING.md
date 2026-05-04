# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: Vitest 4.1.5
- Assertion/mocking tools: `expect`, `it`, `describe`, and `vi` from Vitest
- Commands:

```bash
npm run test
npm run test    # unit tests
[TODO] No separate integration/e2e command found
[TODO] No coverage command found
```

### 2) Test Layout

- Test file placement pattern: co-located under `src/app`
- Naming convention: `*.test.ts`
- Setup files and where they run: none found

### 3) Test Scope Matrix

| Scope | Covered? | Typical target | Notes |
|-------|----------|----------------|-------|
| Unit | yes | Lifecycle and template-access logic in `src/app` | Covered by `lifecycleTransitions.test.ts` and `templateAccess.test.ts` |
| Integration | no files found | [TODO] | No integration-specific test files or configs were found |
| E2E | no files found | [TODO] | No Playwright/Cypress/Webdriver config was found |

### 4) Mocking and Isolation Strategy

- Main mocking approach: dependency objects created in-test with `vi.fn` plus local fixture factory helpers
- Isolation guarantees: tests create fresh view-model fixtures and dependency stubs per case; no shared global setup file was found
- Common failure mode in tests: [TODO] No flake-reporting or historical test-failure tracking was found in the repo

### 5) Coverage and Quality Signals

- Coverage tool + threshold: [TODO] none found
- Current reported coverage: [TODO] none found in committed artifacts
- Known gaps/flaky areas: no screen/component tests found, no repository integration tests found, and no end-to-end flow coverage found

### 6) Evidence

- package.json
- src/app/lifecycleTransitions.test.ts
- src/app/templateAccess.test.ts
- src/app/lifecycle.ts
- src/app/templateAccess.ts
