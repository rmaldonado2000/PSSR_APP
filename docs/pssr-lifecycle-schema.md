# PSSR Lifecycle — Dataverse Schema Reference

All table names, column logical names, and option-set numeric values used by
the lifecycle state machine. **Do not guess or invent values — all entries
below were verified from the generated model files in `src/generated/models/`.**

---

## Tables

| Friendly name | Dataverse logical name |
|---|---|
| PSSR Plan | `crc07_pssr_plans` |
| PSSR Checklist | `crc07_pssr_checklists` |
| PSSR Checklist Question | `crc07_pssr_checklist_questions` |
| PSSR Deficiency | `crc07_pssr_deficiencies` |
| PSSR Approval | `crc07_pssr_approvals` |
| PSSR Team Member | `crc07_pssr_team_members` |
| System User | `systemusers` |

---

## PSSR Plan — `crc07_pssr_plans`

### Primary key
`crc07_pssr_planid` (GUID)

### User-visible autonumber
`crc07_planid`

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_pssrstage` | Option Set | Current lifecycle phase |
| `crc07_name` | Text | Plan name |
| `crc07_event` | Text | Event |
| `crc07_site` | Option Set | Site |
| `crc07_system` | Text | System |

### Option Set — `crc07_pssrstage` (Plan Phase)

| Numeric value | Label |
|---|---|
| `507650000` | Draft |
| `507650001` | Plan |
| `507650002` | Execution |
| `507650003` | Approval |
| `507650004` | Completion |

> **Default on create:** `507650000` (Draft)

---

## PSSR Checklist — `crc07_pssr_checklists`

### Primary key
`crc07_pssr_checklistid` (GUID)

### User-visible autonumber
`crc07_checklistid`

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_status` | Option Set | Checklist completion state |
| `crc07_checklistname` | Text | Name |
| `crc07_discipline` | Option Set | Discipline |
| `_crc07_relatedplan_value` | Lookup | Parent PSSR Plan |

### Option Set — `crc07_status` (Checklist Status)

| Numeric value | Label |
|---|---|
| `507650000` | NotStarted |
| `507650001` | InProgress |
| `507650002` | Completed |

---

## PSSR Checklist Question — `crc07_pssr_checklist_questions`

### Primary key
`crc07_pssr_checklist_questionid` (GUID)

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_response` | Option Set | Answer (Yes / No / N/A) |
| `crc07_questiontext` | Text | Question text |
| `crc07_ismandatory` | Boolean | Mandatory flag |
| `crc07_sequenceorder` | Integer | Display order |
| `_crc07_relatedchecklist_value` | Lookup | Parent checklist |

### Option Set — `crc07_response` (Question Response)

| Numeric value | Label |
|---|---|
| `507650000` | Yes |
| `507650001` | No |
| `507650002` | NA |

> **null / undefined** = unanswered (question not yet responded to)

---

## PSSR Deficiency — `crc07_pssr_deficiencies`

### Primary key
`crc07_pssr_deficiencyid` (GUID)

### User-visible autonumber
`crc07_deficiencyid`

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_status` | Option Set | Deficiency lifecycle status |
| `crc07_initialcategory` | Option Set | Initial category (A/B/C) |
| `crc07_acceptedcategory` | Option Set | Accepted category (A/B/C); **null on create** |
| `crc07_deficiencyname` | Text | Description |
| `crc07_generalcomment` | Text | General / progress comment |
| `crc07_closeoutcomment` | Text | Closing comment (required to close) |
| `crc07_closedon` | DateTime | Timestamp when closed |
| `crc07_Closed_By@odata.bind` | Lookup bind | System user who closed it |
| `_crc07_relatedplan_value` | Lookup | Parent PSSR Plan |
| `_crc07_relatedchecklist_value` | Lookup | Parent Checklist |
| `_crc07_relatedquestion_value` | Lookup | Source Question |

### Option Set — `crc07_status` (Deficiency Status)

| Numeric value | Label |
|---|---|
| `507650000` | Open |
| `507650001` | InProgress |
| `507650002` | Closed |

### Option Set — `crc07_initialcategory` / `crc07_acceptedcategory` (Category)

| Numeric value | Label |
|---|---|
| `507650000` | A |
| `507650001` | B |
| `507650002` | C |

> **Accepted Category** must be **null** on creation; only editable when Status = InProgress.  
> Category-A deficiencies must be Closed before advancing to Approval stage.

---

## PSSR Approval — `crc07_pssr_approvals`

### Primary key
`crc07_pssr_approvalid` (GUID)

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_pssrstage` | Option Set | The plan stage this record belongs to |
| `crc07_role` | Option Set | Role of the approver |
| `crc07_status` | Option Set | Decision status; **null = "In Progress"** |
| `crc07_date` | DateTime | Decision date |
| `crc07_comment` | Text | Comment |
| `crc07_Member@odata.bind` | Lookup bind | System user (member) |
| `_crc07_relatedplan_value` | Lookup | Parent PSSR Plan |

### Option Set — `crc07_pssrstage` (Approval Stage)

| Numeric value | Label |
|---|---|
| `507650000` | Draft |
| `507650001` | Plan |
| `507650002` | Execution |
| `507650003` | Approval |
| `507650004` | Completion |

### Option Set — `crc07_role` (Approval Role)

| Numeric value | Label |
|---|---|
| `507650000` | PSSR_Lead |
| `507650001` | PU_Lead |
| `507650002` | Mechanical_Engineer |
| `507650003` | Instrumentation_Engineer |
| `507650004` | Process_Engineer |
| `507650005` | Operations_Coordinator |
| `507650006` | Maintenance_Coordinator |
| `507650007` | Execution_Coordinator |
| `507650008` | SiteAdmin |
| `507650009` | EnterpriseAdmin |

### Option Set — `crc07_status` (Approval Decision)

| Numeric value | Label |
|---|---|
| `507650000` | Approved |
| `507650001` | Rejected |
| `507650002` | Completed |
| *(null / undefined)* | **In Progress** (awaiting decision) |

> **Approval history is append-only.** Records are never deleted. "Latest" record
> for a given Stage/Role combination = first result when sorted by `modifiedon desc`.

---

## PSSR Team Member — `crc07_pssr_team_members`

### Primary key
`crc07_pssr_team_memberid` (GUID)

### Columns used by lifecycle

| Logical name | Type | Purpose |
|---|---|---|
| `crc07_roles` | Option Set | Member's role on the plan |
| `crc07_name` | Text | Member display name |
| `_crc07_member_value` | Lookup | Linked System User GUID |
| `_crc07_relatedplan_value` | Lookup | Parent PSSR Plan |

### Option Set — `crc07_roles` (Team Role)

| Numeric value | Label |
|---|---|
| `507650000` | PSSR_Lead |
| `507650001` | PU_Lead |
| `507650002` | Mechanical_Engineer |
| `507650003` | Instrumentation_Engineer |
| `507650004` | Process_Engineer |
| `507650005` | Operations_Coordinator |
| `507650006` | Maintenance_Coordinator |
| `507650007` | Execution_Coordinator |
| `507650008` | SiteAdmin |
| `507650009` | EnterpriseAdmin |

---

## Approval records created per transition

| Trigger | Records created |
|---|---|
| **Advance to Plan** (Draft → Plan) | (1) Phase=Draft, Role=PSSR_Lead, Status=Completed; (2) Phase=Plan, Role=PSSR_Lead, Status=*null (In Progress)* |
| **Approve Plan Stage** | Update latest Phase=Plan/PSSR_Lead record → Status=Approved |
| **Reject Plan Stage** | Update latest Phase=Plan/PSSR_Lead record → Status=Rejected |
| **Advance to Approval** (Execution → Approval) | (1) Phase=Execution, Role=PSSR_Lead, Status=Completed; (2) Phase=Approval, Role=PU_Lead, Status=*null (In Progress)* |
| **Approve Approval Stage** | Update latest Phase=Approval/PU_Lead record → Status=Approved; create Phase=Completion, Role=PSSR_Lead, Status=*null (In Progress)* |
| **Reject Approval Stage** | Update latest Phase=Approval/PU_Lead record → Status=Rejected; create Phase=Execution, Role=PSSR_Lead, Status=*null (In Progress)* |
| **Final Sign Off** | Update latest Phase=Completion/PSSR_Lead record → Status=Completed |

---

## "Latest" approval resolution

> Sort matching approvals (same Stage + Role) by `modifiedon` **descending**.  
> The first result is the "latest" for any transition that requires updating an existing record.

---

## System User — `systemusers` (used for current-user lookup only)

| Column | Purpose |
|---|---|
| `systemuserid` | GUID — matched against `_crc07_member_value` in team members |
| `fullname` | Display name |
| `internalemailaddress` | UPN for matching |
| `azureactivedirectoryobjectid` | AAD object ID for matching |
| `crc07_role` | Global app role (informational) |
| `crc07_site` | Global site (informational) |
