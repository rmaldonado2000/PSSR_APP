---
description: "PSSR-specific UI, UX, Fluent UI, responsive layout, cards, pills, badges, forms, actions, visual states, and accessibility rules."
applyTo: "**/*.{ts,tsx,css,scss}"
---

# PSSR UI Instructions

These instructions apply to UI and UX work in the PSSR Power Platform Code App.

Use these instructions when the request involves:

- Screens, pages, routes, or layout
- Cards or gallery card layout
- Pills, badges, status indicators, or lifecycle labels
- Forms, fields, validation messages, dialogs, buttons, actions, or menus
- Loading, empty, error, disabled, read-only, or success states
- Responsive desktop/mobile behavior
- Styling, CSS, design tokens, class names, spacing, typography, or visual hierarchy
- Fluent UI components, Fluent UI tokens, FluentProvider, or Fluent UI themes
- Accessibility or keyboard behavior
- UI behavior driven by Dataverse, lifecycle, status, phase, role, or permissions

## Priority

Follow this priority order:

1. Current PSSR source code and existing implementation patterns.
2. `PSSR_app/.github/copilot-instructions.md`.
3. Repo documentation set.
4. This targeted UI instruction.
5. Generic user-level Code App instructions.

If this instruction conflicts with current repo code or project-level instructions, follow the repo-specific implementation truth and flag the inconsistency.

## Repo documentation set

Before changing UI-related logic, inspect the relevant repo documentation set.

Always inspect:

- `/docs/copilot-context.md`
- `README.md` if present

Inspect when relevant:

- `/docs/ui-gallery-card-anatomy.md`
- `/docs/ui-pill-standard.md`
- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- Any relevant `/docs/*-process.md`
- Any other request-relevant documentation in the repo

Do not paste, quote, duplicate, or summarize the full content of repo documentation.

## Existing architecture rule

For normal bug fixes, small enhancements, new features, documentation updates, and investigations, the current PSSR source code is the implementation truth.

Do not reshape UI architecture to match a generic template during normal implementation work.

If the current repo differs from generic Code App starter patterns:

1. Preserve the current repo pattern for the requested change.
2. Reuse existing components, layout wrappers, styling patterns, utility classes, hooks, dialogs, buttons, forms, cards, pills, badges, Fluent UI wrappers, and lifecycle UI patterns.
3. Flag architecture gaps as non-blocking recommendations.
4. Do not move files, rename folders, introduce a new design system, replace styling patterns, migrate to Fluent UI, or reorganize UI folders unless the request is explicitly classified as Architecture Alignment or UI Modernization.

## Mandatory first steps

Before editing UI-related code:

1. Inspect the relevant repo documentation.
2. Inspect `package.json` to confirm UI libraries already installed.
3. Inspect existing screens/pages/components related to the request.
4. Inspect existing reusable UI components.
5. Inspect existing Fluent UI usage if `@fluentui/react-components` or any Fluent UI package is present.
6. Inspect existing styling files, class names, layout wrappers, tokens, and theme/provider setup.
7. Inspect existing responsive behavior.
8. Inspect current loading, empty, error, disabled, read-only, validation, and success states.
9. Identify whether UI behavior depends on Dataverse, lifecycle, status, phase, role, or permissions.
10. Confirm whether documentation must be updated.
11. Make the smallest safe change.

## Component reuse rules

Reuse existing PSSR components before creating new ones.

Do not create a new component if an existing component, wrapper, helper, or pattern can be safely reused.

Before creating a new component:

1. Search for similar existing components.
2. Confirm the existing component cannot satisfy the requested behavior through props or composition.
3. Keep the new component small, focused, and consistent with current naming conventions.
4. Avoid introducing a new visual pattern.
5. Avoid duplicating logic already handled by existing components.
6. If Fluent UI is already used, prefer existing PSSR wrappers around Fluent UI before importing Fluent UI components directly.

## Styling rules

Follow existing PSSR styling patterns.

Do not introduce:

- New design systems
- New component libraries
- New styling frameworks
- New CSS-in-JS frameworks
- New theme systems
- New animation libraries
- New icon libraries
- New global style resets

unless explicitly required and approved.

