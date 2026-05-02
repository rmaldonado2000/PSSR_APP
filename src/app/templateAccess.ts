import type { CurrentUserProfileVm, TemplateChecklistVm, TemplateQuestionVm } from './types';

type SiteScope = {
  siteCode?: number;
  siteLabel?: string;
};

export type TemplateAccessKind = 'none' | 'enterprise-admin' | 'site-admin-enterprise' | 'site-admin-site';

export interface TemplateAccessContext extends SiteScope {
  kind: TemplateAccessKind;
  roleLabel?: string;
}

function normalizeLabelKey(value?: string): string {
  return (value ?? '').trim().replace(/[\s_-]+/g, '').toLowerCase();
}

export function isEnterpriseSite(scope?: SiteScope): boolean {
  return normalizeLabelKey(scope?.siteLabel) === 'enterprise';
}

export function isSameSiteScope(left?: SiteScope, right?: SiteScope): boolean {
  if (left?.siteLabel && right?.siteLabel) {
    return normalizeLabelKey(left.siteLabel) === normalizeLabelKey(right.siteLabel);
  }

  if (left?.siteCode !== undefined && right?.siteCode !== undefined) {
    return left.siteCode === right.siteCode;
  }

  return false;
}

export function getTemplateAccessContext(user?: CurrentUserProfileVm): TemplateAccessContext {
  const roleKey = normalizeLabelKey(user?.roleLabel);
  const scope = {
    siteCode: user?.siteCode,
    siteLabel: user?.siteLabel,
  };

  if (roleKey === 'enterpriseadmin') {
    return {
      kind: 'enterprise-admin',
      roleLabel: user?.roleLabel,
      ...scope,
    };
  }

  if (roleKey === 'siteadmin') {
    return {
      kind: isEnterpriseSite(scope) ? 'site-admin-enterprise' : 'site-admin-site',
      roleLabel: user?.roleLabel,
      ...scope,
    };
  }

  return {
    kind: 'none',
    roleLabel: user?.roleLabel,
    ...scope,
  };
}

export function hasTemplateAccess(user?: CurrentUserProfileVm): boolean {
  return getTemplateAccessContext(user).kind !== 'none';
}

export function hasBroadTemplateAccess(user?: CurrentUserProfileVm): boolean {
  const context = getTemplateAccessContext(user);
  return context.kind === 'enterprise-admin' || context.kind === 'site-admin-enterprise';
}

export function getTemplateAccessDeniedMessage(): string {
  return 'Template functionality is available only to Enterprise Admin and Site Admin users.';
}

export function getTemplateReadonlyMessage(user: CurrentUserProfileVm | undefined, template: TemplateChecklistVm): string | undefined {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'site-admin-site' && isEnterpriseSite(template)) {
    return 'Enterprise templates are read-only for Site Admin users outside Enterprise. You can still add site questions for your site.';
  }

  return undefined;
}

export function filterTemplateChecklistsForUser(
  user: CurrentUserProfileVm | undefined,
  templates: TemplateChecklistVm[],
): TemplateChecklistVm[] {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'none') {
    return [];
  }

  if (hasBroadTemplateAccess(user)) {
    return templates;
  }

  return templates.filter((template) => isEnterpriseSite(template) || isSameSiteScope(template, context));
}

export function filterTemplateQuestionsForUser(
  user: CurrentUserProfileVm | undefined,
  template: TemplateChecklistVm | undefined,
  questions: TemplateQuestionVm[],
): TemplateQuestionVm[] {
  if (!template) {
    return [];
  }

  const context = getTemplateAccessContext(user);
  if (context.kind === 'none') {
    return [];
  }

  if (hasBroadTemplateAccess(user)) {
    return questions;
  }

  return questions.filter((question) => isEnterpriseSite(question) || isSameSiteScope(question, context));
}

export function filterTemplateQuestionsForPlanSite(
  questions: TemplateQuestionVm[],
  planSite: SiteScope | undefined,
): TemplateQuestionVm[] {
  return questions.filter((question) => isEnterpriseSite(question) || isSameSiteScope(question, planSite));
}

export function filterTemplateChecklistsForPlanSite(
  templates: TemplateChecklistVm[],
  planSite: SiteScope | undefined,
): TemplateChecklistVm[] {
  return templates.filter((template) => isEnterpriseSite(template) || isSameSiteScope(template, planSite));
}

export function canCreateTemplateChecklist(user?: CurrentUserProfileVm): boolean {
  return hasTemplateAccess(user);
}

export function canEditTemplateChecklist(user: CurrentUserProfileVm | undefined, template: TemplateChecklistVm): boolean {
  if (hasBroadTemplateAccess(user)) {
    return true;
  }

  const context = getTemplateAccessContext(user);
  return context.kind === 'site-admin-site' && isSameSiteScope(template, context);
}

export function canDuplicateTemplateChecklist(user?: CurrentUserProfileVm): boolean {
  return hasTemplateAccess(user);
}

export function canDeleteTemplateChecklist(user: CurrentUserProfileVm | undefined, template: TemplateChecklistVm): boolean {
  return canEditTemplateChecklist(user, template);
}

export function canCreateTemplateQuestion(
  user: CurrentUserProfileVm | undefined,
  template: TemplateChecklistVm,
): boolean {
  if (hasBroadTemplateAccess(user)) {
    return true;
  }

  const context = getTemplateAccessContext(user);
  return context.kind === 'site-admin-site' && (isEnterpriseSite(template) || isSameSiteScope(template, context));
}

export function canEditTemplateQuestion(
  user: CurrentUserProfileVm | undefined,
  _template: TemplateChecklistVm,
  question: TemplateQuestionVm,
): boolean {
  if (hasBroadTemplateAccess(user)) {
    return true;
  }

  const context = getTemplateAccessContext(user);
  return context.kind === 'site-admin-site' && isSameSiteScope(question, context);
}

export function canDeleteTemplateQuestion(
  user: CurrentUserProfileVm | undefined,
  template: TemplateChecklistVm,
  question: TemplateQuestionVm,
): boolean {
  return canEditTemplateQuestion(user, template, question);
}

export function shouldLockTemplateChecklistSite(user?: CurrentUserProfileVm): boolean {
  return getTemplateAccessContext(user).kind === 'site-admin-site';
}

export function shouldLockTemplateQuestionSite(user?: CurrentUserProfileVm): boolean {
  return getTemplateAccessContext(user).kind === 'site-admin-site';
}

export function getDefaultTemplateChecklistSiteCode(
  user: CurrentUserProfileVm | undefined,
  template?: Pick<TemplateChecklistVm, 'siteCode'>,
): number | undefined {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'site-admin-site') {
    return context.siteCode;
  }

  return template?.siteCode;
}

export function resolveTemplateChecklistWriteSiteCode(
  user: CurrentUserProfileVm | undefined,
  requestedSiteCode?: number,
  fallbackSiteCode?: number,
): number | undefined {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'site-admin-site') {
    return context.siteCode;
  }

  return requestedSiteCode ?? fallbackSiteCode;
}

export function getDefaultTemplateQuestionSiteCode(
  user: CurrentUserProfileVm | undefined,
  template?: Pick<TemplateChecklistVm, 'siteCode'>,
  question?: Pick<TemplateQuestionVm, 'siteCode'>,
): number | undefined {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'site-admin-site') {
    return context.siteCode;
  }

  return question?.siteCode ?? template?.siteCode;
}

export function resolveTemplateQuestionWriteSiteCode(
  user: CurrentUserProfileVm | undefined,
  requestedSiteCode?: number,
  fallbackSiteCode?: number,
): number | undefined {
  const context = getTemplateAccessContext(user);
  if (context.kind === 'site-admin-site') {
    return context.siteCode;
  }

  return requestedSiteCode ?? fallbackSiteCode;
}

export function getTemplateQuestionCreateLabel(
  user: CurrentUserProfileVm | undefined,
  template?: TemplateChecklistVm,
): string {
  return getTemplateAccessContext(user).kind === 'site-admin-site' && template && isEnterpriseSite(template)
    ? 'Add Site Question'
    : 'Add Question';
}

export function getTemplateScopeLabel(scope?: SiteScope): string {
  return isEnterpriseSite(scope)
    ? 'Enterprise'
    : scope?.siteLabel?.trim()
      ? `Site: ${scope.siteLabel.trim()}`
      : 'Site unavailable';
}

export function getEditableTemplateQuestions(
  user: CurrentUserProfileVm | undefined,
  template: TemplateChecklistVm | undefined,
  questions: TemplateQuestionVm[],
): TemplateQuestionVm[] {
  if (!template) {
    return [];
  }

  return questions.filter((question) => canEditTemplateQuestion(user, template, question));
}

export function getTemplateQuestionSequenceLimit(
  questions: Array<Pick<TemplateQuestionVm, 'id'>>,
  questionId?: string,
): number {
  return questionId ? Math.max(questions.length, 1) : questions.length + 1;
}

export function getTemplateQuestionSequenceError(
  sequenceOrder: number,
  questions: Array<Pick<TemplateQuestionVm, 'id'>>,
  questionId?: string,
): string | undefined {
  const maxSequence = getTemplateQuestionSequenceLimit(questions, questionId);
  if (!Number.isInteger(sequenceOrder) || sequenceOrder < 1 || sequenceOrder > maxSequence) {
    return `Sequence must be between 1 and ${maxSequence}.`;
  }

  return undefined;
}

export function canResequenceTemplateQuestions(
  user: CurrentUserProfileVm | undefined,
  template: TemplateChecklistVm | undefined,
): boolean {
  if (!template) {
    return false;
  }

  if (hasBroadTemplateAccess(user)) {
    return true;
  }

  const context = getTemplateAccessContext(user);
  return context.kind === 'site-admin-site' && !isEnterpriseSite(template);
}

function buildQuestionDedupKey(question: Pick<TemplateQuestionVm, 'questionText'>): string {
  return normalizeLabelKey(question.questionText);
}

export function orderTemplateQuestionsForPlanCopy(
  questions: TemplateQuestionVm[],
  planSite: SiteScope | undefined,
): TemplateQuestionVm[] {
  const visibleQuestions = questions.filter((question) => isEnterpriseSite(question) || isSameSiteScope(question, planSite));
  const enterpriseQuestions = visibleQuestions
    .filter((question) => isEnterpriseSite(question))
    .sort((left, right) => left.sequenceOrder - right.sequenceOrder);
  const siteQuestions = visibleQuestions
    .filter((question) => !isEnterpriseSite(question))
    .sort((left, right) => left.sequenceOrder - right.sequenceOrder);

  const orderedQuestions: TemplateQuestionVm[] = [];
  const seenKeys = new Set<string>();

  for (const question of [...enterpriseQuestions, ...siteQuestions]) {
    const dedupKey = buildQuestionDedupKey(question);
    if (dedupKey && seenKeys.has(dedupKey)) {
      continue;
    }

    if (dedupKey) {
      seenKeys.add(dedupKey);
    }

    orderedQuestions.push({
      ...question,
      sequenceOrder: orderedQuestions.length + 1,
    });
  }

  return orderedQuestions;
}