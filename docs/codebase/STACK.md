# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|------|-------|----------|
| Primary language | TypeScript | package.json; tsconfig.app.json |
| Runtime + version | Browser SPA via React DOM 19.2.0; Node.js version [TODO] | package.json |
| Package manager | npm with lockfile | package.json; package-lock.json |
| Module/build system | Vite 7 with TypeScript project builds | package.json; vite.config.ts |

### 2) Production Frameworks and Dependencies

| Dependency | Version | Role in system | Evidence |
|------------|---------|----------------|----------|
| react | ^19.2.0 | Component runtime for the SPA | package.json |
| react-dom | ^19.2.0 | Browser rendering entry point | package.json; src/main.tsx |
| @fluentui/react-components | ^9.73.8 | UI component library used across screens and shared primitives | package.json; src/components/ui.tsx |
| @fluentui/react-icons | ^2.0.324 | Icon set used throughout the UI | package.json; src/App.tsx |
| @microsoft/power-apps | ^1.0.3 | Power Apps host/runtime integration | package.json; src/App.tsx |
| react-window | ^2.2.7 | Virtualized list rendering in shared UI | package.json; src/components/ui.tsx |

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|------|---------|----------|
| typescript | Compile-time typechecking and project builds | package.json; tsconfig.app.json |
| vite | Dev server and production bundling | package.json; vite.config.ts |
| @vitejs/plugin-react | React support in Vite | package.json; vite.config.ts |
| @microsoft/power-apps-vite | Power Apps Vite plugin | package.json; vite.config.ts |
| eslint | Linting | package.json; eslint.config.js |
| typescript-eslint | TypeScript lint rules | package.json; eslint.config.js |
| eslint-plugin-react-hooks | React hooks lint rules | package.json; eslint.config.js |
| eslint-plugin-react-refresh | React Refresh/Vite lint rules | package.json; eslint.config.js |
| vitest | Unit test runner | package.json; src/app/lifecycleTransitions.test.ts |

### 4) Key Commands

```bash
npm install
npm run build
npm run test
npm run lint
```

Windows note from repo docs:

```bash
npm.cmd install
npm.cmd run build
npm.cmd run test
npm.cmd run lint
```

### 5) Environment and Config

- Config sources: package.json, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json, eslint.config.js, power.config.json, .power/schemas/appschemas/dataSourcesInfo
- Required env vars: none found in committed `.env*` files; deployment-time configuration outside the repo is [TODO]
- Deployment/runtime constraints: connector-backed Dataverse reads are expected to run inside the Power Apps host or Local Play flow; local app URL is `http://localhost:5173`; production build path is `./dist`

### 6) Evidence

- package.json
- package-lock.json
- vite.config.ts
- tsconfig.app.json
- eslint.config.js
- power.config.json
- src/main.tsx
- src/App.tsx
- src/components/ui.tsx
