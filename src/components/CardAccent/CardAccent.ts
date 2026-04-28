import { getAccentColor, type PillKind } from '../../ui/tokens/pillTokens';

export function getCardAccentStyle(kind: PillKind, value: string) {
  return {
    borderLeftColor: getAccentColor(kind, value),
  };
}

export function getCardAccentColor(kind: PillKind, value: string): string {
  return getAccentColor(kind, value);
}