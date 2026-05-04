# Copilot Instructions — Power Apps Code App (Scalable + Sustainable)

## Architecture
- UI components never call connectors/data sources directly.
- All data access must go through a services layer (e.g., src/services/*).
- Services return typed results and normalize errors.

## Code quality
- TypeScript strict patterns; avoid `any`.
- Prefer small composable components and hooks.
- No secrets, tokens, tenant IDs, endpoints, or credentials in code.

## Output format for generated work
Always return:
1) Files to change/add
2) Code per file
3) Validation steps (commands + manual checks)