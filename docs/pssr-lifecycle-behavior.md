# PSSR Lifecycle — Button Behavior & Locking Reference

This document describes exactly which buttons appear, when they are enabled,
what conditions they check, and what locking rules apply at each phase.

---

## 1. Plan Phase State Machine

```
Draft ──[Advance to Plan]──► Plan ──[Approve]──► Plan(approved) ──[first Q answer]──► Execution
  ▲                             │ [Reject]                                                │
  │                             └──────────────────────────────────► Draft ◄─────────────┘
  │                                                                                 [Reject]
  │                                                             Approval ◄──[Advance to Approval]
  │                                                               │ [Approve]
  │                                                               └──► Completed ──[Final Sign Off]──► LOCKED
  │                                                               │ [Reject]
  └───────────────────────────────────────────── Execution ◄──────┘
```

### Phase numeric codes (crc07_pssrstage)
- **Draft** = 507650000
- **Plan** = 507650001
- **Execution** = 507650002
- **Approval** = 507650003
- **Completion** = 507650004

---

## 2. Plan Details Screen — Phase Action Buttons

All lifecycle buttons appear in the **existing tab-actions area** of
`PlanDetailsScreen`. Buttons not relevant to the current phase/role are hidden.

---

### Button: "Advance to Plan"

| Property | Value |
|---|---|
| Visible when | `plan.phase === Draft` |
| Enabled when | All guard conditions pass |
| Who can click | Any user (Originator / plan creator) |

**Guard conditions (all must pass):**
1. Plan has ≥ 1 checklist
2. Team includes a member with role = PSSR_Lead
3. Team includes a member with role = PU_Lead

**On click:**
1. Set `Plan.Phase = Plan` (507650001)
2. Create Approval: Phase=Draft, Role=PSSR_Lead, Status=Completed (507650002)
3. Create Approval: Phase=Plan, Role=PSSR_Lead, Status=null (In Progress)

**If disabled:** Show warning listing each unmet condition.

---

### Button: "Approve" (Plan stage)

| Property | Value |
|---|---|
| Visible when | `plan.phase === Plan` |
| Enabled when | Current user's plan role = PSSR_Lead AND latest Plan/PSSR_Lead approval is In Progress |
| Who can click | Team member with role PSSR_Lead |

**On click:**
1. Update latest Approval (Phase=Plan, Role=PSSR_Lead) → Status=Approved (507650000)
2. Plan phase stays at Plan (auto-advances to Execution on first question answer)

---

### Button: "Reject" (Plan stage)

| Property | Value |
|---|---|
| Visible when | `plan.phase === Plan` |
| Enabled when | Same as Approve |
| Who can click | Team member with role PSSR_Lead |

**On click:**
1. Update latest Approval (Phase=Plan, Role=PSSR_Lead) → Status=Rejected (507650001)
2. Set `Plan.Phase = Draft` (507650000)

---

### Button: "Advance to Approval"

| Property | Value |
|---|---|
| Visible when | `plan.phase === Execution` |
| Enabled when | All guard conditions pass AND current user's plan role = PSSR_Lead |
| Who can click | Team member with role PSSR_Lead |

**Guard conditions (all must pass):**
1. All checklists have `Status = Completed` (507650002)
2. No deficiency has `AcceptedCategory` = null/blank
3. No deficiency with `AcceptedCategory = A` (507650000) has `Status ≠ Closed`

**On click:**
1. Set `Plan.Phase = Approval` (507650003)
2. Create Approval: Phase=Execution, Role=PSSR_Lead, Status=Completed (507650002)
3. Create Approval: Phase=Approval, Role=PU_Lead, Status=null (In Progress)

---

### Button: "Approve" (Approval stage)

| Property | Value |
|---|---|
| Visible when | `plan.phase === Approval` |
| Enabled when | Current user's plan role = PU_Lead AND latest Approval/PU_Lead approval is In Progress |
| Who can click | Team member with role PU_Lead |

**On click:**
1. Update latest Approval (Phase=Approval, Role=PU_Lead) → Status=Approved (507650000)
2. Set `Plan.Phase = Completion` (507650004)
3. Create Approval: Phase=Completion, Role=PSSR_Lead, Status=null (In Progress)

---

### Button: "Reject" (Approval stage)

| Property | Value |
|---|---|
| Visible when | `plan.phase === Approval` |
| Enabled when | Same as Approve (Approval stage) |
| Who can click | Team member with role PU_Lead |

**On click:**
1. Update latest Approval (Phase=Approval, Role=PU_Lead) → Status=Rejected (507650001)
2. Set `Plan.Phase = Execution` (507650002)
3. Create Approval: Phase=Execution, Role=PSSR_Lead, Status=null (In Progress)

---

### Button: "Final Sign Off"

| Property | Value |
|---|---|
| Visible when | `plan.phase === Completion` AND NOT fully locked |
| Enabled when | Current user's plan role = PSSR_Lead AND all deficiencies Closed |
| Who can click | Team member with role PSSR_Lead |

**After Final Sign Off: plan is permanently locked. No reopen/override path.**

**On click:**
1. Update latest Approval (Phase=Completion, Role=PSSR_Lead) → Status=Completed (507650002)
2. Plan enters fully-locked state

---

## 3. Automatic Transition: Plan (Approved) → Execution

This transition is triggered **automatically by the client** when the first
question answer is successfully saved while `plan.phase === Plan` and the
latest Plan/PSSR_Lead approval has `Status = Approved`.

**Steps triggered after successful question-response save:**
1. Set `Plan.Phase = Execution` (507650002)
2. Set `Checklist.Status = InProgress` (507650001) for the checklist that
   received the answer — but only if the checklist was `NotStarted` (507650000)

---

## 4. Checklist Details Screen — "Complete" Button

| Property | Value |
|---|---|
| Visible when | Checklist is NOT yet Completed |
| Enabled when | All guard conditions pass |
| Location | Existing tab-actions area of ChecklistDetailsScreen |

**Guard conditions (all must pass):**
1. All questions on the checklist have a response (Yes/No/NA)
2. Every question answered "No" has at least 1 linked Deficiency

**On click:**
1. Set `Checklist.Status = Completed` (507650002)
2. All question answers on this checklist become read-only

---

## 5. Deficiency Editor — "Close" Button

| Property | Value |
|---|---|
| Visible when | Deficiency `Status ≠ Closed` |
| Enabled when | `closingComment` field is not empty (in the confirmation dialog) |
| Location | Action row of the floating deficiency editor |

**On click:** Opens a confirmation dialog that requires a **Closing Comment**.

**On confirm:**
1. Set `Deficiency.Status = Closed` (507650002)
2. Set `Deficiency.ClosedOn = now()`
3. Set `Deficiency.ClosedBy = current user system ID`
4. Set `Deficiency.CloseoutComment = entered closing comment`
5. Lock deficiency record entirely (no further edits)

---

## 6. Phase / Status Locking Matrix

### Plan metadata (name, event, site, system)
| Phase | Editable? |
|---|---|
| Draft | ✅ Yes |
| Plan (pending) | ❌ No |
| Plan (approved) | ❌ No |
| Execution | ❌ No |
| Approval | ❌ No |
| Completion (pending) | ❌ No |
| Completion (finalized) | ❌ No |

### Checklist structure (add / remove checklists)
| Phase | Editable? |
|---|---|
| Draft | ✅ Yes |
| Plan (pending) | ✅ Yes |
| Plan (approved) | ❌ No |
| Execution | ❌ No |
| Approval | ❌ No |
| Completion (pending) | ❌ No |
| Completion (finalized) | ❌ No |

### Question answering (Yes/No/NA)
| Phase | Enabled? |
|---|---|
| Draft | ❌ No |
| Plan (pending) | ❌ No |
| Plan (approved) | ✅ Yes |
| Execution | ✅ Yes |
| Approval | ❌ No |
| Completion (pending) | ❌ No |
| Completion (finalized) | ❌ No |

> When the checklist status is `Completed`, question answers are also read-only.

### Deficiency creation (new deficiency)
| Phase | Allowed? |
|---|---|
| Draft | ❌ No |
| Plan (pending/approved) | ❌ No |
| Execution | ✅ Yes (only for questions answered "No") |
| Approval | ❌ No |
| Completion (pending) | ❌ No |
| Completion (finalized) | ❌ No |

### Deficiency editing (update status, category, comments)
| Phase | Allowed? |
|---|---|
| Draft | ❌ No |
| Plan (pending/approved) | ❌ No |
| Execution | ✅ Yes |
| Approval | ✅ Yes (existing deficiencies only) |
| Completion (pending) | ✅ Yes (existing deficiencies only) |
| Completion (finalized) | ❌ No |

> Once `Deficiency.Status = Closed`, the record is fully locked regardless of plan phase.

### Team member management
| Phase | Allowed? |
|---|---|
| Draft | ✅ Yes |
| Plan (pending/approved) | ✅ Yes |
| Execution | ✅ Yes |
| Approval | ❌ No |
| Completion (pending) | ❌ No |
| Completion (finalized) | ❌ No |

---

## 7. Warning / Error Display

- If a lifecycle button is **disabled** due to unmet guard conditions, a tooltip
  and/or warning banner lists each unmet condition.
- If an API call **fails**, the error message is displayed in the existing
  warning banner (the `error` state in App.tsx).
- On **concurrency conflict** (Dataverse returns HTTP 412): display a message
  asking the user to refresh and retry.

---

## 8. Idempotency Rules

| Action | Guard prevents re-execution |
|---|---|
| Advance to Plan | Blocked if `plan.phase !== Draft` |
| Approve Plan | Blocked if latest Plan/PSSR_Lead approval status is not null |
| Advance to Approval | Blocked if `plan.phase !== Execution` |
| Approve Approval | Blocked if latest Approval/PU_Lead approval status is not null |
| Final Sign Off | Blocked if plan is already fully locked |
| Complete Checklist | Blocked if checklist already Completed |
| Close Deficiency | Blocked if deficiency already Closed |

---

## 9. Concurrency Safety

All Dataverse write calls go through `withMutationRetry` (max 3 attempts with
exponential back-off). On unrecoverable conflict the UI displays the error and
prompts the user to refresh and retry manually.
