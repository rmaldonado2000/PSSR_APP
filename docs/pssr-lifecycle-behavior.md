# PSSR Lifecycle Behavior

This document describes the lifecycle commands rendered in the current app, the guard conditions behind each command, and the lock matrix enforced by the app in this repo.

## Current implementation scope

- The React app renders lifecycle commands in the existing header/action areas and projects lifecycle status in the Plan Details summary rail.
- Lifecycle mutations are centralized in the client transition layer under `src/app/lifecycleTransitions.ts`.
- The app connects directly to Dataverse through the PAC Power Apps runtime used by this workspace.
- The lifecycle process is enforced by the app through those transition guards and UI locks.

## Plan Details header commands

Buttons appear only in the existing Plan Details header action row.

### Draft

- `Advance to Plan`
- Enabled only when:
  - the current user is the plan originator (`Created By`)
  - the plan has at least one checklist
  - the team includes a `PSSR_Lead`
  - the team includes a `PU_Lead`
- On success, the app writes two approval records:
  - `Draft / Originator / Completed`, with the current user in `Member` and comment `Advanced by originator.`
  - `Plan / PSSR-Lead / In Progress`, with `Member = null` and comment `Awaiting PSSR-Lead approval.`

### Plan

- `Approve`
- `Reject`
- Enabled only when:
  - the current user is the `PSSR_Lead` team member
  - a pending request row exists with all of the following values:
    - `Phase = Plan`
    - `Role = PSSR-Lead`
    - `Member = null`
    - status is non-terminal, which in the current Dataverse process means `In Progress`
    - `Comment = Awaiting PSSR-Lead approval.`
- The app does not use the latest arbitrary `Plan / PSSR-Lead` history row to enable these buttons. It targets the pending unassigned request row specifically.
  - After the latest `Plan / PSSR-Lead` approval becomes `Approved`, the app keeps the plan in the `Plan` phase, hides `Approve` and `Reject`, enables checklist question answering, and waits for the first successful question response save to move the plan to `Execution`.

### Execution

- `Advance to Approval`
- Enabled only when:
  - the current user is the `PSSR_Lead` team member
  - every checklist is `Completed`
  - every deficiency has an accepted category
  - every category `A` deficiency is `Closed`

### Approval

- `Approve`
- `Reject`
- Enabled only when:
  - the current user is the `PU_Lead` team member
  - the latest `Approval / PU_Lead` approval record is still in progress
  - every deficiency has an accepted category
  - every category `A` deficiency is `Closed`

### Completion

- `Final Sign Off`
- Enabled only when:
  - the current user is the `PSSR_Lead` team member
  - every deficiency is `Closed`
  - the latest `Completion / PSSR_Lead` approval record is still in progress

## Checklist Details header commands

The existing Checklist Details header action row now includes:

- `Complete`

Enabled only when:

- the checklist is not already `Completed`
- question answering is still enabled for the current plan/checklist state
- every question on the checklist has a response
- every question answered `No` has at least one linked deficiency

## Deficiency editor commands

The existing floating deficiency editor now includes:

- `Close`

Behavior:

- shown only when editing an existing deficiency that is not already closed
- disabled when the current phase makes the deficiency read-only
- opens a confirmation dialog that requires a closing comment
- on confirm, writes:
  - `crc07_status = Closed`
  - `crc07_closeoutcomment`
  - `crc07_closedon`
  - `crc07_Closed_By@odata.bind`

## Automatic transition

The app auto-transitions `Plan -> Execution` after the first successful question response save only when:

- the plan is currently in `Plan`
- the latest `Plan / PSSR_Lead` approval is `Approved`

On transition:

- plan phase becomes `Execution`
- the affected checklist becomes `In Progress` when it was previously `Not Started`

## Lifecycle rail projection

The Plan Details summary rail is a UI projection of the current plan phase plus approval-derived sub-status.

- The active step is still driven by the plan `stageCode`.
- Completed steps render with the completed check styling.
- When the plan remains in `Plan` and the latest `Plan / PSSR-Lead` approval is `Approved`, the `Plan` step renders as a green check with the accessible label `Plan approved`.
- That green check is a sub-status indicator only. It does not advance the active step to `Execution`.
- The app continues to show the plan as being in `Plan` until the existing `Plan -> Execution` transition runs on first answer save.

## Lock matrix

### Plan metadata

- Draft: editable
- Plan before approval: editable
- Plan after approval: locked
- Execution: locked
- Approval: locked
- Completion pending final sign off: locked
- Completion finalized: locked

Manual phase editing through the phase dropdown is disabled. Phase changes are command-driven only.

### Checklist structure

- Draft: editable
- Plan before approval: editable
- Plan after approval: locked
- Execution: locked
- Approval: locked
- Completion pending final sign off: locked
- Completion finalized: locked

### Team management

- Draft: editable
- Plan: editable
- Execution: editable
- Approval: locked
- Completion pending final sign off: locked
- Completion finalized: locked

### Question answering

- Draft: locked
- Plan before approval: locked
- Plan after approval: enabled
- Execution: enabled
- Approval: locked
- Completion pending final sign off: locked
- Completion finalized: locked

Checklist completion also locks question answering for that checklist.

### Deficiency creation

- only allowed from a checklist question answered `No`
- only allowed while the plan is in `Execution`
- disabled everywhere else

Because the rule is question-scoped, the existing plan-level `New Deficiency` entry point is disabled and directs users back to the question-level deficiency flow.

### Deficiency editing

- Execution: editable
- Approval: editable for existing deficiencies only
- Completion pending final sign off: editable for existing deficiencies only
- Completion finalized: locked
- Closed deficiency: always locked

Accepted category stays disabled until the deficiency status is `In Progress`.

## Warnings and failures

- Disabled lifecycle commands surface the unmet conditions through button hover text.
- The in-screen warning bar is reserved for plan-state blockers and does not repeat user-specific role permission messages.
- The warning bar does not show a blocker for the approved waiting state where the plan is still in `Plan`, the latest `Plan / PSSR-Lead` approval is `Approved`, and the app is waiting for the first answered checklist question.
- Transition failures surface through the app error path.
- The transition layer returns structured `{ success, errors, warnings, updatedIds }` results so UI messages can remain specific.

## Approval display

- Approval role, phase, and status labels should be read from the PSSR Approval table label columns when Dataverse returns them.
- Local enum metadata is only a fallback when the Dataverse label columns are unavailable in the current environment.
- `In Progress` is treated as any non-terminal approval state. Terminal approval states are `Approved`, `Rejected`, and `Completed`.