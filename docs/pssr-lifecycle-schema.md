# PSSR Lifecycle Schema

This document lists the exact Dataverse tables, logical names, and option values verified from the generated models and `.power` schema metadata in this repo.

## Tables

| Functional area | Table logical name |
| --- | --- |
| Plan | `crc07_pssr_plans` |
| Checklist | `crc07_pssr_checklists` |
| Checklist Question | `crc07_pssr_checklist_questions` |
| Deficiency | `crc07_pssr_deficiencies` |
| Approval History | `crc07_pssr_approvals` |
| Team Membership | `crc07_pssr_team_members` |
| Current User lookup | `systemusers` |

## Plan

Primary key: `crc07_pssr_planid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Phase | `crc07_pssrstage` |
| Name | `crc07_name` |
| Event | `crc07_event` |
| Site | `crc07_site` |
| System | `crc07_system` |
| Created By lookup | `_createdby_value` |

Plan phase option set `crc07_pssrstage`:

| Value | Label |
| --- | --- |
| `507650000` | Draft |
| `507650001` | Plan |
| `507650002` | Execution |
| `507650003` | Approval |
| `507650004` | Completion |

Note: the current schema does not have a separate `Completed` plan phase choice. The post-approval pending-final-sign-off state and the finalized state are both represented with `crc07_pssrstage = Completion`, and finalization is inferred from the latest Completion/PSSR-Lead approval record.

Derived plan lifecycle state used by the app:

- `Plan approved but still in Plan` is represented by `crc07_pssrstage = Plan` plus the latest `Plan / PSSR-Lead` approval row having decision status `Approved`.
- `Execution` does not begin at approval time. The app advances the plan to `Execution` only after the first successful checklist question response save.
- `Completion finalized` is represented by `crc07_pssrstage = Completion` plus the latest `Completion / PSSR-Lead` approval row having decision status `Completed`.

## Checklist

Primary key: `crc07_pssr_checklistid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Status | `crc07_status` |
| Name | `crc07_checklistname` |
| Discipline | `crc07_discipline` |
| Parent Plan lookup | `_crc07_relatedplan_value` |

Checklist status option set `crc07_status`:

| Value | Label |
| --- | --- |
| `507650000` | Not Started |
| `507650001` | In Progress |
| `507650002` | Completed |

## Checklist Question

Primary key: `crc07_pssr_checklist_questionid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Response | `crc07_response` |
| Question text | `crc07_questiontext` |
| Required | `crc07_ismandatory` |
| Sequence | `crc07_sequenceorder` |
| Parent Checklist lookup | `_crc07_relatedchecklist_value` |

Question response option set `crc07_response`:

| Value | Label |
| --- | --- |
| `507650000` | Yes |
| `507650001` | No |
| `507650002` | NA |

## Deficiency

Primary key: `crc07_pssr_deficiencyid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Status | `crc07_status` |
| Initial Category | `crc07_initialcategory` |
| Accepted Category | `crc07_acceptedcategory` |
| Description | `crc07_deficiencyname` |
| General Comment | `crc07_generalcomment` |
| Closing Comment | `crc07_closeoutcomment` |
| Closed On | `crc07_closedon` |
| Closed By lookup bind | `crc07_Closed_By@odata.bind` |
| Closed By lookup value | `_crc07_closed_by_value` |
| Parent Plan lookup | `_crc07_relatedplan_value` |
| Parent Checklist lookup | `_crc07_relatedchecklist_value` |
| Parent Question lookup | `_crc07_relatedquestion_value` |

Deficiency status option set `crc07_status`:

| Value | Label |
| --- | --- |
| `507650000` | Open |
| `507650001` | InProgress |
| `507650002` | Closed |

Deficiency category option sets `crc07_initialcategory` and `crc07_acceptedcategory`:

| Value | Label |
| --- | --- |
| `507650000` | A |
| `507650001` | B |
| `507650002` | C |

## Approval History

Primary key: `crc07_pssr_approvalid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Lifecycle phase | `crc07_pssrstage` |
| Role | `crc07_role` |
| Role label | `crc07_rolename` |
| Decision status | `crc07_status` |
| Decision status label | `crc07_statusname` |
| Decision date | `crc07_date` |
| Comment | `crc07_comment` |
| Actor lookup bind | `crc07_Member@odata.bind` |
| Actor lookup value | `_crc07_member_value` |
| Parent Plan lookup | `_crc07_relatedplan_value` |
| Modified On | `modifiedon` |

Approval phase option set `crc07_pssrstage`:

| Value | Label |
| --- | --- |
| `507650000` | Draft |
| `507650001` | Plan |
| `507650002` | Execution |
| `507650003` | Approval |
| `507650004` | Completion |

Approval role option set `crc07_role`:

| Value | Label |
| --- | --- |
| `507650000` | PSSR - Lead |
| `507650001` | PU - Lead |
| `507650002` | Mechanical - Engineer |
| `507650003` | Instrumentation - Engineer |
| `507650004` | Process - Engineer |
| `507650005` | Operations - Coordinator |
| `507650006` | Maintenance - Coordinator |
| `507650007` | Execution  - Coordinator |
| `507650008` | Site Admin |
| `507650009` | Enterprise Admin |

Approval status option set `crc07_status`:

| Value | Label |
| --- | --- |
| `507650000` | Approved |
| `507650001` | Rejected |
| `507650002` | Completed |
| non-terminal current value in Dataverse | In Progress |

Approval label handling:

- The app should prefer `crc07_rolename`, `crc07_pssrstagename`, and `crc07_statusname` from the PSSR Approval table when Dataverse returns them.
- Generated local enum metadata can lag behind Dataverse option-set changes, so it is only a fallback label source.
- This matters for new approval choices such as `Originator`.

Latest approval rule:

- Latest record for a phase/role pair = highest `modifiedon` descending.
- Approval history is append-only. Existing records are updated only when the state machine explicitly targets the latest matching record.

Pending Plan approval request rule:

- The actionable Plan approval request is not just the latest `Plan / PSSR-Lead` row.
- The app treats the pending request row as the approval authority only when all of the following are true:
	- `crc07_pssrstage = Plan`
	- `crc07_role = PSSR-Lead`
	- `_crc07_member_value` is empty
	- the approval status is non-terminal (`In Progress` in the current process)
	- `crc07_comment = Awaiting PSSR-Lead approval.`

Approved Plan waiting-state rule:

- After the latest `Plan / PSSR-Lead` approval row is updated to `Approved`, the app no longer expects an in-progress Plan approval request row for UI command state.
- In that state, the plan remains at `crc07_pssrstage = Plan`, checklist question answering becomes eligible, and the app waits for first answer save to perform the `Plan -> Execution` transition.
- The Plan Details lifecycle rail renders this derived state as a green approved check on the `Plan` node while keeping `Plan` as the active phase.

Draft-to-Plan approval records:

- When Draft advances to Plan, the app creates:
	- a `Draft / Originator / Completed` approval row bound to the acting user with comment `Advanced by originator.`
	- a `Plan / PSSR-Lead / In Progress` request row with no member assigned and comment `Awaiting PSSR-Lead approval.`

## Team Membership

Primary key: `crc07_pssr_team_memberid`

Lifecycle columns:

| Meaning | Logical name |
| --- | --- |
| Role | `crc07_roles` |
| Member name | `crc07_name` |
| Member lookup value | `_crc07_member_value` |
| Parent Plan lookup | `_crc07_relatedplan_value` |

Team role option set `crc07_roles`:

| Value | Label |
| --- | --- |
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

Note: the current team role schema does not include an `Originator` option. The current implementation resolves the originator from the plan `Created By` lookup.

## Current user lookup

Table: `systemusers`

Columns used:

| Meaning | Logical name |
| --- | --- |
| System user id | `systemuserid` |
| Full name | `fullname` |
| UPN/email | `internalemailaddress` |
| AAD object id | `azureactivedirectoryobjectid` |
| Global role | `crc07_role` |
| Global site | `crc07_site` |