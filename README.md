# PSSR Management Code App

PSSR Management is a Power Apps Code App for managing pre-startup safety review plans, plan checklists, checklist questions, deficiencies, approvals, team assignments, and template libraries backed by Dataverse.

The app is built as a React single-page application and runs inside the Power Apps runtime, using generated Dataverse service clients plus a repository layer to keep UI code separate from connector access.

## Technology Stack

- React 19
- TypeScript 5.9
- Vite 7
- Fluent UI React Components
- Power Apps Code Apps SDK via `@microsoft/power-apps`
- Power Apps Vite plugin via `@microsoft/power-apps-vite`
- Dataverse generated models and service clients in `src/generated`
- Vitest for unit tests
- ESLint 9 for linting

Primary package scripts:

```bash
npm run dev
npm run build
npm run lint
npm run test
```

If PowerShell execution policy blocks npm on this machine, use `npm.cmd` instead.

## Security & Compliance (Code App)

This repo enforces cybersecurity requirements for Code App source code and artifacts.

Required policy files:
- `.github/copilot-instructions.md` (mandatory Copilot rules)
- `.github/pull_request_template.md` (PR compliance gate)
- `.github/security.md` (vulnerability handling and reporting policy)
- `docs/cybersecurity-compliance.md` (code-level compliance binder)
- `docs/security-release-process.md` (release evidence, scan review, and exception workflow)
- `docs/copilot-context.md` (app-specific verified repo context)

Non-negotiables:
- No secrets or credentials in source code or repo artifacts.
- Do not bypass code/dependency/secret scanning or branch protections.
- Vulnerability findings must be remediated or explicitly documented as an approved exception.

## Project Architecture

The application follows a thin-UI, service-oriented client architecture:

- Screen components render state and user interactions.
- Shared app logic lives in `src/app`.
- Dataverse access is centralized through generated services and the repository layer.
- UI components do not call connectors or data sources directly.
- Lifecycle rules, template access, routing, formatting, telemetry, and view models are kept out of the screens.

High-level flow:

```text
Power Apps Host / Local Play
        |
        v
 React App (App.tsx + screens)
        |
        v
 Shared app layer (routing, lifecycle, template access, repository)
        |
        v
 Generated Dataverse services and models
        |
        v
 Dataverse tables
```

Key runtime characteristics:

- Entry point is `src/main.tsx`; `src/App.tsx` is the current composition root.
- Routing is hash-based rather than React Router.
- Initial load prioritizes plans, with template data fetched in the background afterward.
- Standalone localhost sessions can redirect into Power Apps Local Play using `power.config.json`.

## Getting Started

### Prerequisites

- Node.js with npm
- Access to the target Power Apps / Dataverse environment
- Power Apps Local Play support for running connector-backed scenarios locally

### Install dependencies

```bash
npm install
```

Windows note:

```bash
npm.cmd install
```

### Start the app

```bash
npm run dev
```

The configured local app URL is `http://localhost:5173`.

### Build for deployment

```bash
npm run build
```

The production build output is written to `dist/`, which is also the `buildPath` referenced by `power.config.json`.

### Validate locally

```bash
npm run lint
npm run test
```

## Project Structure

```text
src/
  app/          Core app logic: routing, lifecycle, repository, types, i18n, telemetry
  components/   Shared UI building blocks and responsive helpers
  generated/    Generated Dataverse models and service clients
  screens/      Top-level application screens
  ui/tokens/    Shared styling tokens
docs/           Behavior, schema, and UI reference documentation
public/         Static assets
```

Current primary screens:

- `PlansScreen`
- `PlanDetailsScreen`
- `ChecklistDetailsScreen`
- `TemplateLibraryScreen`

## Key Features

- Plan gallery with search, filters, and responsive mobile behavior
- Plan detail experience with tabs for details, checklists, deficiencies, approvals, and team
- Checklist runner with staged question answering and checklist completion flow
- Template library for checklist and question management
- Role- and site-aware template access rules based on `systemusers`
- Lifecycle transition enforcement for Draft, Plan, Execution, Approval, and Completion
- Approval history handling aligned to Dataverse approval records
- Deficiency tracking, categorization, and closeout workflow
- Responsive UI conventions built on reusable Fluent UI-based components

## Dataverse Model

The app centers on these functional tables:

- `crc07_pssr_plans`
- `crc07_pssr_checklists`
- `crc07_pssr_checklist_questions`
- `crc07_pssr_deficiencies`
- `crc07_pssr_approvals`
- `crc07_pssr_team_members`
- `crc07_pssr_template_checklists`
- `crc07_pssr_template_questions`
- `systemusers`

Additional configured references are present in `power.config.json`, including project, MOC, and TA revision tables.

See the detailed schema reference in [docs/pssr-lifecycle-schema.md](docs/pssr-lifecycle-schema.md).

## Development Workflow

- Develop the UI and client logic in VS Code with Vite.
- Keep connector and Dataverse access in the repository or service layer rather than in screen components.
- Use generated Dataverse clients from `src/generated` for data operations.
- Validate behavior with focused unit tests in `src/app`.
- Use the Power Apps host or Local Play for realistic connector-backed testing.

Runtime and feature notes are documented in [docs/copilot-context.md](docs/copilot-context.md).

## Coding Standards

Project-specific expectations from `.github/copilot-instructions.md`:

- UI components never call connectors or data sources directly.
- All data access goes through a services layer or repository abstraction.
- Services return typed results and normalize errors.
- Follow strict TypeScript patterns and avoid `any`.
- Prefer small composable components and hooks.
- Do not place secrets, tokens, tenant IDs, endpoints, or credentials in code.

Additional practical conventions seen in the codebase:

- Reuse shared UI primitives from `src/components/ui.tsx`.
- Keep lifecycle rules centralized in `src/app/lifecycle.ts` and `src/app/lifecycleTransitions.ts`.
- Keep template access logic centralized in `src/app/templateAccess.ts`.

## Testing

The repository currently uses Vitest for unit coverage of core business rules.

Tested areas include:

- Lifecycle guards and transitions
- Approval handling rules
- Template access filtering and sequence validation

Run the test suite with:

```bash
npm run test
```

Relevant examples:

- `src/app/lifecycleTransitions.test.ts`
- `src/app/templateAccess.test.ts`

## Documentation

Useful repo documentation:

- [docs/copilot-context.md](docs/copilot-context.md)
- [docs/pssr-lifecycle-behavior.md](docs/pssr-lifecycle-behavior.md)
- [docs/pssr-lifecycle-schema.md](docs/pssr-lifecycle-schema.md)
- [docs/ui-gallery-card-anatomy.md](docs/ui-gallery-card-anatomy.md)
- [docs/ui-pill-standard.md](docs/ui-pill-standard.md)

## Contributing

When contributing:

- Keep UI, business logic, and data access separated.
- Add or update tests when changing lifecycle, approval, template access, or repository logic.
- Preserve strict typing and avoid introducing `any`.
- Prefer minimal, focused changes over broad refactors.
- Follow the repository instructions in `.github/copilot-instructions.md`.

## License

No license file or explicit license declaration was identified in this repository. Add a license before distributing the project outside its current intended scope.
