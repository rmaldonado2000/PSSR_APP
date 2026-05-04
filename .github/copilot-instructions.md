# PSSR App - GitHub Copilot Instructions

These instructions apply to the PSSR Power Platform Code App repository.

The app is a Vite + React + TypeScript Code App integrated with Dataverse. All Copilot work in this repo must preserve the existing architecture, Dataverse patterns, lifecycle/status/permission rules, UI standards, documentation structure, and validation expectations.

---

## Repo documentation set

The repo documentation set includes, when present:

- `README.md`
- `/docs/copilot-context.md`
- `/docs/pssr-lifecycle-behavior.md`
- `/docs/pssr-lifecycle-schema.md`
- `/docs/ui-gallery-card-anatomy.md`
- `/docs/ui-pill-standard.md`
- `/docs/*-process.md`
- `/docs/cybersecurity-compliance.md` (code-level cybersecurity compliance)
- Any other request-relevant documentation in the repo

---

## Existing architecture rule

For normal bug fixes, small enhancements, new features, documentation updates, and investigations, the current PSSR source code is the implementation truth.

Do not reshape the repository to match a generic Code App template during normal implementation work.

If the current repo architecture differs from generic Microsoft Code Apps starter patterns:

1. Preserve the current repo pattern for the requested change.
2. Reuse existing folders, components, services, hooks, utilities, lifecycle logic, styling patterns, and Dataverse integration patterns.
3. Flag architecture gaps as non-blocking recommendations.
4. Do not move files, rename folders, introduce new layers, replace service patterns, or reorganize generated files unless the request is explicitly classified as Architecture Alignment.
5. If Architecture Alignment is requested, produce a phased migration plan before editing code.
6. Each architecture alignment phase must be small, independently validated, and documented.

---

## Mandatory first steps

Before answering, planning, reviewing, or editing:

1. Open and read `/docs/copilot-context.md` from the repo.
2. Open and read `/docs/cybersecurity-compliance.md` from the repo if present.
3. Open and read `README.md` from the repo root if present.
4. Inspect any specialized documentation relevant to the request.
5. Inspect any process documentation relevant to the request.
6. Inspect the current codebase before recommending or making changes.
7. Treat the repo documentation set and current source code as authoritative project context.
8. Do not paste, quote, duplicate, or summarize the full content of any repo documentation file.
9. If documentation and code conflict:
   - Treat current source code as implementation truth.
   - Treat documentation as intended guidance.
   - Call out the inconsistency.
   - Recommend whether code or documentation should be updated.
   - Do not silently choose one.

---

## Cybersecurity non-negotiables (Code App compliance)

These rules are mandatory for all Copilot-generated changes:

1) No secrets or credentials in code or packages
- Do not add hard-coded passwords, tokens, keys, client secrets, certificates, connection strings, or auth headers.
- Do not add "temporary" secrets for debugging.
- If a secret is needed, require a repo-approved runtime injection method (do not invent a new secret mechanism).

2) Do not weaken repo security posture
- Never recommend disabling or bypassing secret scanning, dependency scanning, or code scanning.
- Never add steps to store or process source code in personal/public/non-enterprise repositories.
- Never bypass branch protection or required reviews.

3) Vulnerabilities must be addressed prior to deployment
- If changes introduce vulnerability findings, propose remediation in the same change set.
- If remediation is not possible, require a documented exception path per repo policy (do not silently ship).

4) Supply chain discipline (dependencies + SBOM expectations)
- Avoid new dependencies unless explicitly required.
- Prefer existing dependencies already in the repo.
- If adding/upgrading dependencies:
  - justify the change,
  - ensure dependency scanning remains enabled,
  - ensure vulnerability findings are handled,
  - ensure SBOM evidence requirements (if used by this repo) are followed.

5) Secure-by-design artifacts for major changes
For major changes (new feature with new trust boundary, new integration, significant authorization changes, significant data flow changes):
- Require a threat model artifact per repo policy (if your repo uses one).
- Require a security/design review artifact per repo policy (if your repo uses one).
- Require explicit validation notes.

6) AI-generated code is treated as normal code
- AI-generated code must be peer reviewed and pass scanning gates.
- Do not add large code blocks that do not match existing repo patterns and conventions.

---

## Request classification

Classify work as one of:

- Bug Fix
- Small Enhancement
- New Feature
- Documentation Update
- Investigation Only
- Architecture Alignment

If classification is unclear, choose the safest classification and state the assumption.

---

## Scope guard

Change only what is required to satisfy the request and acceptance criteria.

Do not perform:

- Unrelated refactors
- Broad rewrites
- Folder reorganization
- Formatting-only noise
- Dependency changes unless explicitly required and justified
- Duplicate implementations
- Unrelated documentation rewrites

---

## Architecture rules

Preserve existing PSSR architecture.

Do not:

- Add direct Dataverse calls inside screen/page components.
- Create duplicate services or repository functions.
- Create duplicate UI components when existing components can be reused.
- Create duplicate hooks, helpers, validation logic, lifecycle logic, or styling patterns.
- Rename unrelated files or symbols.
- Modify unrelated files.
- Add new libraries unless explicitly required and justified.
- Reshape the app to match a generic starter template unless explicitly classified as Architecture Alignment.

Prefer:

- Reusing existing components, hooks, helpers, services, repositories, lifecycle utilities, validation utilities, and styling patterns.
- Extending existing abstractions when safe.
- Keeping changes local, minimal, and maintainable.

---

## Hard stops (must stop and ask for human input)

Stop and request human input if any is true:

- The request requires introducing secrets/credentials and no repo-approved runtime injection approach is visible.
- The request requires bypassing or disabling security scanning or branch protections.
- The request requires storing code outside enterprise-approved repositories.
- A new dependency is required but you cannot justify it or cannot confirm scanning gates will remain active.
- The requested change is a major change but required security artifacts (threat model / security review) are missing and you cannot locate the repo’s policy for them.

---

## Required output format for Copilot responses

For any implementation plan or code change proposal, always include:

1) Classification: Bug Fix / Small Enhancement / New Feature / Documentation Update / Investigation Only / Architecture Alignment
2) Files to change (exact paths)
3) Change summary (short bullets)
4) Security checklist:
   - Secrets introduced? (must be NO)
   - New dependencies? (YES/NO + reason)
   - Scanning impacted? (YES/NO)
   - Vulnerability findings expected? (YES/NO)
   - Major change requiring threat model/security review? (YES/NO)
5) Implementation steps (minimal and repo-specific)
6) Validation steps (tests to run / behaviors to verify)
7) Documentation updates required:
   - Update `/docs/copilot-context.md` only if behavior/structure/patterns changed.
   - Update `/docs/cybersecurity-compliance.md` only if compliance process changes.

---

## Architecture Alignment rules

Only apply these rules when the request is explicitly classified as Architecture Alignment.

Architecture Alignment means intentionally modernizing or restructuring the repo to better align with approved Code App architecture patterns.

Before any Architecture Alignment implementation:

1. Inspect the repo documentation set.
2. Inspect the current codebase.
3. Produce a phased migration plan.
4. Identify risks, rollback strategy, validation steps, and documentation updates.
5. Do not implement architecture movement until the plan is approved.

Architecture Alignment must not be mixed into normal bug fixes, enhancements, or feature work.