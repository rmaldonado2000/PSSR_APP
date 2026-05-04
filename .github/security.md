# Security Policy — PSSR Code App Repository

## Purpose
This file defines how security vulnerabilities and security issues are handled for this Code App repository.
It applies to all code changes, including AI-assisted/Copilot-generated changes.

Use this file alongside:
- `docs/cybersecurity-compliance.md`
- `docs/security-release-process.md`
- `.github/pull_request_template.md`

## Scope
In scope:
- Repository source code, configurations, and dependencies.
- Security findings from code scanning, dependency scanning, and secret scanning.
- Secure coding defects (input validation, error handling, exposed parameters, hardcoded passwords).

Out of scope:
- Power Platform tenant/platform operations (handled by platform governance processes).
- Environment promotion mechanics (handled by platform ALM processes).

## Security Principles (Non-Negotiable)
1) No secrets in repo:
- Do not commit credentials, tokens, keys, certificates, connection strings, or auth headers.
- Do not add "temporary" secrets for debugging.

2) Do not bypass security controls:
- Do not disable or bypass scanning (code, dependency, secret).
- Do not weaken branch protections or required reviews.

3) Findings must be handled:
- Security findings must be remediated or explicitly documented as an exception with approval.

## How to Report a Security Issue
If you discover a security vulnerability or suspect a security issue:
- Do not open a public issue or include sensitive details in chat threads.
- Notify the repo owners or the designated security contact for the project using the organization’s approved reporting channel.

Record the repo security contact(s) here:
- Primary contact: Repository maintainers through the organization's approved security reporting channel
- Backup contact: The designated security reviewer or approver for the affected change, when one is assigned

## Handling Security Findings (Workflow)
### 1) Triage
For any security finding (from scanning tools or manual review):
- Confirm whether it is a true positive or false positive.
- Assign an owner for remediation.
- Assign priority based on severity and exposure.

### 2) Remediation
- Fix the issue in code and include the remediation in the same PR when possible.
- Add tests/validation steps to prevent regression when applicable.

### 3) Validation
- Re-run the relevant checks and confirm the finding is resolved.
- Document what changed and what evidence confirms closure.

### 4) Tracking
Record where vulnerabilities are tracked:
- Tracking tool: Organization-approved vulnerability tracking system
- How to reference a record in PRs: Include the tracking record identifier in the PR summary, validation notes, or release evidence when applicable

## Dependency and Supply Chain Security
If you add or update dependencies:
- Justify why the dependency is needed.
- Prefer existing dependencies already in the repo.
- Review dependency scanning results.
- If your repo produces SBOM evidence, record the update per the project’s SBOM process.

Current repo note:
- No in-repo SBOM artifact directory is committed today; if SBOM evidence is produced externally, reference it in release evidence per `docs/security-release-process.md`

## Secure Coding Expectations (Examples of Issues to Prevent)
- Hardcoded passwords or secrets
- Poor input validation
- Poor error handling that exposes internal/restricted/confidential data
- Exposed security parameters
- Violations of approved security architecture and policies

## Exceptions (Risk Acceptance)
If a security issue cannot be remediated immediately:
- Create a documented exception record with:
  - description of the risk,
  - justification,
  - compensating controls,
  - expiration/review date,
  - approval.

Record where exceptions are stored:
- Exception location: Organization-approved vulnerability or exception tracking system, with the exception referenced in the PR or release evidence
- Approver role(s): Repository maintainers and any required security approver for the impacted change

## Maintenance
- File owner: Repository maintainers for the PSSR Management Code App
- Review cadence: update when repo scanning, vulnerability workflow, release evidence workflow, or exception process changes.