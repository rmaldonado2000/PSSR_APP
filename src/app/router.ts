import type { AppView } from './types';

export type PlanDetailsTab = 'details' | 'checklists' | 'deficiencies' | 'approvals' | 'team';
export type ChecklistDetailsTab = 'questions' | 'details' | 'deficiencies';
export type AppRouteTab = PlanDetailsTab | ChecklistDetailsTab;

export interface RouteState {
  view: AppView;
  planId?: string;
  checklistId?: string;
  tab?: AppRouteTab;
}

function parseQuery(queryText: string): Record<string, string> {
  const params = new URLSearchParams(queryText);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function parseHashRoute(hash: string = window.location.hash): RouteState {
  const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
  const [pathText, queryText] = normalized.split('?');
  const path = pathText || '/plans';
  const query = parseQuery(queryText ?? '');
  const pathParts = path.split('/').filter(Boolean);

  if (pathParts[0] === 'templates') {
    return {
      view: 'template-library',
      planId: query.planId,
    };
  }

  if (pathParts[0] !== 'plans') {
    return { view: 'plans' };
  }

  if (pathParts.length === 1) {
    return { view: 'plans' };
  }

  if (pathParts.length === 2) {
    return {
      view: 'plan-details',
      planId: pathParts[1],
      tab: (query.tab as PlanDetailsTab | undefined) ?? 'checklists',
    };
  }

  if (pathParts.length >= 4 && pathParts[2] === 'checklists') {
    return {
      view: 'checklist-details',
      planId: pathParts[1],
      checklistId: pathParts[3],
      tab: (query.tab as ChecklistDetailsTab | undefined) ?? 'questions',
    };
  }

  return { view: 'plans' };
}

export function toHashRoute(route: RouteState): string {
  if (route.view === 'template-library') {
    if (route.planId) {
      return `#/templates?planId=${encodeURIComponent(route.planId)}`;
    }
    return '#/templates';
  }

  if (route.view === 'checklist-details' && route.planId && route.checklistId) {
    const tab = route.tab ? `?tab=${encodeURIComponent(route.tab)}` : '';
    return `#/plans/${encodeURIComponent(route.planId)}/checklists/${encodeURIComponent(route.checklistId)}${tab}`;
  }

  if (route.view === 'plan-details' && route.planId) {
    const tab = route.tab ? `?tab=${encodeURIComponent(route.tab)}` : '';
    return `#/plans/${encodeURIComponent(route.planId)}${tab}`;
  }

  return '#/plans';
}

export function updateHashRoute(route: RouteState, replace = false): void {
  const targetHash = toHashRoute(route);
  const fullTarget = `${window.location.pathname}${window.location.search}${targetHash}`;
  if (replace) {
    window.history.replaceState(undefined, '', fullTarget);
    return;
  }
  window.history.pushState(undefined, '', fullTarget);
}
