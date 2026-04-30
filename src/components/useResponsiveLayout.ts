import { useEffect, useState } from 'react';

export const APP_NARROW_LAYOUT_QUERY = '(max-width: 700px)';

function matchesQuery(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

export function useResponsiveLayout(query: string = APP_NARROW_LAYOUT_QUERY): { isNarrow: boolean } {
  const [isNarrow, setIsNarrow] = useState<boolean>(() => matchesQuery(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const onChange = () => {
      setIsNarrow(mediaQuery.matches);
    };

    onChange();
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, [query]);

  return { isNarrow };
}