import { getAccentColor, getPillStyle, type PillKind } from '../ui/tokens/pillTokens';

export type SemanticBadgeColor = 'subtle';

export type SemanticTone = {
  chipColor: SemanticBadgeColor;
  accentColor: string;
  chipBackgroundColor: string;
  chipForegroundColor: string;
};

function toSemanticTone(kind: PillKind, value?: string): SemanticTone {
  const pillStyle = getPillStyle(kind, value ?? '');

  return {
    chipColor: 'subtle',
    accentColor: getAccentColor(kind, value ?? ''),
    chipBackgroundColor: pillStyle.bg,
    chipForegroundColor: pillStyle.text,
  };
}

export function getPlanPhaseTone(phaseLabel?: string): SemanticTone {
  return toSemanticTone('phase', phaseLabel);
}

export function getChecklistStatusTone(statusLabel?: string): SemanticTone {
  return toSemanticTone('status', statusLabel);
}

export function getDeficiencyStatusTone(statusLabel?: string): SemanticTone {
  return toSemanticTone('status', statusLabel);
}

export function getApprovalDecisionTone(decisionLabel?: string): SemanticTone {
  return toSemanticTone('status', decisionLabel);
}

export function getTemplateStatusTone(statusLabel?: string): SemanticTone {
  return toSemanticTone('status', statusLabel);
}