import type { ApprovalVm, ChecklistVm, CurrentUserProfileVm, DeficiencyVm, PlanVm, QuestionVm, TeamMemberVm } from './types';

export const PLAN_STAGE_DRAFT = 507650000;
export const PLAN_STAGE_PLAN = 507650001;
export const PLAN_STAGE_EXECUTION = 507650002;
export const PLAN_STAGE_APPROVAL = 507650003;
export const PLAN_STAGE_COMPLETION = 507650004;

export const CHECKLIST_STATUS_NOT_STARTED = 507650000;
export const CHECKLIST_STATUS_IN_PROGRESS = 507650001;
export const CHECKLIST_STATUS_COMPLETE = 507650002;

export const QUESTION_RESPONSE_YES = 507650000;
export const QUESTION_RESPONSE_NO = 507650001;
export const QUESTION_RESPONSE_NA = 507650002;

export const DEFICIENCY_STATUS_OPEN = 507650000;
export const DEFICIENCY_STATUS_IN_PROGRESS = 507650001;
export const DEFICIENCY_STATUS_CLOSED = 507650002;

export const DEFICIENCY_CATEGORY_A = 507650000;

export const APPROVAL_STATUS_APPROVED = 507650000;
export const APPROVAL_STATUS_REJECTED = 507650001;
export const APPROVAL_STATUS_COMPLETED = 507650002;

export const PLAN_APPROVAL_REQUEST_COMMENT = 'Awaiting PSSR-Lead approval.';

export const TEAM_ROLE_PSSR_LEAD = 507650000;
export const TEAM_ROLE_PU_LEAD = 507650001;

export type LifecycleIssue = {
  code: string;
  message: string;
};

export type LifecycleResult = {
  success: boolean;
  errors: LifecycleIssue[];
  warnings: LifecycleIssue[];
  updatedIds: Record<string, string | undefined>;
};

export type LifecycleCommandState = {
  visible: boolean;
  enabled: boolean;
  reasons: string[];
};

function sortByModifiedOnDescending<T extends { modifiedOn?: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftValue = left.modifiedOn ? Date.parse(left.modifiedOn) : 0;
    const rightValue = right.modifiedOn ? Date.parse(right.modifiedOn) : 0;
    return rightValue - leftValue;
  });
}

function normalizeComment(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function isTerminalApprovalStatus(value?: number): boolean {
  return value === APPROVAL_STATUS_APPROVED
    || value === APPROVAL_STATUS_REJECTED
    || value === APPROVAL_STATUS_COMPLETED;
}

export function findLatestApproval(
  approvals: ApprovalVm[],
  stageCode: number,
  roleCode: number,
): ApprovalVm | undefined {
  return sortByModifiedOnDescending(
    approvals.filter((approval) => approval.stageCode === stageCode && approval.roleCode === roleCode),
  )[0];
}

export function findPendingApprovalRequest(
  approvals: ApprovalVm[],
  stageCode: number,
  roleCode: number,
  expectedComment: string,
): ApprovalVm | undefined {
  return sortByModifiedOnDescending(
    approvals.filter((approval) => (
      approval.stageCode === stageCode
      && approval.roleCode === roleCode
      && !isTerminalApprovalStatus(approval.decisionCode)
      && !approval.memberId
      && normalizeComment(approval.comment) === normalizeComment(expectedComment)
    )),
  )[0];
}

export function isApprovalInProgress(approval: ApprovalVm | undefined): approval is ApprovalVm {
  return approval !== undefined && !isTerminalApprovalStatus(approval.decisionCode);
}

export function isPlanApproved(approvals: ApprovalVm[]): boolean {
  return findLatestApproval(approvals, PLAN_STAGE_PLAN, TEAM_ROLE_PSSR_LEAD)?.decisionCode === APPROVAL_STATUS_APPROVED;
}

export function isPlanFinalized(approvals: ApprovalVm[]): boolean {
  return findLatestApproval(approvals, PLAN_STAGE_COMPLETION, TEAM_ROLE_PSSR_LEAD)?.decisionCode === APPROVAL_STATUS_COMPLETED;
}

export function isOriginator(plan: PlanVm, currentUser: CurrentUserProfileVm | undefined): boolean {
  return Boolean(plan.createdById && currentUser?.systemUserId && plan.createdById === currentUser.systemUserId);
}

function normalizeIdentityValue(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function isCurrentUserTeamMember(member: TeamMemberVm, currentUser: CurrentUserProfileVm): boolean {
  const currentUserId = normalizeIdentityValue(currentUser.systemUserId);
  const memberId = normalizeIdentityValue(member.memberId);
  if (currentUserId && memberId && memberId === currentUserId) {
    return true;
  }

  const currentUserName = normalizeIdentityValue(currentUser.fullName);
  const memberName = normalizeIdentityValue(member.name);
  return Boolean(currentUserName && memberName && memberName === currentUserName);
}

export function hasTeamRole(
  teamMembers: TeamMemberVm[],
  currentUser: CurrentUserProfileVm | undefined,
  roleCode: number,
): boolean {
  if (!currentUser) {
    return false;
  }

  return teamMembers.some((member) => member.roleCode === roleCode && isCurrentUserTeamMember(member, currentUser));
}

export function getDraftToPlanErrors(
  checklists: ChecklistVm[],
  teamMembers: TeamMemberVm[],
  plan: PlanVm,
  currentUser: CurrentUserProfileVm | undefined,
): string[] {
  const errors: string[] = [];

  if (!isOriginator(plan, currentUser)) {
    errors.push('Only the plan originator can advance this plan to Plan.');
  }

  if (checklists.length < 1) {
    errors.push('At least one checklist is required.');
  }

  if (!teamMembers.some((member) => member.roleCode === TEAM_ROLE_PSSR_LEAD)) {
    errors.push('A PSSR-Lead team member is required.');
  }

  if (!teamMembers.some((member) => member.roleCode === TEAM_ROLE_PU_LEAD)) {
    errors.push('A PU-Lead team member is required.');
  }

  return errors;
}

export function getExecutionToApprovalErrors(
  checklists: ChecklistVm[],
  deficiencies: DeficiencyVm[],
): string[] {
  const errors: string[] = [];

  if (checklists.some((checklist) => checklist.statusCode !== CHECKLIST_STATUS_COMPLETE)) {
    errors.push('All checklists must be Complete.');
  }

  if (deficiencies.some((deficiency) => deficiency.acceptedCategoryCode === undefined)) {
    errors.push('Every deficiency must have an accepted category.');
  }

  if (deficiencies.some((deficiency) => deficiency.acceptedCategoryCode === DEFICIENCY_CATEGORY_A && deficiency.statusCode !== DEFICIENCY_STATUS_CLOSED)) {
    errors.push('All category A deficiencies must be Closed.');
  }

  return errors;
}

export function getChecklistCompleteErrors(
  questions: QuestionVm[],
  deficiencies: DeficiencyVm[],
  checklistId: string,
): string[] {
  const errors: string[] = [];
  const checklistQuestions = questions.filter((question) => question.checklistId === checklistId);

  if (checklistQuestions.some((question) => question.responseCode === undefined)) {
    errors.push('All questions must have an answer.');
  }

  const noQuestionsMissingDeficiency = checklistQuestions.some((question) => (
    question.responseCode === QUESTION_RESPONSE_NO
    && !deficiencies.some((deficiency) => deficiency.questionId === question.id)
  ));

  if (noQuestionsMissingDeficiency) {
    errors.push('Every question answered No must have at least one linked deficiency.');
  }

  return errors;
}

export function getFinalSignOffErrors(
  deficiencies: DeficiencyVm[],
  teamMembers: TeamMemberVm[],
  currentUser: CurrentUserProfileVm | undefined,
): string[] {
  const errors: string[] = [];

  if (!hasTeamRole(teamMembers, currentUser, TEAM_ROLE_PSSR_LEAD)) {
    errors.push('Only the PSSR-Lead can perform final sign off.');
  }

  if (deficiencies.some((deficiency) => deficiency.statusCode !== DEFICIENCY_STATUS_CLOSED)) {
    errors.push('All deficiencies must be Closed before final sign off.');
  }

  return errors;
}

export function getPlanPhaseCommandState(input: {
  plan: PlanVm;
  approvals: ApprovalVm[];
  checklists: ChecklistVm[];
  deficiencies: DeficiencyVm[];
  teamMembers: TeamMemberVm[];
  currentUser: CurrentUserProfileVm | undefined;
}): {
  advanceToPlan: LifecycleCommandState;
  approve: LifecycleCommandState;
  reject: LifecycleCommandState;
  advanceToApproval: LifecycleCommandState;
  finalSignOff: LifecycleCommandState;
} {
  const { approvals, checklists, currentUser, deficiencies, plan, teamMembers } = input;
  const planApproval = findPendingApprovalRequest(approvals, PLAN_STAGE_PLAN, TEAM_ROLE_PSSR_LEAD, PLAN_APPROVAL_REQUEST_COMMENT);
  const approvalApproval = findLatestApproval(approvals, PLAN_STAGE_APPROVAL, TEAM_ROLE_PU_LEAD);
  const completionApproval = findLatestApproval(approvals, PLAN_STAGE_COMPLETION, TEAM_ROLE_PSSR_LEAD);
  const finalized = isPlanFinalized(approvals);

  const advanceToPlanReasons = plan.stageCode === PLAN_STAGE_DRAFT
    ? getDraftToPlanErrors(checklists, teamMembers, plan, currentUser)
    : ['Plan is not in Draft.'];

  const planApproveReasons: string[] = [];
  if (plan.stageCode !== PLAN_STAGE_PLAN) {
    planApproveReasons.push('Plan is not in the Plan phase.');
  }
  if (!hasTeamRole(teamMembers, currentUser, TEAM_ROLE_PSSR_LEAD)) {
    planApproveReasons.push('Only the PSSR-Lead can approve or reject this phase.');
  }
  if (!isApprovalInProgress(planApproval)) {
    planApproveReasons.push('The latest Plan approval is not in progress.');
  }

  const advanceToApprovalReasons: string[] = [];
  if (plan.stageCode !== PLAN_STAGE_EXECUTION) {
    advanceToApprovalReasons.push('Plan is not in the Execution phase.');
  }
  if (!hasTeamRole(teamMembers, currentUser, TEAM_ROLE_PSSR_LEAD)) {
    advanceToApprovalReasons.push('Only the PSSR-Lead can advance this plan to Approval.');
  }
  advanceToApprovalReasons.push(...getExecutionToApprovalErrors(checklists, deficiencies));

  const approvalReasons: string[] = [];
  if (plan.stageCode !== PLAN_STAGE_APPROVAL) {
    approvalReasons.push('Plan is not in the Approval phase.');
  }
  if (!hasTeamRole(teamMembers, currentUser, TEAM_ROLE_PU_LEAD)) {
    approvalReasons.push('Only the PU-Lead can approve or reject this phase.');
  }
  if (!isApprovalInProgress(approvalApproval)) {
    approvalReasons.push('The latest Approval approval is not in progress.');
  }
  approvalReasons.push(...getExecutionToApprovalErrors(checklists, deficiencies));

  const finalSignOffReasons = finalized
    ? ['Final sign off has already completed.']
    : plan.stageCode !== PLAN_STAGE_COMPLETION
      ? ['Plan is not in the Completion phase.']
      : getFinalSignOffErrors(deficiencies, teamMembers, currentUser);

  return {
    advanceToPlan: {
      visible: plan.stageCode === PLAN_STAGE_DRAFT,
      enabled: advanceToPlanReasons.length === 0,
      reasons: advanceToPlanReasons,
    },
    approve: {
      visible: plan.stageCode === PLAN_STAGE_PLAN || plan.stageCode === PLAN_STAGE_APPROVAL,
      enabled: (plan.stageCode === PLAN_STAGE_PLAN ? planApproveReasons : approvalReasons).length === 0,
      reasons: plan.stageCode === PLAN_STAGE_PLAN ? planApproveReasons : approvalReasons,
    },
    reject: {
      visible: plan.stageCode === PLAN_STAGE_PLAN || plan.stageCode === PLAN_STAGE_APPROVAL,
      enabled: (plan.stageCode === PLAN_STAGE_PLAN ? planApproveReasons : approvalReasons).length === 0,
      reasons: plan.stageCode === PLAN_STAGE_PLAN ? planApproveReasons : approvalReasons,
    },
    advanceToApproval: {
      visible: plan.stageCode === PLAN_STAGE_EXECUTION,
      enabled: advanceToApprovalReasons.length === 0,
      reasons: advanceToApprovalReasons,
    },
    finalSignOff: {
      visible: plan.stageCode === PLAN_STAGE_COMPLETION && completionApproval?.decisionCode !== APPROVAL_STATUS_COMPLETED,
      enabled: finalSignOffReasons.length === 0,
      reasons: finalSignOffReasons,
    },
  };
}

export function isPlanMetadataEditable(plan: PlanVm, approvals: ApprovalVm[]): boolean {
  if (plan.stageCode === PLAN_STAGE_DRAFT) {
    return true;
  }

  if (plan.stageCode === PLAN_STAGE_PLAN) {
    return !isPlanApproved(approvals);
  }

  return false;
}

export function isChecklistStructureEditable(plan: PlanVm, approvals: ApprovalVm[]): boolean {
  return plan.stageCode === PLAN_STAGE_DRAFT || (plan.stageCode === PLAN_STAGE_PLAN && !isPlanApproved(approvals));
}

export function isTeamEditable(plan: PlanVm, approvals: ApprovalVm[]): boolean {
  if (isPlanFinalized(approvals)) {
    return false;
  }

  return plan.stageCode === PLAN_STAGE_DRAFT
    || plan.stageCode === PLAN_STAGE_PLAN
    || plan.stageCode === PLAN_STAGE_EXECUTION;
}

export function isQuestionAnsweringEnabled(
  plan: PlanVm,
  approvals: ApprovalVm[],
  checklist: ChecklistVm,
): boolean {
  if (isPlanFinalized(approvals) || checklist.statusCode === CHECKLIST_STATUS_COMPLETE) {
    return false;
  }

  if (plan.stageCode === PLAN_STAGE_EXECUTION) {
    return true;
  }

  return plan.stageCode === PLAN_STAGE_PLAN && isPlanApproved(approvals);
}

export function canCreateDeficiency(plan: PlanVm, approvals: ApprovalVm[], question: QuestionVm | undefined): boolean {
  return Boolean(
    question
    && question.responseCode === QUESTION_RESPONSE_NO
    && plan.stageCode === PLAN_STAGE_EXECUTION
    && !isPlanFinalized(approvals),
  );
}

export function canEditDeficiency(plan: PlanVm, approvals: ApprovalVm[], deficiency: DeficiencyVm | undefined): boolean {
  if (!deficiency || deficiency.statusCode === DEFICIENCY_STATUS_CLOSED || isPlanFinalized(approvals)) {
    return false;
  }

  return plan.stageCode === PLAN_STAGE_EXECUTION
    || plan.stageCode === PLAN_STAGE_APPROVAL
    || plan.stageCode === PLAN_STAGE_COMPLETION;
}

export function createFailureResult(errors: string[]): LifecycleResult {
  return {
    success: false,
    errors: errors.map((message, index) => ({ code: `guard_${index + 1}`, message })),
    warnings: [],
    updatedIds: {},
  };
}

export function createSuccessResult(updatedIds: Record<string, string | undefined> = {}): LifecycleResult {
  return {
    success: true,
    errors: [],
    warnings: [],
    updatedIds,
  };
}