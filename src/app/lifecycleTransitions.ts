import type { ApprovalVm, ChecklistVm, CurrentUserProfileVm, DeficiencyVm, PlanVm, QuestionVm, TeamMemberVm } from './types';
import {
  APPROVAL_STATUS_APPROVED,
  APPROVAL_STATUS_COMPLETED,
  APPROVAL_STATUS_REJECTED,
  CHECKLIST_STATUS_COMPLETE,
  CHECKLIST_STATUS_IN_PROGRESS,
  CHECKLIST_STATUS_NOT_STARTED,
  DEFICIENCY_STATUS_CLOSED,
  PLAN_STAGE_APPROVAL,
  PLAN_STAGE_COMPLETION,
  PLAN_STAGE_DRAFT,
  PLAN_STAGE_EXECUTION,
  PLAN_STAGE_PLAN,
  TEAM_ROLE_PSSR_LEAD,
  TEAM_ROLE_PU_LEAD,
  createFailureResult,
  createSuccessResult,
  findPendingApprovalRequest,
  findLatestApproval,
  getChecklistCompleteErrors,
  getDraftToPlanErrors,
  getExecutionToApprovalErrors,
  getFinalSignOffErrors,
  hasTeamRole,
  isApprovalInProgress,
  isPlanApproved,
  isPlanFinalized,
  PLAN_APPROVAL_REQUEST_COMMENT,
  type LifecycleResult,
} from './lifecycle';

type TransitionContext = {
  plan: PlanVm;
  approvals: ApprovalVm[];
  checklists: ChecklistVm[];
  deficiencies: DeficiencyVm[];
  teamMembers: TeamMemberVm[];
  currentUser: CurrentUserProfileVm | undefined;
};

type TransitionDependencies = {
  updatePlan: (planId: string, payload: { stageCode?: number }) => Promise<void>;
  updateChecklist: (checklistId: string, payload: { statusCode?: number }) => Promise<void>;
  createApproval: (payload: {
    planId: string;
    stageCode: number;
    roleCode?: number;
    statusCode?: number;
    comment?: string;
    memberId?: string;
    approveOn?: string;
  }) => Promise<string>;
  updateApproval: (approvalId: string, payload: { statusCode?: number; comment?: string; approveOn?: string }) => Promise<void>;
  updateDeficiency: (deficiencyId: string, payload: {
    statusCode?: number;
    closeoutComment?: string;
    closedOn?: string;
    closedById?: string;
  }) => Promise<void>;
};

function getActorUserId(currentUser: CurrentUserProfileVm | undefined): string | undefined {
  return currentUser?.systemUserId;
}

function getNow(): string {
  return new Date().toISOString();
}

function mapTransitionError(error: unknown): LifecycleResult {
  const message = error instanceof Error ? error.message : String(error);
  return {
    success: false,
    errors: [{ code: 'transition_failed', message }],
    warnings: [],
    updatedIds: {},
  };
}

export async function advanceDraftToPlan(
  context: TransitionContext,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  if (context.plan.stageCode !== PLAN_STAGE_DRAFT) {
    return createSuccessResult({ planId: context.plan.id });
  }

  const errors = getDraftToPlanErrors(context.checklists, context.teamMembers, context.plan, context.currentUser);
  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  try {
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_PLAN });

    const draftApprovalId = await dependencies.createApproval({
      planId: context.plan.id,
      stageCode: PLAN_STAGE_DRAFT,
      statusCode: APPROVAL_STATUS_COMPLETED,
      comment: 'Advanced by originator.',
      memberId: getActorUserId(context.currentUser),
      approveOn: getNow(),
    });

    const existingPlanApproval = findPendingApprovalRequest(
      context.approvals,
      PLAN_STAGE_PLAN,
      TEAM_ROLE_PSSR_LEAD,
      PLAN_APPROVAL_REQUEST_COMMENT,
    );
    let planApprovalId = existingPlanApproval?.id;
    if (!existingPlanApproval) {
      planApprovalId = await dependencies.createApproval({
        planId: context.plan.id,
        stageCode: PLAN_STAGE_PLAN,
        roleCode: TEAM_ROLE_PSSR_LEAD,
        comment: PLAN_APPROVAL_REQUEST_COMMENT,
      });
    }

    return createSuccessResult({
      planId: context.plan.id,
      draftApprovalId,
      planApprovalId,
    });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function approvePlanStage(
  context: TransitionContext,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  const latestPlanApproval = findLatestApproval(context.approvals, PLAN_STAGE_PLAN, TEAM_ROLE_PSSR_LEAD);
  const pendingPlanApproval = findPendingApprovalRequest(
    context.approvals,
    PLAN_STAGE_PLAN,
    TEAM_ROLE_PSSR_LEAD,
    PLAN_APPROVAL_REQUEST_COMMENT,
  );
  if (context.plan.stageCode !== PLAN_STAGE_PLAN || !hasTeamRole(context.teamMembers, context.currentUser, TEAM_ROLE_PSSR_LEAD)) {
    return createFailureResult(['Only the PSSR-Lead can approve the Plan phase.']);
  }

  if (latestPlanApproval?.decisionCode === APPROVAL_STATUS_APPROVED) {
    return createSuccessResult({ planApprovalId: latestPlanApproval.id, planId: context.plan.id });
  }

  let planApprovalId = pendingPlanApproval?.id;

  if (!pendingPlanApproval) {
    try {
      planApprovalId = await dependencies.createApproval({
        planId: context.plan.id,
        stageCode: PLAN_STAGE_PLAN,
        roleCode: TEAM_ROLE_PSSR_LEAD,
        comment: PLAN_APPROVAL_REQUEST_COMMENT,
      });
    } catch (error) {
      return mapTransitionError(error);
    }
  } else if (!isApprovalInProgress(pendingPlanApproval)) {
    return createFailureResult(['The latest Plan approval is not in progress.']);
  }

  try {
    await dependencies.updateApproval(planApprovalId!, {
      statusCode: APPROVAL_STATUS_APPROVED,
      approveOn: getNow(),
    });
    return createSuccessResult({ planApprovalId: planApprovalId, planId: context.plan.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function rejectPlanStage(
  context: TransitionContext,
  reason: string,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  const latestPlanApproval = findLatestApproval(context.approvals, PLAN_STAGE_PLAN, TEAM_ROLE_PSSR_LEAD);
  const pendingPlanApproval = findPendingApprovalRequest(
    context.approvals,
    PLAN_STAGE_PLAN,
    TEAM_ROLE_PSSR_LEAD,
    PLAN_APPROVAL_REQUEST_COMMENT,
  );
  if (context.plan.stageCode === PLAN_STAGE_DRAFT) {
    return createSuccessResult({ planId: context.plan.id, planApprovalId: latestPlanApproval?.id });
  }

  if (!hasTeamRole(context.teamMembers, context.currentUser, TEAM_ROLE_PSSR_LEAD)) {
    return createFailureResult(['Only the PSSR-Lead can reject the Plan phase.']);
  }

  if (!isApprovalInProgress(pendingPlanApproval)) {
    return createFailureResult(['The latest Plan approval is not in progress.']);
  }

  try {
    await dependencies.updateApproval(pendingPlanApproval.id, {
      statusCode: APPROVAL_STATUS_REJECTED,
      comment: reason,
      approveOn: getNow(),
    });
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_DRAFT });
    return createSuccessResult({ planId: context.plan.id, planApprovalId: pendingPlanApproval.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function triggerExecutionPhase(
  context: TransitionContext,
  checklist: ChecklistVm,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  if (context.plan.stageCode === PLAN_STAGE_EXECUTION) {
    return createSuccessResult({ planId: context.plan.id, checklistId: checklist.id });
  }

  if (context.plan.stageCode !== PLAN_STAGE_PLAN || !isPlanApproved(context.approvals)) {
    return createFailureResult(['Plan approval is required before Execution can start.']);
  }

  try {
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_EXECUTION });
    if (checklist.statusCode === CHECKLIST_STATUS_NOT_STARTED) {
      await dependencies.updateChecklist(checklist.id, { statusCode: CHECKLIST_STATUS_IN_PROGRESS });
    }
    return createSuccessResult({ planId: context.plan.id, checklistId: checklist.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function advanceExecutionToApproval(
  context: TransitionContext,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  if (context.plan.stageCode === PLAN_STAGE_APPROVAL || context.plan.stageCode === PLAN_STAGE_COMPLETION) {
    return createSuccessResult({ planId: context.plan.id });
  }

  if (!hasTeamRole(context.teamMembers, context.currentUser, TEAM_ROLE_PSSR_LEAD)) {
    return createFailureResult(['Only the PSSR-Lead can advance this plan to Approval.']);
  }

  const errors = getExecutionToApprovalErrors(context.checklists, context.deficiencies);
  if (context.plan.stageCode !== PLAN_STAGE_EXECUTION) {
    errors.unshift('Plan is not in the Execution phase.');
  }
  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  try {
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_APPROVAL });
    const executionApprovalId = await dependencies.createApproval({
      planId: context.plan.id,
      stageCode: PLAN_STAGE_EXECUTION,
      roleCode: TEAM_ROLE_PSSR_LEAD,
      statusCode: APPROVAL_STATUS_COMPLETED,
      memberId: getActorUserId(context.currentUser),
      approveOn: getNow(),
    });

    const latestApprovalApproval = findLatestApproval(context.approvals, PLAN_STAGE_APPROVAL, TEAM_ROLE_PU_LEAD);
    const approvalApprovalId = isApprovalInProgress(latestApprovalApproval)
      ? latestApprovalApproval.id
      : await dependencies.createApproval({
          planId: context.plan.id,
          stageCode: PLAN_STAGE_APPROVAL,
          roleCode: TEAM_ROLE_PU_LEAD,
          comment: 'Awaiting PU-Lead approval.',
        });

    return createSuccessResult({
      planId: context.plan.id,
      executionApprovalId,
      approvalApprovalId,
    });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function approveApprovalStage(
  context: TransitionContext,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  const latestApprovalApproval = findLatestApproval(context.approvals, PLAN_STAGE_APPROVAL, TEAM_ROLE_PU_LEAD);
  if (context.plan.stageCode === PLAN_STAGE_COMPLETION && latestApprovalApproval?.decisionCode === APPROVAL_STATUS_APPROVED) {
    return createSuccessResult({ planId: context.plan.id, approvalApprovalId: latestApprovalApproval.id });
  }

  if (context.plan.stageCode !== PLAN_STAGE_APPROVAL || !hasTeamRole(context.teamMembers, context.currentUser, TEAM_ROLE_PU_LEAD)) {
    return createFailureResult(['Only the PU-Lead can approve the Approval phase.']);
  }

  if (!isApprovalInProgress(latestApprovalApproval)) {
    return createFailureResult(['The latest Approval approval is not in progress.']);
  }

  try {
    await dependencies.updateApproval(latestApprovalApproval.id, {
      statusCode: APPROVAL_STATUS_APPROVED,
      approveOn: getNow(),
    });
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_COMPLETION });

    const latestCompletionApproval = findLatestApproval(context.approvals, PLAN_STAGE_COMPLETION, TEAM_ROLE_PSSR_LEAD);
    const completionApprovalId = isApprovalInProgress(latestCompletionApproval)
      ? latestCompletionApproval.id
      : await dependencies.createApproval({
          planId: context.plan.id,
          stageCode: PLAN_STAGE_COMPLETION,
          roleCode: TEAM_ROLE_PSSR_LEAD,
          comment: 'Awaiting final sign off.',
        });

    return createSuccessResult({
      planId: context.plan.id,
      approvalApprovalId: latestApprovalApproval.id,
      completionApprovalId,
    });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function rejectApprovalStage(
  context: TransitionContext,
  reason: string,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  const latestApprovalApproval = findLatestApproval(context.approvals, PLAN_STAGE_APPROVAL, TEAM_ROLE_PU_LEAD);
  if (context.plan.stageCode === PLAN_STAGE_EXECUTION && latestApprovalApproval?.decisionCode === APPROVAL_STATUS_REJECTED) {
    return createSuccessResult({ planId: context.plan.id, approvalApprovalId: latestApprovalApproval.id });
  }

  if (context.plan.stageCode !== PLAN_STAGE_APPROVAL || !hasTeamRole(context.teamMembers, context.currentUser, TEAM_ROLE_PU_LEAD)) {
    return createFailureResult(['Only the PU-Lead can reject the Approval phase.']);
  }

  if (!isApprovalInProgress(latestApprovalApproval)) {
    return createFailureResult(['The latest Approval approval is not in progress.']);
  }

  try {
    await dependencies.updateApproval(latestApprovalApproval.id, {
      statusCode: APPROVAL_STATUS_REJECTED,
      comment: reason,
      approveOn: getNow(),
    });
    await dependencies.updatePlan(context.plan.id, { stageCode: PLAN_STAGE_EXECUTION });

    const latestExecutionApproval = findLatestApproval(context.approvals, PLAN_STAGE_EXECUTION, TEAM_ROLE_PSSR_LEAD);
    const executionApprovalId = isApprovalInProgress(latestExecutionApproval)
      ? latestExecutionApproval.id
      : await dependencies.createApproval({
          planId: context.plan.id,
          stageCode: PLAN_STAGE_EXECUTION,
          roleCode: TEAM_ROLE_PSSR_LEAD,
          comment: 'Returned to Execution after Approval rejection.',
        });

    return createSuccessResult({
      planId: context.plan.id,
      approvalApprovalId: latestApprovalApproval.id,
      executionApprovalId,
    });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function finalSignOff(
  context: TransitionContext,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  const latestCompletionApproval = findLatestApproval(context.approvals, PLAN_STAGE_COMPLETION, TEAM_ROLE_PSSR_LEAD);
  if (isPlanFinalized(context.approvals)) {
    return createSuccessResult({ planId: context.plan.id, completionApprovalId: latestCompletionApproval?.id });
  }

  const errors = getFinalSignOffErrors(context.deficiencies, context.teamMembers, context.currentUser);
  if (context.plan.stageCode !== PLAN_STAGE_COMPLETION) {
    errors.unshift('Plan is not in the Completion phase.');
  }
  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  if (!isApprovalInProgress(latestCompletionApproval)) {
    return createFailureResult(['The latest Completion approval is not in progress.']);
  }

  try {
    await dependencies.updateApproval(latestCompletionApproval.id, {
      statusCode: APPROVAL_STATUS_COMPLETED,
      approveOn: getNow(),
    });
    return createSuccessResult({ planId: context.plan.id, completionApprovalId: latestCompletionApproval.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function completeChecklist(
  context: TransitionContext,
  checklist: ChecklistVm,
  questions: QuestionVm[],
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  if (checklist.statusCode === CHECKLIST_STATUS_COMPLETE) {
    return createSuccessResult({ checklistId: checklist.id });
  }

  const errors = getChecklistCompleteErrors(questions, context.deficiencies, checklist.id);
  if (errors.length > 0) {
    return createFailureResult(errors);
  }

  try {
    await dependencies.updateChecklist(checklist.id, { statusCode: CHECKLIST_STATUS_COMPLETE });
    return createSuccessResult({ checklistId: checklist.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}

export async function closeDeficiency(
  context: TransitionContext,
  deficiency: DeficiencyVm,
  closingComment: string,
  dependencies: TransitionDependencies,
): Promise<LifecycleResult> {
  if (deficiency.statusCode === DEFICIENCY_STATUS_CLOSED) {
    return createSuccessResult({ deficiencyId: deficiency.id });
  }

  if (!closingComment.trim()) {
    return createFailureResult(['A closing comment is required.']);
  }

  if (isPlanFinalized(context.approvals)) {
    return createFailureResult(['Deficiencies cannot be edited after final sign off.']);
  }

  try {
    await dependencies.updateDeficiency(deficiency.id, {
      statusCode: DEFICIENCY_STATUS_CLOSED,
      closeoutComment: closingComment.trim(),
      closedOn: getNow(),
      closedById: getActorUserId(context.currentUser),
    });
    return createSuccessResult({ deficiencyId: deficiency.id });
  } catch (error) {
    return mapTransitionError(error);
  }
}