# UI Gallery Card Anatomy

This document defines the shared gallery card structure used across the PSSR code app.

## Standard Anatomy

All gallery cards use the same base anatomy:

1. Header row
   - Left: primary title text
   - Right: pill stack aligned to the top-right
2. Progress row
   - Present only for galleries with progress
   - Always directly below the header row
3. Metadata rows
   - Label/value rows rendered with the shared card metadata row component
4. Footer row
   - Uses the shared date component
   - Defaults to `Created On`

## Pill Rules

- Pills stay in the header row.
- Status pills use `kind="status"` and never render icons.
- Phase pills use `kind="phase"` and keep their existing icons.
- Team role, PSSR Type, Discipline, location pills use `kind="neutral"` and keep their existing icons.
- The pill stack wraps when more than two pills are present while staying right-aligned.

## Gallery Rules

### Main Plan Gallery

- Server-side ordering: `createdon desc`
- Title: `{PlanId} - {PlanName}`
- Pills: PSSR Phase, PSSR Type, Location
- Progress row: checklist completion bar and count
- Metadata order:
  - Event
  - System
- Footer: Created On

### Checklist Child Gallery

- Server-side ordering: `ChecklistID asc'
- Title: `{ChecklistId} - {ChecklistName}`
- Pills: Status, Discipline
- Progress row: question completion bar and count
- Footer: Created On

### Deficiency Child Gallery

- Server-side ordering: `modifiedon' desc
- Title: `{DeficiencyId} - {DeficiencyName}`
- Pills: Status
- Metadata order:
  - Initial Cat
  - Accepted Cat
  - General Comment
  - Closing Comment
- Desktop comments clamp to two lines with ellipsis
- Mobile comments wrap without horizontal scroll
- Footer: Created On

### Approvals Child Gallery

- Server-side ordering: Member Name
- Title: Member name
- Pills: Phase, Status
- Metadata order:
  - Role
  - Approved
  - Comment
- Footer: Modified On

### Team Child Gallery

- Title: full name
- Pills: role
- Metadata order:
  - Email
  - Phone Number
- Footer: Created On when available

### Questions Child Gallery Exception

- Questions do not use the shared gallery card anatomy changes in this pass.
- Only the mobile overflow behavior is adjusted.
- Applied mobile rules:
  - outer containers use `overflow-x: hidden`
  - rows and content use `min-width: 0`
  - long strings use `overflow-wrap: anywhere` and `word-break: break-word`
  - action area collapses to a single-column stack at the mobile breakpoint

## Schema Notes

- Plan ID: `crc07_planid`
- Plan name: `crc07_name`
- Checklist ID: `crc07_checklistid`
- Checklist name: `crc07_checklistname`
- Deficiency ID: `crc07_deficiencyid`
- Deficiency name: `crc07_deficiencyname`
- Approval approved date: `crc07_date`
- Approval member display name: `crc07_membername`
- Team email and phone are resolved from the related `systemusers` record