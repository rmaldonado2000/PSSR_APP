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
| Decision status | `crc07_status` |
| Decision date | `crc07_date` |
| Comment | `crc07_comment` |
| Actor lookup bind | `crc07_Member@odata.bind` |
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
| `null` | In Progress |

Note: the current approval role schema does not include an `Originator` choice. The implemented Draft completion record is stored as a Draft approval with status `Completed`, actor set to the originator, and a comment indicating the originator action.

Latest approval rule:

- Latest record for a phase/role pair = highest `modifiedon` descending.
- Approval history is append-only. Existing records are updated only when the state machine explicitly targets the latest matching record.

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