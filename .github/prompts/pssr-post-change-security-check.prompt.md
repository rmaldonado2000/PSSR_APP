---
description: "Run post-change PSSR security, release-evidence, and documentation checks after implementation"
name: "PSSR Post-Change Security Check"
argument-hint: "Describe the implemented change or paste the acceptance criteria"
agent: "agent"
---

# PSSR Post-Change Security Check

Use this prompt in GitHub Copilot Agent/Edit mode after code or documentation changes are already implemented in the PSSR Power Platform Code App.

This prompt is for post-implementation verification only. Use it to check whether the implemented changes satisfy the repo's security, release-evidence, validation, and documentation expectations.

Do not use this prompt to design a new feature from scratch.

## Before starting

Open and read the repo documentation set relevant to the implemented change, including:

- [docs/copilot-context.md](../../docs/copilot-context.md)
- [README.md](../../README.md) if setup, scripts, or developer workflow may be affected
- [docs/cybersecurity-compliance.md](../../docs/cybersecurity-compliance.md)
- [docs/security-release-process.md](../../docs/security-release-process.md)
- [.github/security.md](../security.md)
- [.github/pull_request_template.md](../pull_request_template.md)
- [docs/pssr-lifecycle-behavior.md](../../docs/pssr-lifecycle-behavior.md) if lifecycle, status, phase, role, permission, lock, transition, or restricted-action behavior is involved
- [docs/pssr-lifecycle-schema.md](../../docs/pssr-lifecycle-schema.md) if Dataverse lifecycle fields, status, phase, choices, or mappings are involved
- [docs/ui-gallery-card-anatomy.md](../../docs/ui-gallery-card-anatomy.md) if cards or gallery UI are involved
- [docs/ui-pill-standard.md](../../docs/ui-pill-standard.md) if pills, badges, status indicators, or lifecycle labels are involved
- Any relevant `docs/*-process.md`

If the implemented change appears to be a major change, also inspect:

- [docs/security/threat-model/TM-template.md](../../docs/security/threat-model/TM-template.md)
- [docs/security/security-review/SR-template.md](../../docs/security/security-review/SR-template.md)

Inspect the changed files before making recommendations.

Treat the current source code and repo documentation set as authoritative project context.

Do not paste, quote, duplicate, or summarize the full content of any repo documentation file.

## Objective

Review already-implemented changes and determine whether any security, release-process, validation, or documentation follow-up is still required before the change should be considered complete.

Implemented change summary:

TBC (not provided)

## Required checks

Inspect the implemented changes and determine:

1. Whether the change classification is Bug Fix, Small Enhancement, New Feature, Documentation Update, Investigation Only, or Architecture Alignment.
2. Whether the change has Dataverse impact.
3. Whether the change has lifecycle, status, permission, or restricted-action impact.
4. Whether the change affects user-visible behavior, support guidance, or documented workflow.
5. Whether the change affects security, sensitive data handling, logging, dependency risk, or release evidence.
6. Whether the change is a major change under this repo's security rules.

If a detail cannot be confirmed from the request, repo docs, or source code, write:

`TBC (not confirmed from current codebase)`

## Post-change review instructions

### 1. Check code and documentation alignment

- confirm the implementation matches the current repo architecture and documentation ownership model
- identify any documentation that should have been updated but was not
- identify any documentation that was updated incorrectly or duplicates another owner document

### 2. Check security and release-process compliance

- confirm whether the change introduced any secrets, restricted data, unsafe logging, or insecure error handling
- confirm whether dependency changes were justified and whether security follow-up is required
- confirm whether the PR/release evidence required by [docs/security-release-process.md](../../docs/security-release-process.md) is satisfied
- confirm whether the cybersecurity expectations in [docs/cybersecurity-compliance.md](../../docs/cybersecurity-compliance.md) are met for this change

### 3. Check major-change artifact requirements

If the change introduces a new trust boundary, significant authorization change, significant sensitive-data handling change, or a new external integration:

- require a threat model under `docs/security/threat-model/`
- require a security review under `docs/security/security-review/`
- verify whether those artifacts exist already or still need to be created

If the change is not major, state:

`No major-change security artifacts required.`

### 4. Check validation completeness

Use only validation commands confirmed from the repo:

- `npm.cmd run lint`
- `npm.cmd run test`
- `npm.cmd run build`

Check whether the implemented change still needs:

- narrow behavior validation
- Dataverse reload/save validation
- lifecycle allowed/restricted validation
- desktop/mobile UI validation
- documentation accuracy validation

Do not invent commands.

### 5. Recommend the smallest follow-up

If follow-up is required, recommend only the smallest set of actions needed to close the gaps.

Do not propose unrelated refactors, architecture migration, or broad cleanup.

## Output requirements

Return the result in this order:

1. `Classification:` one value
2. `Findings:` ordered by severity with exact file paths when applicable
3. `Required follow-up:` concise action list
4. `Security/release check result:`
   - Secrets introduced? YES/NO/TBC
   - Dependency/security follow-up needed? YES/NO/TBC
   - Major change requiring threat model/security review? YES/NO/TBC
   - Documentation updates still required? YES/NO/TBC
   - Additional validation still required? YES/NO/TBC
5. `Validation status:` what was verified vs still missing

If no issues are found, say so explicitly and mention any residual risks or unverified areas.

## Constraints and anti-patterns to avoid

Do not:

- invent behavior that is not confirmed from the repo
- mark validation as complete unless it was actually run or evidenced
- require major-change artifacts for ordinary low-risk changes
- duplicate lifecycle, Dataverse, or UI documentation in the response
- recommend unrelated refactors while doing a post-change compliance check