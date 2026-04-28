export type AppView = 'plans' | 'plan-details' | 'checklist-details' | 'template-library';

export interface CurrentUserProfileVm {
  systemUserId?: string;
  fullName: string;
  userPrincipalName: string;
  roleLabel?: string;
  siteLabel?: string;
}

export interface PlanVm {
  id: string;
  createdById?: string;
  planId: string;
  name: string;
  event?: string;
  siteCode?: number;
  siteLabel?: string;
  typeCode?: number;
  typeLabel?: string;
  stageCode?: number;
  stageLabel?: string;
  system?: string;
  mocName?: string;
  projectName?: string;
  taRevisionName?: string;
  checklistCompletedCount: number;
  checklistTotalCount: number;
  percentComplete: number;
  openDeficiencyCount: number;
}

export interface PlanDetailsDraftVm {
  name: string;
  event: string;
  siteCode?: number;
  stageCode?: number;
  system: string;
}

export interface ChecklistVm {
  id: string;
  checklistId?: string;
  name: string;
  disciplineCode?: number;
  disciplineLabel?: string;
  statusCode?: number;
  statusLabel?: string;
  planId?: string;
  questionCompletedCount: number;
  questionTotalCount: number;
}

export interface QuestionVm {
  id: string;
  checklistId?: string;
  text: string;
  sequenceOrder: number;
  required: boolean;
  responseCode?: number;
  responseLabel?: string;
  comment: string;
}

export interface DeficiencyVm {
  id: string;
  deficiencyId?: string;
  planId?: string;
  checklistId?: string;
  checklistName?: string;
  questionId?: string;
  questionName?: string;
  name: string;
  initialCategoryCode?: number;
  initialCategoryLabel?: string;
  acceptedCategoryCode?: number;
  acceptedCategoryLabel?: string;
  statusCode?: number;
  statusLabel?: string;
  generalComment?: string;
  closeoutComment?: string;
  closedById?: string;
  closedOn?: string;
}

export interface ApprovalVm {
  id: string;
  planId?: string;
  memberId?: string;
  stageCode?: number;
  stageLabel?: string;
  roleCode?: number;
  roleLabel?: string;
  decisionCode?: number;
  decisionLabel?: string;
  approveOn?: string;
  comment?: string;
  modifiedOn?: string;
}

export interface TeamMemberVm {
  id: string;
  memberId?: string;
  name?: string;
  roleCode?: number;
  roleLabel?: string;
  planId?: string;
}

export interface TemplateChecklistVm {
  id: string;
  name: string;
  disciplineCode?: number;
  disciplineLabel?: string;
  siteCode?: number;
  siteLabel?: string;
  description?: string;
  statusLabel: 'Active' | 'Inactive';
  questionCount: number;
}

export interface TemplateQuestionVm {
  id: string;
  templateChecklistId?: string;
  questionText: string;
  sequenceOrder: number;
  isMandatory: boolean;
  siteCode?: number;
}
