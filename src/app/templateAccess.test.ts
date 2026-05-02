import { describe, expect, it } from 'vitest';
import {
  canResequenceTemplateQuestions,
  canCreateTemplateQuestion,
  canEditTemplateChecklist,
  canEditTemplateQuestion,
  filterTemplateChecklistsForPlanSite,
  filterTemplateChecklistsForUser,
  filterTemplateQuestionsForPlanSite,
  getTemplateAccessContext,
  getTemplateQuestionSequenceError,
  getTemplateQuestionCreateLabel,
  getTemplateQuestionSequenceLimit,
  orderTemplateQuestionsForPlanCopy,
} from './templateAccess';
import type { CurrentUserProfileVm, TemplateChecklistVm, TemplateQuestionVm } from './types';

function createUser(overrides: Partial<CurrentUserProfileVm> = {}): CurrentUserProfileVm {
  return {
    systemUserId: 'user-1',
    fullName: 'Test User',
    userPrincipalName: 'test@example.com',
    ...overrides,
  };
}

function createTemplate(overrides: Partial<TemplateChecklistVm> = {}): TemplateChecklistVm {
  return {
    id: 'template-1',
    name: 'Template',
    statusLabel: 'Active',
    questionCount: 0,
    ...overrides,
  };
}

function createQuestion(overrides: Partial<TemplateQuestionVm> = {}): TemplateQuestionVm {
  return {
    id: 'question-1',
    questionText: 'Question',
    sequenceOrder: 1,
    isMandatory: true,
    ...overrides,
  };
}

describe('templateAccess', () => {
  it('treats Enterprise Admin and Enterprise Site Admin as broad admins', () => {
    expect(getTemplateAccessContext(createUser({ roleLabel: 'Enterprise Admin' })).kind).toBe('enterprise-admin');
    expect(getTemplateAccessContext(createUser({ roleLabel: 'Site Admin', siteLabel: 'Enterprise' })).kind).toBe('site-admin-enterprise');
  });

  it('filters template visibility for non-enterprise site admins', () => {
    const user = createUser({ roleLabel: 'Site Admin', siteLabel: 'Montreal', siteCode: 507650006 });
    const visible = filterTemplateChecklistsForUser(user, [
      createTemplate({ id: 'enterprise', siteLabel: 'Enterprise' }),
      createTemplate({ id: 'montreal', siteLabel: 'Montreal' }),
      createTemplate({ id: 'firebag', siteLabel: 'Firebag' }),
    ]);

    expect(visible.map((template) => template.id)).toEqual(['enterprise', 'montreal']);
  });

  it('keeps enterprise templates read-only for non-enterprise site admins while allowing site questions', () => {
    const user = createUser({ roleLabel: 'Site Admin', siteLabel: 'Montreal', siteCode: 507650006 });
    const enterpriseTemplate = createTemplate({ id: 'enterprise', siteLabel: 'Enterprise' });
    const enterpriseQuestion = createQuestion({ id: 'enterprise-question', siteLabel: 'Enterprise' });
    const siteQuestion = createQuestion({ id: 'site-question', siteLabel: 'Montreal' });

    expect(canEditTemplateChecklist(user, enterpriseTemplate)).toBe(false);
    expect(canCreateTemplateQuestion(user, enterpriseTemplate)).toBe(true);
    expect(canEditTemplateQuestion(user, enterpriseTemplate, enterpriseQuestion)).toBe(false);
    expect(canEditTemplateQuestion(user, enterpriseTemplate, siteQuestion)).toBe(true);
    expect(getTemplateQuestionCreateLabel(user, enterpriseTemplate)).toBe('Add Site Question');
    expect(canResequenceTemplateQuestions(user, enterpriseTemplate)).toBe(false);
    expect(canResequenceTemplateQuestions(user, createTemplate({ id: 'montreal', siteLabel: 'Montreal' }))).toBe(true);
  });

  it('filters picker templates by the selected plan site instead of the user site', () => {
    const filtered = filterTemplateChecklistsForPlanSite([
      createTemplate({ id: 'enterprise', siteLabel: 'Enterprise' }),
      createTemplate({ id: 'montreal', siteLabel: 'Montreal' }),
      createTemplate({ id: 'firebag', siteLabel: 'Firebag' }),
    ], { siteLabel: 'Firebag', siteCode: 507650000 });

    expect(filtered.map((template) => template.id)).toEqual(['enterprise', 'firebag']);
  });

  it('filters picker questions by the selected plan site instead of the user role', () => {
    const filtered = filterTemplateQuestionsForPlanSite([
      createQuestion({ id: 'enterprise-question', siteLabel: 'Enterprise' }),
      createQuestion({ id: 'firebag-question', siteLabel: 'Firebag' }),
      createQuestion({ id: 'montreal-question', siteLabel: 'Montreal' }),
    ], { siteLabel: 'Firebag', siteCode: 507650000 });

    expect(filtered.map((question) => question.id)).toEqual(['enterprise-question', 'firebag-question']);
  });

  it('orders copied questions enterprise-first, then site, with contiguous sequence and dedupe', () => {
    const ordered = orderTemplateQuestionsForPlanCopy([
      createQuestion({ id: 'enterprise-2', questionText: 'Enterprise Second', sequenceOrder: 2, siteLabel: 'Enterprise' }),
      createQuestion({ id: 'site-1', questionText: 'Site Question', sequenceOrder: 1, siteLabel: 'Montreal' }),
      createQuestion({ id: 'enterprise-1', questionText: 'Enterprise First', sequenceOrder: 1, siteLabel: 'Enterprise' }),
      createQuestion({ id: 'site-dup', questionText: 'Enterprise First', sequenceOrder: 2, siteLabel: 'Montreal' }),
    ], { siteLabel: 'Montreal', siteCode: 507650006 });

    expect(ordered.map((question) => [question.id, question.sequenceOrder])).toEqual([
      ['enterprise-1', 1],
      ['enterprise-2', 2],
      ['site-1', 3],
    ]);
  });

  it('limits question sequence to the checklist range', () => {
    const questions = [
      createQuestion({ id: 'question-1' }),
      createQuestion({ id: 'question-2' }),
      createQuestion({ id: 'question-3' }),
    ];

    expect(getTemplateQuestionSequenceLimit(questions)).toBe(4);
    expect(getTemplateQuestionSequenceLimit(questions, 'question-2')).toBe(3);
    expect(getTemplateQuestionSequenceError(4, questions)).toBeUndefined();
    expect(getTemplateQuestionSequenceError(200, questions)).toBe('Sequence must be between 1 and 4.');
    expect(getTemplateQuestionSequenceError(4, questions, 'question-2')).toBe('Sequence must be between 1 and 3.');
  });
});