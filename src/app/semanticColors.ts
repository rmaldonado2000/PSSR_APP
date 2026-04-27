import { tokens } from '@fluentui/react-components';

export type SemanticBadgeColor = 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';

export type SemanticTone = {
  chipColor: SemanticBadgeColor;
  accentColor: string;
  chipBackgroundColor: string;
  chipForegroundColor: string;
};

const toneByColor: Record<SemanticBadgeColor, SemanticTone> = {
  brand: {
    chipColor: 'brand',
    accentColor: tokens.colorBrandStroke1,
    chipBackgroundColor: tokens.colorBrandBackground2,
    chipForegroundColor: tokens.colorBrandForeground2,
  },
  danger: {
    chipColor: 'danger',
    accentColor: tokens.colorPaletteRedBorderActive,
    chipBackgroundColor: tokens.colorPaletteRedBackground2,
    chipForegroundColor: tokens.colorPaletteRedForeground2,
  },
  important: {
    chipColor: 'important',
    accentColor: tokens.colorPaletteBerryBorderActive,
    chipBackgroundColor: tokens.colorPaletteBerryBackground2,
    chipForegroundColor: tokens.colorPaletteBerryForeground2,
  },
  informative: {
    chipColor: 'informative',
    accentColor: tokens.colorPaletteBlueBorderActive,
    chipBackgroundColor: tokens.colorPaletteBlueBackground2,
    chipForegroundColor: tokens.colorPaletteBlueForeground2,
  },
  severe: {
    chipColor: 'severe',
    accentColor: tokens.colorPaletteRedBorderActive,
    chipBackgroundColor: tokens.colorPaletteRedBackground2,
    chipForegroundColor: tokens.colorPaletteRedForeground2,
  },
  subtle: {
    chipColor: 'subtle',
    accentColor: tokens.colorNeutralStrokeAccessible,
    chipBackgroundColor: tokens.colorNeutralBackground3,
    chipForegroundColor: tokens.colorNeutralForeground3,
  },
  success: {
    chipColor: 'success',
    accentColor: tokens.colorPaletteGreenBorderActive,
    chipBackgroundColor: tokens.colorPaletteGreenBackground2,
    chipForegroundColor: tokens.colorPaletteGreenForeground2,
  },
  warning: {
    chipColor: 'warning',
    accentColor: tokens.colorPaletteDarkOrangeBorderActive,
    chipBackgroundColor: tokens.colorPaletteDarkOrangeBackground2,
    chipForegroundColor: tokens.colorPaletteDarkOrangeForeground2,
  },
};

function normalizeLabel(label?: string): string {
  return (label ?? '').trim().toLowerCase();
}

function includesAny(label: string, fragments: string[]): boolean {
  return fragments.some((fragment) => label.includes(fragment));
}

function toneForPhaseOrStatus(label?: string): SemanticTone {
  const normalized = normalizeLabel(label);

  if (!normalized) {
    return toneByColor.subtle;
  }

  if (includesAny(normalized, ['reject', 'denied', 'declin', 'fail', 'overdue', 'blocked'])) {
    return toneByColor.danger;
  }

  if (includesAny(normalized, ['inactive', 'cancel', 'void', 'notstarted', 'not started', 'draft', 'new', 'initiation'])) {
    return toneByColor.subtle;
  }

  if (includesAny(normalized, ['approval', 'approved', 'review'])) {
    return toneByColor.success;
  }

  if (includesAny(normalized, ['completion', 'complete', 'completed', 'closed', 'resolved'])) {
    return toneByColor.informative;
  }

  if (includesAny(normalized, ['plan', 'planning'])) {
    return toneByColor.important;
  }

  if (includesAny(normalized, ['execution', 'progress', 'open', 'pending'])) {
    return toneByColor.warning;
  }

  if (includesAny(normalized, ['active'])) {
    return toneByColor.success;
  }

  return toneByColor.brand;
}

export function getPlanPhaseTone(phaseLabel?: string): SemanticTone {
  return toneForPhaseOrStatus(phaseLabel);
}

export function getChecklistStatusTone(statusLabel?: string): SemanticTone {
  return toneForPhaseOrStatus(statusLabel);
}

export function getDeficiencyStatusTone(statusLabel?: string): SemanticTone {
  return toneForPhaseOrStatus(statusLabel);
}

export function getApprovalDecisionTone(decisionLabel?: string): SemanticTone {
  return toneForPhaseOrStatus(decisionLabel);
}

export function getTemplateStatusTone(statusLabel?: string): SemanticTone {
  return toneForPhaseOrStatus(statusLabel);
}