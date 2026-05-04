---
applyTo: "src/services/**/*.ts,src/**/services/**/*.ts,src/generated/**/*.ts"
---
# Data access / connectors / services rules

- UI components must NOT call connectors or data sources directly.
- All data access must be implemented in the services layer (src/services/**).
- Services must return typed results (no `any`) and normalize errors into a consistent shape.
- Components receive clean domain models, not raw connector payloads.
- Do not add secrets, tokens, tenant IDs, or endpoints in code.