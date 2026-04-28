# UI Pill Standard

This document is the single source of truth for pills, badges, and card accents in the PSSR Code App.

## Base Pill Spec

- Height: 24px
- Border radius: 999px
- Padding: 0 10px
- Border: 1px solid
- Font size: 12px
- Font weight: 600
- Line height: 24px
- Text: single line with ellipsis truncation

## Icon Rules

- Status pills never render icons
- Phase, location, type, and other metadata pills may render the existing icon choices
- Icon size: 12px by 12px
- Icon gap: 6px
- Icons are vertically centered with text

## Kinds And Variants

- `status`: filled semantic pill
- `phase`: outlined semantic pill
- `neutral`: outlined neutral pill

Unknown values always fall back to the neutral outlined style.

## Color Mapping

### Status

Filled pills with no icons.

| Value | Background | Border | Text |
| --- | --- | --- | --- |
| Draft | `#F3F2F1` | `#C8C6C4` | `#605E5C` |
| Not Started | `#F3F2F1` | `#C8C6C4` | `#605E5C` |
| In Progress | `#E8F1FF` | `#8AB4F8` | `#0F3D7A` |
| Approved | `#E7F6EC` | `#7FD19B` | `#0B6A2B` |
| Rejected | `#FDE7E9` | `#F1AEB5` | `#A4262C` |
| Completed | `#E6F7F5` | `#76D6CF` | `#0B6E69` |
| Closed | `#EEF2F6` | `#A0AEC0` | `#2D3748` |

Status aliases are canonicalized before rendering. Compact values such as `InProgress` render as `In Progress`, and `Not Started` uses the same neutral visual treatment as `Draft`.

### Phase

Outlined pills with background fixed to `#FFFFFF`.

| Value | Border | Text |
| --- | --- | --- |
| Draft | `#C8C6C4` | `#605E5C` |
| Plan | `#C4A2F7` | `#5C2D91` |
| Execution | `#8AB4F8` | `#0F3D7A` |
| Approval | `#76D6CF` | `#0B6E69` |
| Completion | `#B4A7F6` | `#3B2E83` |

### Neutral

Outlined pills used for location, PSSR type, counts, and other metadata.

| Background | Border | Text |
| --- | --- | --- |
| `#FFFFFF` | `#C8C6C4` | `#323130` |

## Token Source

- Pill tokens live in `src/ui/tokens/pillTokens.ts`
- Use `getPillStyle(kind, value)` for pill rendering
- Use `getAccentColor(kind, value)` for card accent rendering

## Component Usage

```tsx
<Pill kind="status" value={statusLabel} />
```

```tsx
<Pill kind="phase" value={phaseLabel} icon={existingPhaseIcon} />
```

```tsx
<Pill kind="neutral" value={locationLabel} icon={existingLocationIcon} />
```

## Card Accent Usage

Gallery and list card accents must use the same token source as pills.

```ts
getAccentColor(kind, value)
```

Use `getCardAccentStyle(kind, value)` or `RowCard` with `accentKind` and `accentValue` to keep accent behavior aligned with pill semantics.