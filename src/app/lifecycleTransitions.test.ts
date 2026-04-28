import { describe, expect, it, vi } from 'vitest';
import {
  APPROVAL_STATUS_APPROVED,
  APPROVAL_STATUS_COMPLETED,
  CHECKLIST_STATUS_COMPLETE,
  CHECKLIST_STATUS_IN_PROGRESS,
  CHECKLIST_STATUS_NOT_STARTED,
  DEFICIENCY_CATEGORY_A,
  DEFICIENCY_STATUS_CLOSED,
  DEFICIENCY_STATUS_OPEN,
  PLAN_STAGE_APPROVAL,
  PLAN_STAGE_COMPLETION,
  PLAN_STAGE_DRAFT,
  PLAN_STAGE_EXECUTION,
  PLAN_STAGE_PLAN,
  TEAM_ROLE_PSSR_LEAD,
  TEAM_ROLE_PU_LEAD,
  canEditDeficiency,
  getDraftToPlanErrors,
  isPlanFinalized,
  isQuestionAnsweringEnabled,
  isTeamEditable,
} from './lifecycle';
import {
  advanceDraftToPlan,
  advanceExecutionToApproval,
  approvePlanStage,
  closeDeficiency,
  completeChecklist,
  finalSignOff,
  rejectApprovalStage,
  rejectPlanStage,
  triggerExecutionPhase,
} from './lifecycleTransitions';
import type { ApprovalVm, ChecklistVm, CurrentUserProfileVm, DeficiencyVm, PlanVm, QuestionVm, TeamMemberVm } from './types';

function createPlan(overrides: Partial<PlanVm> = {}): PlanVm {
  return {
    id: 'plan-1',
    createdById: 'user-originator',
    planId: 'P-001',
    name: 'Plan',
    stageCode: PLAN_STAGE_DRAFT,
    checklistCompletedCount: 0,
    checklistTotalCount: 0,
    percentComplete: 0,
    openDeficiencyCount: 0,
    ...overrides,
  };
}

function createChecklist(overrides: Partial<ChecklistVm> = {}): ChecklistVm {
  return {
    id: 'checklist-1',
    planId: 'plan-1',
    name: 'Checklist',
    statusCode: CHECKLIST_STATUS_NOT_STARTED,
    questionCompletedCount: 0,
    questionTotalCount: 2,
    ...overrides,
  };
}

function createDeficiency(overrides: Partial<DeficiencyVm> = {}): DeficiencyVm {
  return {
    id: 'def-1',
    planId: 'plan-1',
    questionId: 'question-1',
    name: 'Deficiency',
    statusCode: DEFICIENCY_STATUS_OPEN,
    ...overrides,
  };
}

function createApproval(overrides: Partial<ApprovalVm> = {}): ApprovalVm {
  return {
    id: 'approval-1',
    planId: 'plan-1',
    modifiedOn: '2026-04-28T12:00:00.000Z',
    ...overrides,
  };
}

function createUser(overrides: Partial<CurrentUserProfileVm> = {}): CurrentUserProfileVm {
  return {
    systemUserId: 'user-originator',
    fullName: 'Originator',
    userPrincipalName: 'originator@example.com',
    ...overrides,
  };
}

function createTeam(overrides: Partial<TeamMemberVm> = {}): TeamMemberVm {
  return {
    id: `team-${Math.random()}`,
    planId: 'plan-1',
    memberId: 'user-originator',
    roleCode: TEAM_ROLE_PSSR_LEAD,
    ...overrides,
  };
}

function createQuestion(overrides: Partial<QuestionVm> = {}): QuestionVm {
  return {
    id: 'question-1',
    checklistId: 'checklist-1',
    text: 'Question',
    sequenceOrder: 1,
    required: true,
    comment: '',
    ...overrides,
  };
}

function createDependencies() {
  return {
    updatePlan: vi.fn(async () => undefined),
    updateChecklist: vi.fn(async () => undefined),
    createApproval: vi.fn(async () => 'approval-created'),
    updateApproval: vi.fn(async () => undefined),
    updateDeficiency: vi.fn(async () => undefined),
  };
}

function createContext(overrides: Partial<{
  plan: PlanVm;
  approvals: ApprovalVm[];
  checklists: ChecklistVm[];
  deficiencies: DeficiencyVm[];
  teamMembers: TeamMemberVm[];
  currentUser: CurrentUserProfileVm | undefined;
}> = {}) {
  return {
    plan: createPlan(),
    approvals: [] as ApprovalVm[],
    checklists: [createChecklist()],
    deficiencies: [] as DeficiencyVm[],
    teamMembers: [
      createTeam({ memberId: 'user-pssr', roleCode: TEAM_ROLE_PSSR_LEAD }),
      createTeam({ memberId: 'user-pu', roleCode: TEAM_ROLE_PU_LEAD }),
    ],
    currentUser: createUser(),
    ...overrides,
  };
}

describe('lifecycle schema guards', () => {
  it('blocks Draft to Plan when checklists or required leads are missing', () => {
    const errors = getDraftToPlanErrors([], [], createPlan(), createUser());
    expect(errors).toContain('At least one checklist is required.');
    expect(errors).toContain('A PSSR-Lead team member is required.');
    expect(errors).toContain('A PU-Lead team member is required.');
  });

  it('locks all edits after final sign off', () => {
    const plan = createPlan({ stageCode: PLAN_STAGE_COMPLETION });
    const approvals = [createApproval({ stageCode: PLAN_STAGE_COMPLETION, roleCode: TEAM_ROLE_PSSR_LEAD, decisionCode: APPROVAL_STATUS_COMPLETED })];
    const checklist = createChecklist({ statusCode: CHECKLIST_STATUS_IN_PROGRESS });
    const deficiency = createDeficiency({ statusCode: DEFICIENCY_STATUS_OPEN });

    expect(isPlanFinalized(approvals)).toBe(true);
    expect(isQuestionAnsweringEnabled(plan, approvals, checklist)).toBe(false);
    expect(canEditDeficiency(plan, approvals, deficiency)).toBe(false);
    expect(isTeamEditable(plan, approvals)).toBe(false);
  });
});

describe('lifecycle transitions', () => {
  it('is idempotent when Advance to Plan is repeated after success', async () => {
    const result = await advanceDraftToPlan(
      createContext({ plan: createPlan({ stageCode: PLAN_STAGE_PLAN }) }),
      createDependencies(),
    );

    expect(result.success).toBe(true);
  });

  it('approves the Plan phase only for the PSSR-Lead', async () => {
    const deps = createDependencies();
    const context = createContext({
      plan: createPlan({ stageCode: PLAN_STAGE_PLAN }),
      approvals: [createApproval({ stageCode: PLAN_STAGE_PLAN, roleCode: TEAM_ROLE_PSSR_LEAD })],
      currentUser: createUser({ systemUserId: 'user-other' }),
    });

    const result = await approvePlanStage(context, deps);
    expect(result.success).toBe(false);
  });

  it('rejects the Plan phase back to Draft', async () => {
    const deps = createDependencies();
    const context = createContext({
      plan: createPlan({ stageCode: PLAN_STAGE_PLAN }),
      approvals: [createApproval({ id: 'approval-plan', stageCode: PLAN_STAGE_PLAN, roleCode: TEAM_ROLE_PSSR_LEAD })],
      currentUser: createUser({ systemUserId: 'user-pssr' }),
    });

    const result = await rejectPlanStage(context, 'Need corrections', deps);
    expect(result.success).toBe(true);
    expect(deps.updatePlan).toHaveBeenCalledWith('plan-1', { stageCode: PLAN_STAGE_DRAFT });
  });

  it('moves Plan to Execution only after approval and first answer save', async () => {
    const deps = createDependencies();
    const checklist = createChecklist({ statusCode: CHECKLIST_STATUS_NOT_STARTED });
    const context = createContext({
      plan: createPlan({ stageCode: PLAN_STAGE_PLAN }),
      approvals: [createApproval({ stageCode: PLAN_STAGE_PLAN, roleCode: TEAM_ROLE_PSSR_LEAD, decisionCode: APPROVAL_STATUS_APPROVED })],
    });

    const result = await triggerExecutionPhase(context, checklist, deps);
    expect(result.success).toBe(true);
    expect(deps.updatePlan).toHaveBeenCalledWith('plan-1', { stageCode: PLAN_STAGE_EXECUTION });
    expect(deps.updateChecklist).toHaveBeenCalledWith('checklist-1', { statusCode: CHECKLIST_STATUS_IN_PROGRESS });
  });

  it('blocks checklist completion until all answers exist and No answers have deficiencies', async () => {
    const deps = createDependencies();
    const context = createContext();
    const checklist = createChecklist();
    const result = await completeChecklist(
      context,
      checklist,
      [createQuestion({ responseCode: undefined }), createQuestion({ id: 'question-2', responseCode: 507650001 })],
      deps,
    );

    expect(result.success).toBe(false);
  });

  it('blocks Execution to Approval until accepted categories and category A closures are complete', async () => {
    const deps = createDependencies();
    const context = createContext({
      plan: createPlan({ stageCode: PLAN_STAGE_EXECUTION }),
      checklists: [createChecklist({ statusCode: CHECKLIST_STATUS_COMPLETE })],
      deficiencies: [createDeficiency({ acceptedCategoryCode: DEFICIENCY_CATEGORY_A, statusCode: DEFICIENCY_STATUS_OPEN })],
      currentUser: createUser({ systemUserId: 'user-pssr' }),
    });

    const result = await advanceExecutionToApproval(context, deps);
    expect(result.success).toBe(false);
  });

  it('rejects Approval back to Execution and creates a new Execution in-progress approval', async () => {
    const deps = createDependencies();
    const context = createContext({
      plan: createPlan({ stageCode: PLAN_STAGE_APPROVAL }),
      approvals: [createApproval({ id: 'approval-stage', stageCode: PLAN_STAGE_APPROVAL, roleCode: TEAM_ROLE_PU_LEAD })],
      currentUser: createUser({ systemUserId: 'user-pu' }),
    });

    const result = await rejectApprovalStage(context, 'Rework required', deps);
    expect(result.success).toBe(true);
    expect(deps.updatePlan).toHaveBeenCalledWith('plan-1', { stageCode: PLAN_STAGE_EXECUTION });
    expect(deps.createApproval).toHaveBeenCalledWith(expect.objectContaining({ stageCode: PLAN_STAGE_EXECUTION, roleCode: TEAM_ROLE_PSSR_LEAD }));
  });

  it('allows final sign off only when all deficiencies are closed', async () => {
    const deps = createDependencies();
    const blocked = await finalSignOff(
      createContext({
        plan: createPlan({ stageCode: PLAN_STAGE_COMPLETION }),
        approvals: [createApproval({ stageCode: PLAN_STAGE_COMPLETION, roleCode: TEAM_ROLE_PSSR_LEAD })],
        deficiencies: [createDeficiency({ statusCode: DEFICIENCY_STATUS_OPEN })],
        currentUser: createUser({ systemUserId: 'user-pssr' }),
      }),
      deps,
    );
    expect(blocked.success).toBe(false);

    const allowed = await finalSignOff(
      createContext({
        plan: createPlan({ stageCode: PLAN_STAGE_COMPLETION }),
        approvals: [createApproval({ stageCode: PLAN_STAGE_COMPLETION, roleCode: TEAM_ROLE_PSSR_LEAD })],
        deficiencies: [createDeficiency({ statusCode: DEFICIENCY_STATUS_CLOSED })],
        currentUser: createUser({ systemUserId: 'user-pssr' }),
      }),
      deps,
    );
    expect(allowed.success).toBe(true);
  });

  it('closes a deficiency only with a closing comment', async () => {
    const deps = createDependencies();
    const blocked = await closeDeficiency(createContext(), createDeficiency(), '', deps);
    expect(blocked.success).toBe(false);

    const allowed = await closeDeficiency(createContext(), createDeficiency(), 'Closed out', deps);
    expect(allowed.success).toBe(true);
    expect(deps.updateDeficiency).toHaveBeenCalledWith('def-1', expect.objectContaining({ statusCode: DEFICIENCY_STATUS_CLOSED }));
  });

  it('returns a clear failure when a dependency reports a concurrency-like conflict', async () => {
    const deps = createDependencies();
    deps.updatePlan.mockRejectedValueOnce(new Error('Precondition Failed. Refresh and retry.'));

    const result = await advanceDraftToPlan(createContext(), deps);
    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toContain('Refresh and retry');
  });
});