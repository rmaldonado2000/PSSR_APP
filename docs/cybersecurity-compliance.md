# Cybersecurity Compliance — Code Apps (Code Management & Code Considerations Only)

## Purpose
Define the minimum controls and evidence needed for this Code App repository to conform to the Cybersecurity Application Development Standard and Best Practice, focusing only on:
- How code is developed, reviewed, scanned, stored, and released as code artifacts.
- Secure-by-design activities that apply to code changes.
- Supply chain controls (dependencies/SBOM) and vulnerability management.
- Secure coding, testing, and AI-assisted development expectations that are owned by this repo.

This document intentionally excludes Power Platform platform-managed items (end-user authentication configuration, environment governance, promotion mechanics, platform monitoring setup) unless they directly affect code handling.

---

## Scope (In / Out)

### In scope (Code)
- Source control and repository controls for the Code App.
- Secure-by-design artifacts for major code changes (security plan, threat model, security review).
- Secure coding practices relevant to this app’s codebase (validation, error handling, data handling).
- Dependency tracking, SBOM production, vulnerability scanning and remediation workflow.
- Secrets management and preventing credentials/tokens in source or packages.
- Contributor workflow expectations for pull requests, release evidence, and security exceptions.
- AI-assisted code contribution controls when AI-generated code is introduced.

### Out of scope (Platform-managed)
- End-user authentication setup and platform IAM configuration.
- Environment promotion procedures and platform ALM mechanics (unless implemented as code/pipeline for this repo).
- Platform-level monitoring and SOC tooling configuration (document only what the code emits/produces).
- Mobile-device-management controls, native mobile runtime hardening, and retail promotional software controls not evidenced in this repo.
- Server, web-server, WAF, certificate pinning, and infrastructure hardening controls that are implemented outside this client repo.

---

## Applicable Requirements (Summary)
This repo complies with the following requirement themes:
1) Secure-by-Design: security plan, threat model for major changes, architecture/design security review, controlled build/release practices, validation, logging/monitoring expectations.
2) Code Repository & Source Control: enterprise repo usage, repository configuration, GitHub Advanced Security, least privilege access.
3) Supply Chain: SBOM and dependency management.
4) Vulnerability Management: identify prior to deployment, register/prioritize/remediate.
5) Secrets & Sensitive Data: no credentials/tokens in source or packages.
6) Secure Coding and Testing: validation, fail-secure behavior, code review, and security testing expectations.
7) AI-Assisted Delivery: AI-generated code is reviewed, scanned, and treated as normal code.

---

## Roles and Ownership

This repo does not define all enterprise roles from the broader best-practice baseline. For this repository, the following documentation ownership applies:

- Repository maintainers own the repository rules, required reviews, and release readiness checks.
- Contributors own secure coding, validation, and documentation of evidence in pull requests.
- Reviewers own peer review of code and documentation changes, including security-relevant change scope.
- Security reviewers or designated approvers are required when a change introduces a major trust-boundary, authorization, or sensitive-data impact.

Where team names, approvers, or operational tools are not yet recorded in this repo, they should be documented in the repo-specific fields below instead of inferred.

---

## 1) Secure-by-Design (Code-Level)

### 1.1 Software Security Plan (Required)
Control:
- Maintain a documented security plan that covers roles, training, coding standards, and security checks across the lifecycle.

Evidence:
- This file is the security plan for code-level controls.
- Additional project-specific workflow expectations are documented in `docs/security-release-process.md`.
- Any future secure-development workflow document should extend this file rather than duplicate it.

### 1.2 Threat Modeling (Required for major changes)
Trigger (major change examples):
- New external integration from the Code App.
- Major change to data flows, authorization checks implemented in code, or sensitive data handling.
- Significant new feature altering trust boundaries.

Control:
- Perform threat modeling for new features and major changes and store with design artifacts.

Evidence format (store in repo):
- `docs/security/threat-model/TM-<id>-<change>.md`

Minimum contents:
- Change summary
- Data flows / trust boundaries (text or diagram reference)
- Threats identified
- Mitigations and residual risk
- Reviewer and decision

### 1.3 Architecture/Design Security Review (Required for major changes)
Control:
- Architecture and design undergo a security review before implementation for major changes.

Evidence format (store in repo):
- `docs/security/security-review/SR-<id>-<change>.md`

Minimum contents:
- Design summary
- Security concerns and required mitigations
- Decision (approved / changes required)
- Reviewer and date

### 1.4 Build/Release Controls (Code Perspective)
Control:
- Build and release processes must be controlled and reproducible (as applied to code artifacts).

Evidence:
- Document code release strategy here:
  - Versioning approach: `package.json` currently uses the placeholder version `0.0.0`; formal release versioning is not yet encoded in repo metadata and should be carried in release evidence until standardized
  - Tagging approach: No repository tagging approach is documented in the current codebase
  - Release notes location: Pull request history and repo process docs; no dedicated release-notes file confirmed

Release workflow:
- Security evidence expectations for code changes and releases are documented in `docs/security-release-process.md`.
- Pull requests must carry the repo's cybersecurity checklist before merge.

Note:
- If the org release vehicle is Power Platform solution export/import, that is platform-managed and is out of scope here unless it requires code-specific steps in this repo.

---

## 2) Source Control & Repository Controls (Required)

### 2.1 Enterprise Approved Repository (Required)
Control:
- All application source code and related development artifacts must be stored only in enterprise approved code repositories (GitHub Enterprise as authoritative platform).

Evidence (record here):
- Repo name: PSSR Management Code App
- Repo host: GitHub Enterprise
- Owner team: Repository maintainers for the PSSR Management Code App
- Admin list (minimal): Managed through GitHub Enterprise repository administration and not enumerated in source control

### 2.2 Repository Configuration & Governance (Required)
Control:
- Repositories must be configured and managed per enterprise security and data governance standards.

Minimum repo rules (record your current state):
- Branch protection on default branch: TBC (not confirmed from current codebase)
- Require PR review: Expected by repo policy; branch setting not confirmed from current codebase
- Require status checks before merge: TBC (not confirmed from current codebase)
- Restrict who can push to default branch: TBC (not confirmed from current codebase)

### 2.3 GitHub Advanced Security (Required for GitHub repos)
Control:
- GitHub Advanced Security controls enabled:
  - Secret scanning
  - Dependency scanning
  - Code scanning

Evidence (record your current state):
- Secret scanning: TBC (not confirmed from current codebase)
- Dependency scanning: TBC (not confirmed from current codebase)
- Code scanning (SAST): TBC (not confirmed from current codebase)
- Alert triage owner: Repository maintainers and assigned reviewers
- Triage cadence: Per pull request and before release approval

### 2.4 Least Privilege Access (Required)
Control:
- Access to the repository follows least privilege.

Evidence:
- Access review cadence: Managed under enterprise GitHub access governance outside source control
- Last access review date: Managed outside this repo
- Notes: Least-privilege access is required by repo policy even where operational ownership is documented elsewhere.

---

## 3) Secrets & Sensitive Data (Required)

### 3.1 No Secrets in Source or Packages (Required)
Control:
- No hard-coded credentials, passwords, auth tokens, keys, or connection strings in source code or packages.
- Restricted/confidential data excluded from source or packages.

Evidence:
- Secret scanning enabled (see section 2.3).
- Manual review checklist for PRs (see section 6.2).
- Contributors must not add temporary secrets for debugging, local testing, or generated files.

### 3.2 If Automation/Pipelines Are Used (Conditional)
Control:
- If CI/CD pipelines exist for this repo, authentication must not rely on static credentials.

Evidence (only if applicable):
- Pipeline uses: No repo-managed CI/CD workflow files are committed under `.github/workflows` in the current workspace
- If YES:
  - Auth method: Must not rely on static credentials
  - Secrets storage: Repo-approved runtime or platform injection only
  - Rotation owner: The approved pipeline or platform owner for that automation path

---

## 4) Secure Coding Expectations (Code Considerations)

### 4.1 Input/Output Validation (Required)
Control:
- Validate user/system inputs and outputs.

Project rules (fill in how your codebase enforces this):
- Input validation: Validate user-provided values before persistence; do not trust client/UI-only constraints when a write path can enforce business rules.
- Output validation/reconciliation (where needed): Normalize Dataverse/service results before display and avoid rendering raw backend errors or untrusted content directly.
- Data constraints: Keep lifecycle, permission, and repository-side guards aligned with UI restrictions where the codebase already provides those boundaries.

### 4.2 Error Handling & “Fail Securely” (Best Practice)
Rules:
- Do not expose sensitive internal details in error messages.
- Ensure failures do not leave the system in an insecure state.

Project rules:
- Error logging approach: Current code-level telemetry is console-based; future logging must avoid sensitive payloads and should apply an explicit payload contract or scrubber before broader use.
- User-facing error messaging approach: Surface minimal, actionable error messages and avoid exposing stack traces, raw connector responses, secrets, or restricted data.

### 4.3 Secure Coding and Review Expectations (Required)
Rules:
- Use peer review for all code changes.
- Review secure coding concerns alongside functionality, especially validation, access control, error handling, logging, and dependency changes.
- Use repository tests and scans appropriate to the change before merge.

Project rules:
- Review workflow: Pull requests use the repo's PR template and cybersecurity checklist.
- Security review trigger: Major changes require documented threat-model and security-review artifacts before merge.
- Manual review expectation: Reviewers should inspect for hardcoded secrets, unsafe logging, inadequate validation, and bypassable client-only enforcement.

### 4.4 Dependency Hygiene (Best Practice)
Rules:
- Track dependencies and packages.
- Keep dependency updates managed and tested.

Project rules:
- Dependency update cadence: Review at each dependency change and during vulnerability remediation work
- Owner: Repository maintainers, with dependency-specific changes documented by the contributor making the change
- Additional expectation: New or upgraded dependencies must be justified in the PR and reviewed for security findings.

### 4.5 Security Testing Expectations (Best Practice)
Rules:
- Use automated and manual validation appropriate to the change scope.
- Security-relevant changes should be validated before release.

Project rules:
- Confirmed repo validation commands: `npm.cmd run lint`, `npm.cmd run test`, and `npm.cmd run build`
- Current automated coverage focus: lifecycle and template-access unit tests documented in `docs/codebase/TESTING.md`
- Additional testing expectation: security-relevant changes should include behavior-scoped validation notes in the PR even when a dedicated SAST/DAST tool result is managed outside the repo

### 4.6 Training and Awareness (Best Practice)
Rules:
- Contributors should remain current on secure coding practices relevant to the frameworks and services used in this repo.

Project rules:
- Training record location: Managed outside source control; this repo records only the required secure-coding expectations and references
- Baseline references: OWASP, NIST SSDF, repo-specific security instructions, and request-relevant architecture/lifecycle docs

---

## 5) Supply Chain: SBOM & Dependency Tracking (Required)

### 5.1 SBOM Per Release (Required)
Control:
- Produce an SBOM for each new release (machine-readable and consumable by ServiceNow when required).

Evidence approach (choose one):
- Store SBOM in repo: NO by current repo evidence; no committed SBOM artifacts or `docs/security/sbom/` directory are present today
- If YES: store under `docs/security/sbom/` as `SBOM-<version>.<ext>`
- If NO: store externally and record reference in release notes or release evidence.

Record:
- SBOM format: Defined by the external release or compliance tooling used for the release
- SBOM generation method: Managed outside the current repo until an in-repo SBOM workflow is adopted
- Dependency tracking expectation: all dependencies and packages used by this repo should be tracked, vetted, and managed for vulnerabilities.

---

## 6) Vulnerability Management (Required)

### 6.1 Identify Vulnerabilities Prior to Deployment (Required)
Control:
- Security vulnerabilities identified prior to code deployment.

Evidence:
- Code scanning/SAST results reviewed before release.
- Dependency scanning alerts reviewed and addressed or documented.
- Manual review findings and repo-specific validation evidence are recorded with the pull request or release evidence.

### 6.2 Register / Prioritize / Remediate (Required)
Control:
- Vulnerabilities registered, prioritized, and remediated.

Record:
- Tracking tool: Organization-approved vulnerability tracking system, referenced from pull requests or release evidence when applicable
- Severity handling rules: Prioritize by severity, exploitability, exposure, and business impact
- Remediation SLA expectations: Remediate in the same change set when feasible; otherwise require an approved exception before release
- Exception path (if any): Use the documented exception process and approval path in `docs/security-release-process.md`

---

## 7) Logging & Monitoring (Code Perspective Only) (Required)
Control:
- Logging/monitoring of end user, privileged user and system activities (document what the code emits).

Record:
- What the app logs (events/types): Current code evidence indicates console-based telemetry helpers and local informational events; a complete event catalog is not recorded in this repo
- Where logs go (code-level): Current in-code sink is `console.info`
- Telemetry sink: none in code beyond console output

Note:
- Platform SOC/SIEM integration configuration is out of scope here; document only what the code produces.
- If external telemetry or SIEM integration is later added, update this document and the release process documentation in the same change set.

---

## 8) AI-Generated Code (Conditional)
Control:
- If AI-generated code is introduced, it must receive peer review and be subjected to SAST.

Record:
- AI-generated code allowed? YES, with normal review and scan requirements
- If YES:
  - Required PR label or checklist item: Use the PR cybersecurity checklist; document security-relevant impacts in the PR summary and validation section
  - Required scan gate before merge: Same scan and review gates as non-AI-generated code
  - Additional expectation: Do not submit large unverifiable generated code blocks that do not match repo patterns

If future runtime AI, ML, or LLM functionality is added to the app itself, document dataset handling, masking/tokenization expectations, and any model bill of materials requirements in a dedicated design or security artifact.

---

## 9) Evidence Checklist (Per Release — Code Only)

For each release/version, record:

### Release <VERSION> — <DATE>
- PR(s)/change set: <REF>
- Approver/reviewer(s): <NAMES>
- Scans reviewed (code + dependency + secrets): YES/NO
- Vulnerabilities open at release time: YES/NO
  - If YES: references + approvals/mitigations: <REF>
- SBOM produced: YES/NO
  - SBOM reference/path: <REF>
- Notes:

Use `docs/security-release-process.md` for the operational steps and evidence expectations that support this checklist.

---

## 10) Document Maintenance
- Owner: Repository maintainers for the PSSR Management Code App
- Review cadence: update when repo controls, scanning, dependency strategy, secure coding rules, or release/security evidence workflow changes.

## 11) Explicit Out-of-Scope Best-Practice Areas

The broader cybersecurity best-practice baseline contains controls that are not owned by this repo unless the app scope changes. These are intentionally out of scope for this document today:

- Native mobile device security and MDM-specific controls
- Retail promotional software controls
- Infrastructure/server hardening implemented outside this client repo
- Enterprise IAM configuration and cloud/server MFA enforcement outside repo-managed assets
- External monitoring, Sentinel, SIEM, or platform operations configuration beyond what the code itself emits