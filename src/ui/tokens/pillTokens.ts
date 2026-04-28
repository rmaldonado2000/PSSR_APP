export type PillKind = 'status' | 'phase' | 'neutral';

export type PillVariant = 'filled' | 'outlined';

export type PillStyle = {
  variant: PillVariant;
  bg: string;
  border: string;
  text: string;
};

const NEUTRAL_OUTLINED: PillStyle = {
  variant: 'outlined',
  bg: '#FFFFFF',
  border: '#C8C6C4',
  text: '#323130',
};

const STATUS_STYLES: Record<string, PillStyle> = {
  draft: {
    variant: 'filled',
    bg: '#F3F2F1',
    border: '#C8C6C4',
    text: '#605E5C',
  },
  'not started': {
    variant: 'filled',
    bg: '#F3F2F1',
    border: '#C8C6C4',
    text: '#605E5C',
  },
  'in progress': {
    variant: 'filled',
    bg: '#E8F1FF',
    border: '#8AB4F8',
    text: '#0F3D7A',
  },
  approved: {
    variant: 'filled',
    bg: '#E7F6EC',
    border: '#7FD19B',
    text: '#0B6A2B',
  },
  rejected: {
    variant: 'filled',
    bg: '#FDE7E9',
    border: '#F1AEB5',
    text: '#A4262C',
  },
  completed: {
    variant: 'filled',
    bg: '#E6F7F5',
    border: '#76D6CF',
    text: '#0B6E69',
  },
  closed: {
    variant: 'filled',
    bg: '#EEF2F6',
    border: '#A0AEC0',
    text: '#2D3748',
  },
};

const PHASE_STYLES: Record<string, PillStyle> = {
  draft: {
    variant: 'outlined',
    bg: '#FFFFFF',
    border: '#C8C6C4',
    text: '#605E5C',
  },
  plan: {
    variant: 'outlined',
    bg: '#FFFFFF',
    border: '#C4A2F7',
    text: '#5C2D91',
  },
  execution: {
    variant: 'outlined',
    bg: '#FFFFFF',
    border: '#8AB4F8',
    text: '#0F3D7A',
  },
  approval: {
    variant: 'outlined',
    bg: '#FFFFFF',
    border: '#76D6CF',
    text: '#0B6E69',
  },
  completion: {
    variant: 'outlined',
    bg: '#FFFFFF',
    border: '#B4A7F6',
    text: '#3B2E83',
  },
};

function normalizeValue(value: string | undefined): string {
  return (value ?? '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\s_-]+/g, ' ')
    .toLowerCase();
}

function getStyleMap(kind: PillKind): Record<string, PillStyle> | undefined {
  if (kind === 'status') {
    return STATUS_STYLES;
  }

  if (kind === 'phase') {
    return PHASE_STYLES;
  }

  return undefined;
}

export function getPillStyle(kind: PillKind, value: string): PillStyle {
  const normalizedValue = normalizeValue(value);
  const styleMap = getStyleMap(kind);

  if (!styleMap) {
    return NEUTRAL_OUTLINED;
  }

  return styleMap[normalizedValue] ?? NEUTRAL_OUTLINED;
}

export function getAccentColor(kind: PillKind, value: string): string {
  return getPillStyle(kind, value).border;
}