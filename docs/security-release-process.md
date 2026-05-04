# Security Release Process

## Purpose

Define the minimum repo-owned workflow for documenting security evidence for pull requests and releases in this Code App repository.

Use this process alongside:

- `docs/cybersecurity-compliance.md`
- `.github/pull_request_template.md`
- `.github/security.md`

This process is intentionally limited to repository-managed controls. Platform-managed promotion, environment governance, and tenant operations remain out of scope unless they are implemented as code in this repo.

## When This Process Applies

Use this process for:

- any pull request that changes application code, configuration, dependencies, or generated artifacts
- documentation updates that alter security or compliance guidance
- releases or deployments that rely on code produced from this repo
- security-relevant fixes, vulnerability remediations, or exceptions

Use the major-change steps below when a change introduces:

- a new trust boundary
- a significant authorization or role-enforcement change
- a significant sensitive-data handling change
- a new external integration

## Required Pull Request Evidence

Every pull request should record, at minimum:

- classification of the change
- files changed
- validation commands run and behaviors verified
- whether secrets, credentials, or restricted data were introduced
- whether dependencies changed
- whether security findings were introduced, remediated, or explicitly accepted as an exception

The canonical PR checklist lives in `.github/pull_request_template.md`.

## Standard Change Flow

### 1. Prepare the change

- confirm the change does not introduce secrets or restricted data into source, config, generated files, or documentation
- identify whether the change affects validation, access control, logging, lifecycle enforcement, dependencies, or data handling
- determine whether the change is a major change under this repo's security rules

### 2. Validate before review

Use the confirmed repo commands that match the change scope:

- `npm.cmd run lint`
- `npm.cmd run test`
- `npm.cmd run build`

If a command is not relevant or cannot be run, record that in the PR notes.

### 3. Complete PR security evidence

- complete the cybersecurity checklist in the PR template
- summarize any security-relevant behavior changes
- document dependency additions or upgrades and the review outcome
- document scan findings reviewed and whether any exception is required

### 4. Review and approve

- peer review is required for all changes
- security-focused review is required when the change affects authorization, sensitive data, integrations, release process, or security guidance
- major changes must include the required security artifacts before approval

## Major Change Artifacts

For a major change, add:

- a threat model under `docs/security/threat-model/` using `TM-<id>-<change>.md`
- a security design review under `docs/security/security-review/` using `SR-<id>-<change>.md`

Starter templates are available at:

- `docs/security/threat-model/TM-template.md`
- `docs/security/security-review/SR-template.md`

Minimum threat-model content:

- change summary
- affected data flows and trust boundaries
- threats identified
- mitigations and residual risk
- reviewer and decision

Minimum security-review content:

- design summary
- security concerns and required mitigations
- decision
- reviewer and date

## Vulnerability and Exception Handling

If a finding cannot be fully remediated in the change set:

- document the finding in the approved tracking location
- record compensating controls
- record approver, decision date, and review or expiry date
- reference the exception in the pull request or release evidence

Repo-specific tracking and approver fields are not yet recorded in this repo and should be filled in when the operational owner is confirmed.
Use the organization-approved vulnerability or exception tracker for formal records, and reference the record identifier in the pull request or release evidence.

## Release Evidence

For each release or deployment candidate, record:

- version or identifiable change set
- related PRs or changesets
- reviewers or approvers
- scans reviewed
- open vulnerabilities at release time and their disposition
- whether an SBOM was produced and where it is stored
- any approved exceptions linked to the release

If the repo stores SBOMs internally, place them under `docs/security/sbom/`.

## Ownership and Maintenance

- Process owner: Repository maintainers for the PSSR Management Code App
- Review cadence: update when PR workflow, scan expectations, release evidence requirements, or exception handling changes