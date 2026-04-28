export function formatDate(value?: string): string {
  if (!value) {
    return 'N/A';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('en-CA');
}

export function truncate(value: string, max = 120): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}...`;
}

export function formatRoleLabel(roleLabel: string | undefined, fallback = 'Role unavailable'): string {
  const value = roleLabel?.trim();
  if (!value) {
    return fallback;
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b(PSSR|PU) Lead\b/g, '$1-Lead');
}
