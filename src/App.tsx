import {
  Button,
  Caption1,
  Card,
  Combobox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  Divider,
  Dropdown,
  Field,
  FluentProvider,
  Input,
  Link,
  Option,
  Spinner,
  Text,
  Textarea,
  Title2,
  makeStyles,
  mergeClasses,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';
import { getContext } from '@microsoft/power-apps/app';
import { Add24Regular, ArrowCircleRight16Regular, Briefcase16Regular, Building16Regular, CheckmarkCircle16Regular, ChevronDown16Regular, ChevronRight12Regular, ClipboardTask16Regular, Delete24Regular, DocumentMultiple24Regular, Home24Regular, Save24Regular, Wrench16Regular } from '@fluentui/react-icons';
import { Fragment, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createApproval,
  copyTemplatesToPlan,
  createTeamMember,
  createTemplateChecklist,
  createTemplateQuestion,
  createDeficiency,
  getCurrentUserProfile,
  getMocLookupOptions,
  createPlan,
  deleteTemplateChecklist,
  deleteTemplateQuestion,
  getApprovalsByPlan,
  getChecklistQuestions,
  getDeficienciesByPlan,
  getPlanChecklists,
  getPlans,
  getProjectLookupOptions,
  getTaRevisionLookupOptions,
  getTeamByPlan,
  getUserLookupOptions,
  getTemplateChecklists,
  getTemplateQuestions,
  optionSets,
  resequenceTemplateQuestions,
  type PlanLookupOptionVm,
  updateTemplateChecklist,
  updateTemplateQuestion,
  updateApproval,
  updateDeficiency,
  updateChecklist,
  updatePlan,
  updateQuestionResponse,
} from './app/dataverseRepository';
import {
  APPROVAL_STATUS_APPROVED,
  CHECKLIST_STATUS_COMPLETE,
  canCreateDeficiency,
  canEditDeficiency,
  DEFICIENCY_STATUS_IN_PROGRESS,
  findLatestApproval,
  getChecklistCompleteErrors,
  getPlanPhaseCommandState,
  isChecklistStructureEditable,
  isPlanApproved,
  isPlanFinalized,
  isPlanMetadataEditable,
  isQuestionAnsweringEnabled,
  isTeamEditable,
  PLAN_STAGE_DRAFT,
  PLAN_STAGE_APPROVAL,
  PLAN_STAGE_COMPLETION,
  PLAN_STAGE_PLAN,
  TEAM_ROLE_PSSR_LEAD,
} from './app/lifecycle';
import {
  advanceDraftToPlan,
  advanceExecutionToApproval,
  approveApprovalStage,
  approvePlanStage,
  closeDeficiency,
  completeChecklist,
  finalSignOff,
  rejectApprovalStage,
  rejectPlanStage,
  triggerExecutionPhase as runExecutionTransition,
} from './app/lifecycleTransitions';
import { t } from './app/i18n';
import { getDeficiencyStatusTone } from './app/semanticColors';
import { type ChecklistDetailsTab, type AppRouteTab, type PlanDetailsTab, parseHashRoute, updateHashRoute } from './app/router';
import { trackError, trackFlow, trackView } from './app/telemetry';
import type {
  AppView,
  ApprovalVm,
  ChecklistVm,
  CurrentUserProfileVm,
  DeficiencyVm,
  PlanDetailsDraftVm,
  PlanVm,
  QuestionVm,
  TeamMemberVm,
  TemplateChecklistVm,
  TemplateQuestionVm,
} from './app/types';
import { ModalHeader, ResponsiveButton, StatusChip } from './components/ui';
import './index.css';

const PlansScreen = lazy(() => import('./screens/PlansScreen'));
const PlanDetailsScreen = lazy(() => import('./screens/PlanDetailsScreen'));
const ChecklistDetailsScreen = lazy(() => import('./screens/ChecklistDetailsScreen'));
const TemplateLibraryScreen = lazy(() => import('./screens/TemplateLibraryScreen'));

const MOBILE_BREADCRUMB_QUERY = '(max-width: 700px)';

function getIsMobileBreadcrumbLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_BREADCRUMB_QUERY).matches;
}

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    height: '100dvh',
    backgroundImage: 'linear-gradient(160deg, #f8fbf8 0%, #f3f8fc 60%, #eef4f9 100%)',
    color: tokens.colorNeutralForeground1,
    overflow: 'hidden',
  },
  appShell: {
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
  },
  appHeader: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL}`,
    backgroundColor: '#0f2f3e',
    color: '#f6fbfd',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 860px)': {
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
      alignItems: 'center',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gridTemplateRows: 'auto',
      rowGap: 0,
    },
  },
  appHeaderBrand: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
    '@media (max-width: 860px)': {
      gridColumn: '1',
      gridRow: '1',
      alignSelf: 'center',
    },
  },
  appHeaderTitleGroup: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  appHeaderScreenTitle: {
    color: '#ffffff',
    '@media (max-width: 860px)': {
      lineHeight: tokens.lineHeightBase500,
    },
  },
  appHeaderScreenSubtitle: {
    color: '#d8ebf4',
    '@media (max-width: 860px)': {
      display: 'block',
      lineHeight: tokens.lineHeightBase200,
    },
  },
  appHeaderUser: {
    display: 'grid',
    gridTemplateColumns: '40px minmax(0, 1fr)',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    minWidth: '180px',
    position: 'relative',
    textAlign: 'right',
    justifySelf: 'end',
    '@media (max-width: 860px)': {
      gridColumn: '2',
      gridRow: '1',
      width: 'auto',
      minWidth: '0',
      justifySelf: 'end',
      alignSelf: 'center',
      gridTemplateColumns: '40px',
      textAlign: 'left',
    },
  },
  appHeaderUserButton: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    borderRadius: '999px',
    lineHeight: 0,
  },
  appHeaderUserBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#245e78',
    color: '#ffffff',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    border: '1px solid #75b0cb',
  },
  appHeaderUserText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    '@media (max-width: 860px)': {
      display: 'none',
    },
  },
  appHeaderUserName: {
    color: '#ffffff',
    fontWeight: tokens.fontWeightSemibold,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  appHeaderUserUpn: {
    color: '#d8ebf4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '@media (max-width: 860px)': {
      display: 'none',
    },
  },
  appHeaderUserMeta: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    '@media (max-width: 860px)': {
      justifyContent: 'flex-start',
    },
  },
  appHeaderUserMetaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#173c4d',
    color: '#e8f5fb',
    maxWidth: '100%',
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    borderRadius: '999px',
    border: 'none',
    boxShadow: 'none',
  },
  appHeaderUserMetaText: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    lineHeight: tokens.lineHeightBase200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  appHeaderUserMobilePanel: {
    display: 'none',
    '@media (max-width: 860px)': {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      display: 'grid',
      gap: tokens.spacingVerticalS,
      minWidth: '220px',
      maxWidth: 'min(280px, calc(100vw - 32px))',
      padding: tokens.spacingHorizontalM,
      backgroundColor: '#163847',
      borderRadius: tokens.borderRadiusLarge,
      boxShadow: tokens.shadow16,
      border: '1px solid #2b6178',
      zIndex: 2,
    },
  },
  appHeaderUserMobileEmail: {
    color: '#d8ebf4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  appHeaderUserMobileMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  appHeaderTitleRow: {
    display: 'block',
  },
  appHeaderNav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
    justifySelf: 'center',
    justifyContent: 'center',
    '@media (max-width: 860px)': {
      display: 'none',
    },
  },
  appHeaderNavDesktop: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
    '@media (max-width: 860px)': {
      display: 'none',
    },
  },
  appHeaderTitleLeft: {
    display: 'flex',
    minWidth: 0,
  },
  appHeaderNavButton: {
    color: '#e8f5fb',
    backgroundColor: 'transparent',
    border: `1px solid ${tokens.colorTransparentStroke}`,
    ':hover': {
      backgroundColor: '#184457',
    },
  },
  mobileBottomBar: {
    display: 'none',
    '@media (max-width: 860px)': {
      display: 'flex',
      justifyContent: 'center',
      gap: tokens.spacingHorizontalM,
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
      backgroundColor: '#0f2f3e',
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    },
  },
  mobileBottomBarInner: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  mobileBottomBarButton: {
    width: '48px',
    minWidth: '48px',
    height: '48px',
    color: '#e8f5fb',
    backgroundColor: 'transparent',
    border: `1px solid ${tokens.colorTransparentStroke}`,
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#184457',
    },
  },
  appHeaderNavButtonActive: {
    backgroundColor: '#245e78',
    border: '1px solid #75b0cb',
    color: '#ffffff',
  },
  appHeaderNavLabel: {
    '@media (max-width: 860px)': {
      display: 'none',
    },
  },
  appBanner: {
    margin: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXL} 0`,
    '@media (max-width: 700px)': {
      margin: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM} 0`,
    },
  },
  main: {
    padding: tokens.spacingHorizontalXL,
    display: 'grid',
    gap: tokens.spacingVerticalL,
    alignContent: 'start',
    minHeight: 0,
    overflowY: 'auto',
    '@media (max-width: 700px)': {
      padding: tokens.spacingHorizontalM,
    },
  },
  mainDetail: {
    gridTemplateRows: 'auto minmax(0, 1fr)',
    alignContent: 'stretch',
  },
  mainLocked: {
    overflow: 'hidden',
  },
  topBar: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: '#fdfefe',
    boxShadow: tokens.shadow4,
  },
  topBarText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  breadcrumbNav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    flex: '1 1 auto',
    minWidth: 0,
    '@media (max-width: 700px)': {
      flexWrap: 'nowrap',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  breadcrumbRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'nowrap',
    minWidth: 0,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalS,
    },
  },
  breadcrumbLifecycleButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginLeft: 'auto',
    flexShrink: 0,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusCircular,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    '@media (max-width: 700px)': {
      width: 'auto',
      maxWidth: '50%',
      justifyContent: 'space-between',
      justifySelf: 'auto',
      marginLeft: 0,
      overflow: 'hidden',
      paddingLeft: tokens.spacingHorizontalS,
      paddingRight: tokens.spacingHorizontalS,
    },
  },
  breadcrumbLifecycleIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  breadcrumbLifecycleLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    minWidth: 0,
    '@media (max-width: 700px)': {
      flex: '0 1 auto',
      justifyContent: 'space-between',
      width: 'auto',
    },
  },
  breadcrumbLifecycleText: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  breadcrumbLink: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  breadcrumbActive: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  breadcrumbSeparator: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  headerSubtitle: {
    color: tokens.colorNeutralForeground3,
  },
  controlsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    alignItems: 'end',
  },
  modalFields: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
  },
  templatePickerLayout: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    gridTemplateRows: 'auto auto auto auto minmax(0, 1fr) auto auto',
    minHeight: 0,
  },
  templatePickerMeta: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
  },
  deficiencyEditorLayout: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    minHeight: 0,
  },
  deficiencyCategoryRow: {
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingVerticalM,
    },
  },
  deficiencyList: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    maxHeight: 'min(46vh, 420px)',
    overflowY: 'auto',
    paddingRight: tokens.spacingHorizontalXS,
  },
  deficiencyListCard: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    ':hover': {
      border: `1px solid ${tokens.colorBrandStroke1}`,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  deficiencyListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  deficiencyListMeta: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  deficiencyEditorActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  templateQuestionPanel: {
    minHeight: 0,
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingHorizontalM,
  },
  templateQuestionList: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    maxHeight: 'min(30vh, 360px)',
    overflowY: 'auto',
    paddingRight: tokens.spacingHorizontalXS,
  },
  templateQuestionCard: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusLarge,
  },
  templateQuestionTitle: {
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  floatingEditorHost: {
    position: 'fixed',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    pointerEvents: 'none',
    padding: tokens.spacingHorizontalXL,
    zIndex: 30,
    '@media (max-width: 700px)': {
      padding: tokens.spacingHorizontalM,
      alignItems: 'start',
      overflowY: 'auto',
    },
  },
  floatingEditorCard: {
    width: 'min(760px, calc(100vw - 32px))',
    maxHeight: 'min(78vh, 760px)',
    overflow: 'hidden',
    boxShadow: tokens.shadow64,
    pointerEvents: 'auto',
    '@media (max-width: 700px)': {
      width: '100%',
      marginTop: tokens.spacingVerticalXL,
      maxHeight: 'none',
    },
  },
  unsavedResponsesPopout: {
    width: 'min(520px, calc(100vw - 32px))',
    pointerEvents: 'auto',
    boxShadow: tokens.shadow64,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 700px)': {
      width: '100%',
      marginTop: tokens.spacingVerticalXL,
    },
  },
  unsavedResponsesBody: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
  },
  unsavedResponsesActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  helperText: {
    color: tokens.colorNeutralForeground3,
  },
  viewFallback: {
    minHeight: '220px',
    display: 'grid',
    placeItems: 'center',
  },
});

type DeficiencyDraft = {
  id?: string;
  name: string;
  initialCategoryCode?: number;
  acceptedCategoryCode?: number;
  statusCode?: number;
  generalComment?: string;
};

type TemplateChecklistDraft = {
  id?: string;
  name: string;
  disciplineCode?: number;
  siteCode?: number;
  duplicateSourceTemplateId?: string;
};

type TemplateQuestionDraft = {
  id?: string;
  questionText: string;
  sequenceOrder: number;
  isMandatory: boolean;
  siteCode?: number;
};

type TeamMemberDraft = {
  memberId?: string;
  memberName: string;
  roleCode?: number;
};

type HeaderBreadcrumb = {
  key: string;
  label: string;
  onClick?: () => void;
};

function getChecklistHeaderIcon(statusLabel: string | undefined) {
  const normalized = statusLabel?.toLowerCase() ?? '';

  if (normalized.includes('complete')) {
    return <CheckmarkCircle16Regular />;
  }

  if (normalized.includes('progress')) {
    return <Wrench16Regular />;
  }

  if (normalized.includes('start') || normalized.includes('draft') || normalized.includes('new')) {
    return <ClipboardTask16Regular />;
  }

  return <ArrowCircleRight16Regular />;
}

function getPlanHeaderIcon(stageLabel: string | undefined) {
  return getChecklistHeaderIcon(stageLabel);
}

type DeficiencyPopoutMode = 'editor' | 'list';

const PLAN_TYPE_CODES = {
  moc: 507650000,
  turnaround: 507650001,
  project: 507650002,
} as const;

function enumOptions(record: Record<number, string>): Array<{ key: number; label: string }> {
  return Object.entries(record).map(([key, label]) => ({ key: Number(key), label }));
}

function getInitials(name: string | undefined): string {
  const segments = (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (segments.length === 0) {
    return '?';
  }

  return segments
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('');
}

function formatRoleLabel(roleLabel: string | undefined): string {
  const value = roleLabel?.trim();
  if (!value) {
    return 'Role unavailable';
  }

  return value.replace(/_/g, ' ');
}

type QuestionResponseSnapshot = Record<string, number | undefined>;

function createQuestionResponseSnapshot(items: QuestionVm[]): QuestionResponseSnapshot {
  return items.reduce<QuestionResponseSnapshot>((snapshot, item) => {
    snapshot[item.id] = item.responseCode;
    return snapshot;
  }, {});
}

function createPlanDetailsDraft(plan?: PlanVm): PlanDetailsDraftVm {
  return {
    name: plan?.name ?? '',
    event: plan?.event ?? '',
    siteCode: plan?.siteCode,
    stageCode: plan?.stageCode,
    system: plan?.system ?? '',
  };
}

function createTemplateChecklistDraft(template?: TemplateChecklistVm): TemplateChecklistDraft {
  return {
    id: template?.id,
    name: template?.name ?? '',
    disciplineCode: template?.disciplineCode,
    siteCode: template?.siteCode,
    duplicateSourceTemplateId: undefined,
  };
}

function createTemplateQuestionDraft(
  question?: TemplateQuestionVm,
  defaults?: { sequenceOrder?: number; siteCode?: number },
): TemplateQuestionDraft {
  return {
    id: question?.id,
    questionText: question?.questionText ?? '',
    sequenceOrder: question?.sequenceOrder ?? defaults?.sequenceOrder ?? 1,
    isMandatory: question?.isMandatory ?? true,
    siteCode: question?.siteCode ?? defaults?.siteCode,
  };
}

function createTeamMemberDraft(): TeamMemberDraft {
  return {
    memberName: '',
    roleCode: undefined,
  };
}

function moveQuestionIdToSequence(
  questions: TemplateQuestionVm[],
  questionId: string,
  requestedSequenceOrder: number,
): string[] {
  const orderedIds = [...questions]
    .sort((left, right) => left.sequenceOrder - right.sequenceOrder)
    .map((question) => question.id)
    .filter((id) => id !== questionId);

  const nextIndex = Math.max(0, Math.min(requestedSequenceOrder - 1, orderedIds.length));
  orderedIds.splice(nextIndex, 0, questionId);
  return orderedIds;
}

function hasTemplateAccess(): boolean {
  return true;
}

function isStandaloneLocalhostSession(): boolean {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasPowerAppsReferrer = /apps\.(powerapps\.com|preprod\.powerapps\.com|test\.powerapps\.com|preview\.powerapps\.com|gov\.powerapps\.us|high\.powerapps\.us|powerapps\.cn)/i.test(document.referrer);
  return isLocalhost && !hasPowerAppsReferrer;
}

type PowerConfig = {
  environmentId?: string;
  region?: string;
};

function getPowerAppsHost(region?: string): string {
  switch ((region ?? 'prod').toLowerCase()) {
    case 'tip1':
      return 'https://apps.preprod.powerapps.com';
    case 'tip2':
      return 'https://apps.test.powerapps.com';
    case 'tip3':
      return 'https://apps.preview.powerapps.com';
    case 'usgov':
      return 'https://apps.gov.powerapps.us';
    case 'dod':
      return 'https://apps.high.powerapps.us';
    case 'mooncake':
      return 'https://apps.powerapps.cn';
    default:
      return 'https://apps.powerapps.com';
  }
}

async function maybeRedirectToLocalPlay(): Promise<boolean> {
  if (!isStandaloneLocalhostSession()) {
    return false;
  }

  try {
    const response = await fetch('/__vite_powerapps_plugin__/power.config.json', { cache: 'no-store' });
    if (!response.ok) {
      return false;
    }

    const powerConfig = await response.json() as PowerConfig;
    if (!powerConfig.environmentId) {
      return false;
    }

    const baseHost = getPowerAppsHost(powerConfig.region);
    const localAppUrl = `${window.location.origin}/`;
    const localConnectionUrl = `${window.location.origin}/__vite_powerapps_plugin__/power.config.json`;
    const playUrl = `${baseHost}/play/e/${powerConfig.environmentId}/a/local?_localAppUrl=${encodeURIComponent(localAppUrl)}&_localConnectionUrl=${encodeURIComponent(localConnectionUrl)}`;

    window.location.replace(playUrl);
    return true;
  } catch {
    return false;
  }
}

function mapInitializationError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes('timed out loading') && isStandaloneLocalhostSession()) {
    return 'Dataverse context is not available on standalone localhost. Open the Local Play URL printed in the dev terminal (https://apps.powerapps.com/play/.../a/local?...).';
  }
  return message;
}

async function delayAsync(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const GALLERY_RETRY_DELAYS_MS = [0, 400, 1200, 2400] as const;

async function loadGalleryWithRetry<T>(
  loader: () => Promise<T>,
  shouldStop: (value: T) => boolean = () => true,
): Promise<T> {
  let latest: T | undefined;
  let lastError: unknown;

  for (const delay of GALLERY_RETRY_DELAYS_MS) {
    if (delay > 0) {
      await delayAsync(delay);
    }

    try {
      const next = await loader();
      latest = next;
      if (shouldStop(next)) {
        return next;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (latest !== undefined) {
    return latest;
  }

  throw lastError ?? new Error('Failed to load gallery records.');
}

export default function App() {
  const styles = useStyles();
  const routeSyncRef = useRef<boolean>(false);
  const initialRouteAppliedRef = useRef<boolean>(false);

  const [view, setView] = useState<AppView>('plans');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<CurrentUserProfileVm>();
  const [isMobileUserDetailsOpen, setIsMobileUserDetailsOpen] = useState<boolean>(false);

  const [plans, setPlans] = useState<PlanVm[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [siteFilter, setSiteFilter] = useState<number | undefined>();
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [phaseFilter, setPhaseFilter] = useState<number | undefined>();

  const [selectedPlan, setSelectedPlan] = useState<PlanVm>();
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistVm>();

  const [planTab, setPlanTab] = useState<PlanDetailsTab>('checklists');
  const [checklistTab, setChecklistTab] = useState<ChecklistDetailsTab>('questions');
  const [planDetailsDraft, setPlanDetailsDraft] = useState<PlanDetailsDraftVm>(createPlanDetailsDraft());
  const [checklists, setChecklists] = useState<ChecklistVm[]>([]);
  const [questions, setQuestions] = useState<QuestionVm[]>([]);
  const [savedQuestionResponses, setSavedQuestionResponses] = useState<QuestionResponseSnapshot>({});
  const [isSavingQuestionResponses, setIsSavingQuestionResponses] = useState<boolean>(false);
  const [isPendingQuestionDialogOpen, setIsPendingQuestionDialogOpen] = useState<boolean>(false);
  const [deficiencies, setDeficiencies] = useState<DeficiencyVm[]>([]);
  const [approvals, setApprovals] = useState<ApprovalVm[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberVm[]>([]);
  const [isTeamMemberOpen, setIsTeamMemberOpen] = useState<boolean>(false);
  const [teamMemberDraft, setTeamMemberDraft] = useState<TeamMemberDraft>(createTeamMemberDraft());
  const [userLookupOptions, setUserLookupOptions] = useState<PlanLookupOptionVm[]>([]);
  const [userLookupLoading, setUserLookupLoading] = useState<boolean>(false);

  const [templateRows, setTemplateRows] = useState<TemplateChecklistVm[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [templateQuestions, setTemplateQuestions] = useState<TemplateQuestionVm[]>([]);
  const [templateQuestionsLoading, setTemplateQuestionsLoading] = useState<boolean>(false);
  const [templateQuestionsError, setTemplateQuestionsError] = useState<string>('');
  const [isTemplateChecklistOpen, setIsTemplateChecklistOpen] = useState<boolean>(false);
  const [templateChecklistDraft, setTemplateChecklistDraft] = useState<TemplateChecklistDraft>(createTemplateChecklistDraft());
  const [isTemplateQuestionOpen, setIsTemplateQuestionOpen] = useState<boolean>(false);
  const [templateQuestionDraft, setTemplateQuestionDraft] = useState<TemplateQuestionDraft>(createTemplateQuestionDraft());
  const [isChecklistTemplatePickerOpen, setIsChecklistTemplatePickerOpen] = useState<boolean>(false);
  const [isPlanSummaryExpanded, setIsPlanSummaryExpanded] = useState<boolean>(() => !getIsMobileBreadcrumbLayout());
  const [isChecklistSummaryExpanded, setIsChecklistSummaryExpanded] = useState<boolean>(() => !getIsMobileBreadcrumbLayout());

  const [isDeficiencyOpen, setIsDeficiencyOpen] = useState<boolean>(false);
  const [deficiencyPopoutMode, setDeficiencyPopoutMode] = useState<DeficiencyPopoutMode>('editor');
  const [deficiencyQuestionId, setDeficiencyQuestionId] = useState<string>('');
  const [deficiencyChecklistId, setDeficiencyChecklistId] = useState<string>('');
  const [isDeficiencyCloseDialogOpen, setIsDeficiencyCloseDialogOpen] = useState<boolean>(false);
  const [deficiencyCloseComment, setDeficiencyCloseComment] = useState<string>('');
  const [deficiencyDraft, setDeficiencyDraft] = useState<DeficiencyDraft>({
    name: '',
    initialCategoryCode: 507650001,
    acceptedCategoryCode: undefined,
    statusCode: 507650000,
    generalComment: '',
  });

  const [planDraft, setPlanDraft] = useState({
    name: '',
    event: '',
    system: '',
    siteCode: 507650000,
    typeCode: 507650000,
    stageCode: 507650000,
    mocId: undefined as string | undefined,
    projectId: undefined as string | undefined,
    taRevisionId: undefined as string | undefined,
  });
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState<boolean>(false);
  const [mocLookupOptions, setMocLookupOptions] = useState<PlanLookupOptionVm[]>([]);
  const [projectLookupOptions, setProjectLookupOptions] = useState<PlanLookupOptionVm[]>([]);
  const [taRevisionLookupOptions, setTaRevisionLookupOptions] = useState<PlanLookupOptionVm[]>([]);
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);

  const pendingQuestionNavigationRef = useRef<(() => Promise<void> | void) | null>(null);

  const siteOptions = useMemo(() => enumOptions(optionSets.planSite), []);
  const stageOptions = useMemo(() => enumOptions(optionSets.planStage), []);
  const teamRoleOptions = useMemo(() => enumOptions(optionSets.teamRole), []);
  const typeOptions = useMemo(() => enumOptions(optionSets.planType), []);
  const templateDisciplineOptions = useMemo(() => enumOptions(optionSets.templateDiscipline), []);
  const templateSiteOptions = useMemo(() => enumOptions(optionSets.templateSite), []);
  const templateQuestionSiteOptions = useMemo(() => enumOptions(optionSets.templateQuestionSite), []);
  const responseOptions = useMemo(() => enumOptions(optionSets.questionResponse), []);
  const deficiencyStatusOptions = useMemo(() => enumOptions(optionSets.deficiencyStatus), []);
  const deficiencyCategoryOptions = useMemo(() => enumOptions(optionSets.deficiencyCategory), []);
  const isAcceptedCategoryEnabled = deficiencyDraft.statusCode === DEFICIENCY_STATUS_IN_PROGRESS;

  const hasPlanDetailsChanges = selectedPlan !== undefined && (
    selectedPlan.name !== planDetailsDraft.name
    || (selectedPlan.event ?? '') !== planDetailsDraft.event
    || selectedPlan.siteCode !== planDetailsDraft.siteCode
    || selectedPlan.stageCode !== planDetailsDraft.stageCode
    || (selectedPlan.system ?? '') !== planDetailsDraft.system
  );
  const pendingQuestionResponseCount = useMemo(
    () => questions.filter((question) => savedQuestionResponses[question.id] !== question.responseCode).length,
    [questions, savedQuestionResponses],
  );
  const hasPendingQuestionChanges = view === 'checklist-details' && pendingQuestionResponseCount > 0;
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const siteMatch = siteFilter === undefined || plan.siteCode === siteFilter;
      const typeMatch = typeFilter === undefined || plan.typeCode === typeFilter;
      const phaseMatch = phaseFilter === undefined || plan.stageCode === phaseFilter;
      const query = searchText.trim().toLowerCase();
      const queryMatch = query.length === 0
        || plan.name.toLowerCase().includes(query)
        || (plan.event ?? '').toLowerCase().includes(query)
        || (plan.system ?? '').toLowerCase().includes(query)
        || (plan.mocName ?? '').toLowerCase().includes(query)
        || (plan.projectName ?? '').toLowerCase().includes(query)
        || (plan.taRevisionName ?? '').toLowerCase().includes(query);
      return siteMatch && typeMatch && phaseMatch && queryMatch;
    });
  }, [phaseFilter, plans, searchText, siteFilter, typeFilter]);
  const selectedTemplate = useMemo(
    () => templateRows.find((item) => item.id === selectedTemplateId),
    [selectedTemplateId, templateRows],
  );
  const associatedQuestionDeficiencies = useMemo(
    () => deficiencyQuestionId
      ? deficiencies.filter((item) => item.questionId === deficiencyQuestionId)
      : [],
    [deficiencies, deficiencyQuestionId],
  );
  const activeDeficiencyQuestion = useMemo(
    () => questions.find((item) => item.id === deficiencyQuestionId),
    [deficiencyQuestionId, questions],
  );
  const activeDeficiencyRecord = useMemo(
    () => deficiencies.find((item) => item.id === deficiencyDraft.id),
    [deficiencies, deficiencyDraft.id],
  );
  const selectedPlanLifecycleContext = useMemo(() => {
    if (!selectedPlan) {
      return undefined;
    }

    return {
      plan: selectedPlan,
      approvals,
      checklists,
      deficiencies,
      teamMembers,
      currentUser,
    };
  }, [approvals, checklists, currentUser, deficiencies, selectedPlan, teamMembers]);
  const lifecycleDependencies = useMemo(() => ({
    updatePlan,
    updateChecklist,
    createApproval,
    updateApproval,
    updateDeficiency,
  }), []);
  const isPlanEditable = selectedPlan ? isPlanMetadataEditable(selectedPlan, approvals) : false;
  const canManageChecklistStructure = selectedPlan ? isChecklistStructureEditable(selectedPlan, approvals) : false;
  const canManageTeam = selectedPlan ? isTeamEditable(selectedPlan, approvals) : false;
  const isQuestionEditingEnabled = selectedPlan && selectedChecklist
    ? isQuestionAnsweringEnabled(selectedPlan, approvals, selectedChecklist)
    : false;
  const canCreateDeficiencyForActiveQuestion = selectedPlan && activeDeficiencyQuestion
    ? canCreateDeficiency(selectedPlan, approvals, activeDeficiencyQuestion)
    : false;
  const isActiveDeficiencyEditable = selectedPlan && activeDeficiencyRecord
    ? canEditDeficiency(selectedPlan, approvals, activeDeficiencyRecord)
    : false;
  const isDeficiencyDraftEditable = deficiencyDraft.id ? isActiveDeficiencyEditable : canCreateDeficiencyForActiveQuestion;
  const questionAnsweringTitle = useMemo(() => {
    if (!selectedPlan || !selectedChecklist) {
      return undefined;
    }

    if (selectedChecklist.statusCode === CHECKLIST_STATUS_COMPLETE) {
      return 'Question answers are locked after the checklist is Complete.';
    }

    if (isPlanFinalized(approvals)) {
      return 'All records are locked after final sign off.';
    }

    if (selectedPlan.stageCode === PLAN_STAGE_DRAFT || (selectedPlan.stageCode === PLAN_STAGE_PLAN && !isPlanApproved(approvals))) {
      return 'Question answering is locked until the Plan phase has been approved.';
    }

    if (selectedPlan.stageCode === PLAN_STAGE_APPROVAL || selectedPlan.stageCode === PLAN_STAGE_COMPLETION) {
      return 'Question answering is locked outside of the approved Plan and Execution phases.';
    }

    return undefined;
  }, [approvals, selectedChecklist, selectedPlan]);
  const checklistCompleteReasons = useMemo(() => {
    if (!selectedChecklist) {
      return [] as string[];
    }

    return getChecklistCompleteErrors(questions, deficiencies, selectedChecklist.id);
  }, [deficiencies, questions, selectedChecklist]);
  const canCompleteCurrentChecklist = Boolean(
    selectedChecklist
    && selectedChecklist.statusCode !== CHECKLIST_STATUS_COMPLETE
    && checklistCompleteReasons.length === 0
    && isQuestionEditingEnabled,
  );
  const checklistCompleteTitle = selectedChecklist?.statusCode === CHECKLIST_STATUS_COMPLETE
    ? 'Checklist is already Complete.'
    : checklistCompleteReasons.length > 0
      ? checklistCompleteReasons.join(' ')
      : !isQuestionEditingEnabled
        ? questionAnsweringTitle
        : undefined;
  const selectedPlanCommandState = selectedPlanLifecycleContext
    ? getPlanPhaseCommandState(selectedPlanLifecycleContext)
    : undefined;
  const planWarningMessages = useMemo(() => {
    if (!selectedPlanCommandState || !selectedPlan) {
      return [] as string[];
    }

    if (selectedPlan.stageCode === PLAN_STAGE_DRAFT) {
      return selectedPlanCommandState.advanceToPlan.enabled ? [] : selectedPlanCommandState.advanceToPlan.reasons;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_PLAN || selectedPlan.stageCode === PLAN_STAGE_APPROVAL) {
      return selectedPlanCommandState.approve.enabled ? [] : selectedPlanCommandState.approve.reasons;
    }

    if (selectedPlan.stageCode === 507650002) {
      return selectedPlanCommandState.advanceToApproval.enabled ? [] : selectedPlanCommandState.advanceToApproval.reasons;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_COMPLETION) {
      return selectedPlanCommandState.finalSignOff.enabled ? [] : selectedPlanCommandState.finalSignOff.reasons;
    }

    return [] as string[];
  }, [selectedPlan, selectedPlanCommandState]);
  const canSaveDeficiency = deficiencyDraft.name.trim().length > 0
    && (deficiencyDraft.generalComment ?? '').trim().length > 0
    && deficiencyDraft.initialCategoryCode !== undefined
    && isDeficiencyDraftEditable;
  const canSaveTeamMember = Boolean(selectedPlan && teamMemberDraft.memberId && teamMemberDraft.roleCode !== undefined);

  useEffect(() => {
    let isCancelled = false;

    const loadCurrentUser = async () => {
      try {
        const context = await getContext();
        if (isCancelled) {
          return;
        }

        const fallbackProfile: CurrentUserProfileVm = {
          fullName: context.user.fullName?.trim() || 'Unknown user',
          userPrincipalName: context.user.userPrincipalName?.trim() || '',
        };

        const userProfile = await getCurrentUserProfile({
          objectId: context.user.objectId,
          userPrincipalName: context.user.userPrincipalName,
          fallbackFullName: fallbackProfile.fullName,
        });

        if (isCancelled) {
          return;
        }

        setCurrentUser(userProfile ?? fallbackProfile);
      } catch (contextError) {
        if (!isCancelled) {
          setCurrentUser({
            fullName: 'User unavailable',
            userPrincipalName: '',
          });
          trackError('app.context.load', contextError);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 861px)');
    const onChange = () => {
      if (mediaQuery.matches) {
        setIsMobileUserDetailsOpen(false);
      }
    };

    onChange();
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    setPlanDetailsDraft(createPlanDetailsDraft(selectedPlan));
  }, [selectedPlan]);

  useEffect(() => {
    if (!isCreatePlanOpen) {
      return;
    }

    let isCancelled = false;

    const loadLookupOptions = async () => {
      try {
        if (planDraft.typeCode === PLAN_TYPE_CODES.moc && mocLookupOptions.length === 0) {
          setLookupLoading(true);
          const rows = await getMocLookupOptions();
          if (!isCancelled) {
            setMocLookupOptions(rows);
          }
        }

        if (planDraft.typeCode === PLAN_TYPE_CODES.project && projectLookupOptions.length === 0) {
          setLookupLoading(true);
          const rows = await getProjectLookupOptions();
          if (!isCancelled) {
            setProjectLookupOptions(rows);
          }
        }

        if (planDraft.typeCode === PLAN_TYPE_CODES.turnaround && taRevisionLookupOptions.length === 0) {
          setLookupLoading(true);
          const rows = await getTaRevisionLookupOptions();
          if (!isCancelled) {
            setTaRevisionLookupOptions(rows);
          }
        }
      } catch (lookupError) {
        if (!isCancelled) {
          setError(lookupError instanceof Error ? lookupError.message : String(lookupError));
          trackError('plan.lookup.load', lookupError, { typeCode: planDraft.typeCode });
        }
      } finally {
        if (!isCancelled) {
          setLookupLoading(false);
        }
      }
    };

    void loadLookupOptions();

    return () => {
      isCancelled = true;
    };
  }, [
    isCreatePlanOpen,
    mocLookupOptions.length,
    planDraft.typeCode,
    projectLookupOptions.length,
    taRevisionLookupOptions.length,
  ]);

  useEffect(() => {
    if (!isTeamMemberOpen || userLookupOptions.length > 0) {
      return;
    }

    let isCancelled = false;

    const loadUserOptions = async () => {
      try {
        setUserLookupLoading(true);
        const rows = await getUserLookupOptions();
        if (!isCancelled) {
          setUserLookupOptions(rows);
        }
      } catch (lookupError) {
        if (!isCancelled) {
          setError(lookupError instanceof Error ? lookupError.message : String(lookupError));
          trackError('team-member.lookup.load', lookupError);
        }
      } finally {
        if (!isCancelled) {
          setUserLookupLoading(false);
        }
      }
    };

    void loadUserOptions();

    return () => {
      isCancelled = true;
    };
  }, [isTeamMemberOpen, userLookupOptions.length]);

  const syncHash = useCallback((nextView: AppView, planId?: string, checklistId?: string, tab?: AppRouteTab, replace = false) => {
    routeSyncRef.current = true;
    updateHashRoute({ view: nextView, planId, checklistId, tab }, replace);
    window.setTimeout(() => {
      routeSyncRef.current = false;
    }, 0);
  }, []);

  const loadPlanChildren = useCallback(async (planId: string) => {
    const [nextChecklists, nextDeficiencies, nextApprovals, nextTeam] = await Promise.all([
      loadGalleryWithRetry(() => getPlanChecklists(planId)),
      loadGalleryWithRetry(() => getDeficienciesByPlan(planId)),
      loadGalleryWithRetry(() => getApprovalsByPlan(planId)),
      loadGalleryWithRetry(() => getTeamByPlan(planId)),
    ]);
    setChecklists(nextChecklists);
    setDeficiencies(nextDeficiencies);
    setApprovals(nextApprovals);
    setTeamMembers(nextTeam);
    return nextChecklists;
  }, []);

  const loadPlans = useCallback(async (): Promise<PlanVm[]> => {
    const next = await getPlans();
    setPlans(next);
    return next;
  }, []);

  const refreshCurrentPlanState = useCallback(async () => {
    if (!selectedPlan) {
      return;
    }

    const latestPlans = await loadPlans();
    const refreshedPlan = latestPlans.find((item) => item.id === selectedPlan.id) ?? selectedPlan;
    setSelectedPlan(refreshedPlan);

    const nextChecklists = await loadPlanChildren(selectedPlan.id);
    if (!selectedChecklist) {
      return;
    }

    const refreshedChecklist = nextChecklists.find((item) => item.id === selectedChecklist.id);
    if (!refreshedChecklist) {
      return;
    }

    setSelectedChecklist(refreshedChecklist);
    const nextQuestions = await loadGalleryWithRetry(() => getChecklistQuestions(refreshedChecklist.id));
    setQuestions(nextQuestions);
    setSavedQuestionResponses(createQuestionResponseSnapshot(nextQuestions));
  }, [loadPlanChildren, loadPlans, selectedChecklist, selectedPlan]);

  const handleLifecycleResult = useCallback(async (result: { success: boolean; errors: Array<{ message: string }> }) => {
    if (!result.success) {
      setError(result.errors.map((item) => item.message).join(' '));
      return false;
    }

    setError('');
    await refreshCurrentPlanState();
    return true;
  }, [refreshCurrentPlanState]);

  const runPlanLifecycleAction = useCallback(async (action: () => Promise<{ success: boolean; errors: Array<{ message: string }> }>) => {
    try {
      setLoading(true);
      const result = await action();
      await handleLifecycleResult(result);
    } finally {
      setLoading(false);
    }
  }, [handleLifecycleResult]);

  const promptForReason = useCallback((label: string): string | undefined => {
    const result = window.prompt(label);
    if (result === null) {
      return undefined;
    }

    const trimmed = result.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, []);

  const onAdvancePlanPhase = useCallback(() => {
    if (!selectedPlanLifecycleContext) {
      return;
    }

    void runPlanLifecycleAction(() => advanceDraftToPlan(selectedPlanLifecycleContext, lifecycleDependencies));
  }, [lifecycleDependencies, runPlanLifecycleAction, selectedPlanLifecycleContext]);

  const onApprovePlanLifecycle = useCallback(() => {
    if (!selectedPlanLifecycleContext || !selectedPlan) {
      return;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_PLAN) {
      void runPlanLifecycleAction(() => approvePlanStage(selectedPlanLifecycleContext, lifecycleDependencies));
      return;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_APPROVAL) {
      void runPlanLifecycleAction(() => approveApprovalStage(selectedPlanLifecycleContext, lifecycleDependencies));
    }
  }, [lifecycleDependencies, runPlanLifecycleAction, selectedPlan, selectedPlanLifecycleContext]);

  const onRejectPlanLifecycle = useCallback(() => {
    if (!selectedPlanLifecycleContext || !selectedPlan) {
      return;
    }

    const reason = promptForReason('Enter the rejection reason.');
    if (!reason) {
      return;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_PLAN) {
      void runPlanLifecycleAction(() => rejectPlanStage(selectedPlanLifecycleContext, reason, lifecycleDependencies));
      return;
    }

    if (selectedPlan.stageCode === PLAN_STAGE_APPROVAL) {
      void runPlanLifecycleAction(() => rejectApprovalStage(selectedPlanLifecycleContext, reason, lifecycleDependencies));
    }
  }, [lifecycleDependencies, promptForReason, runPlanLifecycleAction, selectedPlan, selectedPlanLifecycleContext]);

  const onAdvanceExecutionToApproval = useCallback(() => {
    if (!selectedPlanLifecycleContext) {
      return;
    }

    void runPlanLifecycleAction(() => advanceExecutionToApproval(selectedPlanLifecycleContext, lifecycleDependencies));
  }, [lifecycleDependencies, runPlanLifecycleAction, selectedPlanLifecycleContext]);

  const onFinalSignOff = useCallback(() => {
    if (!selectedPlanLifecycleContext) {
      return;
    }

    void runPlanLifecycleAction(() => finalSignOff(selectedPlanLifecycleContext, lifecycleDependencies));
  }, [lifecycleDependencies, runPlanLifecycleAction, selectedPlanLifecycleContext]);

  const onCompleteChecklist = useCallback(() => {
    if (!selectedPlanLifecycleContext || !selectedChecklist) {
      return;
    }

    void runPlanLifecycleAction(() => completeChecklist(selectedPlanLifecycleContext, selectedChecklist, questions, lifecycleDependencies));
  }, [lifecycleDependencies, questions, runPlanLifecycleAction, selectedChecklist, selectedPlanLifecycleContext]);

  const loadPlansWithStartupRetry = useCallback(async (): Promise<PlanVm[]> => {
    return loadGalleryWithRetry(loadPlans, (next) => next.length > 0);
  }, [loadPlans]);

  const loadTemplates = useCallback(async (): Promise<TemplateChecklistVm[]> => {
    const rows = await getTemplateChecklists();
    setTemplateRows(rows);
    setError('');
    return rows;
  }, []);

  const loadTemplateQuestions = useCallback(async (templateId: string): Promise<TemplateQuestionVm[]> => {
    const rows = await loadGalleryWithRetry(() => getTemplateQuestions(templateId));
    setTemplateQuestions(rows);
    return rows;
  }, []);

  const loadTemplatesWithStartupRetry = useCallback(async (): Promise<TemplateChecklistVm[]> => {
    return loadGalleryWithRetry(loadTemplates, (next) => next.length > 0);
  }, [loadTemplates]);

  const refreshTemplateLibrary = useCallback(async (preferredTemplateId?: string): Promise<TemplateChecklistVm[]> => {
    const rows = await loadTemplates();
    const nextSelectedTemplateId = rows.find((item) => item.id === preferredTemplateId)?.id
      ?? rows.find((item) => item.id === selectedTemplateId)?.id
      ?? rows[0]?.id
      ?? '';
    setSelectedTemplateId(nextSelectedTemplateId);
    if (!nextSelectedTemplateId) {
      setTemplateQuestions([]);
      setTemplateQuestionsError('');
    }
    return rows;
  }, [loadTemplates, selectedTemplateId]);

  const openPlan = useCallback(async (plan: PlanVm, sync = true, replace = false, nextTab: PlanDetailsTab = 'checklists') => {
    setSelectedPlan(plan);
    setSelectedChecklist(undefined);
    setView('plan-details');
    setPlanTab(nextTab);
    setLoading(true);
    setError('');
    try {
      await loadPlanChildren(plan.id);
      if (sync) {
        syncHash('plan-details', plan.id, undefined, nextTab, replace);
      }
    } catch (childError) {
      setError(childError instanceof Error ? childError.message : String(childError));
      trackError('plan.children.load', childError, { planId: plan.id });
    } finally {
      setLoading(false);
    }
  }, [loadPlanChildren, syncHash]);

  const openChecklist = useCallback(async (plan: PlanVm, checklist: ChecklistVm, sync = true, replace = false, nextTab: ChecklistDetailsTab = 'questions') => {
    setSelectedPlan(plan);
    setSelectedChecklist(checklist);
    setView('checklist-details');
    setChecklistTab(nextTab);
    setLoading(true);
    setError('');
    try {
      const rows = await loadGalleryWithRetry(() => getChecklistQuestions(checklist.id));
      setQuestions(rows);
      setSavedQuestionResponses(createQuestionResponseSnapshot(rows));
      if (sync) {
        syncHash('checklist-details', plan.id, checklist.id, nextTab, replace);
      }
    } catch (questionError) {
      setError(questionError instanceof Error ? questionError.message : String(questionError));
      trackError('questions.load', questionError, { checklistId: checklist.id });
    } finally {
      setLoading(false);
    }
  }, [syncHash]);

  const goPlans = useCallback((replace = false) => {
    setError('');
    setView('plans');
    setSelectedChecklist(undefined);
    syncHash('plans', undefined, undefined, undefined, replace);
    // Reload plans behind the scenes when returning home so metrics up to date
    void loadPlans();
  }, [loadPlans, syncHash]);

  const goPlanDetails = useCallback(async (replace = false) => {
    if (!selectedPlan) {
      goPlans(replace);
      return;
    }

    setError('');
    setSelectedChecklist(undefined);
    setView('plan-details');
    setLoading(true);
    try {
      await loadPlanChildren(selectedPlan.id);
      syncHash('plan-details', selectedPlan.id, undefined, planTab, replace);
    } catch (childError) {
      setError(childError instanceof Error ? childError.message : String(childError));
      trackError('plan.children.load', childError, { planId: selectedPlan.id });
    } finally {
      setLoading(false);
    }
  }, [goPlans, loadPlanChildren, planTab, selectedPlan, syncHash]);

  const goTemplateLibrary = useCallback((replace = false) => {
    setError('');
    setView('template-library');
    syncHash('template-library', selectedPlan?.id, undefined, undefined, replace);
  }, [selectedPlan, syncHash]);

  const syncCurrentRoute = useCallback((replace = true) => {
    const routeTab = view === 'plan-details'
      ? planTab
      : view === 'checklist-details'
        ? checklistTab
        : undefined;
    syncHash(view, selectedPlan?.id, selectedChecklist?.id, routeTab, replace);
  }, [checklistTab, planTab, selectedChecklist?.id, selectedPlan?.id, syncHash, view]);

  const promptForPendingQuestionNavigation = useCallback((action: () => Promise<void> | void) => {
    pendingQuestionNavigationRef.current = action;
    setIsPendingQuestionDialogOpen(true);
  }, []);

  const requestQuestionNavigation = useCallback((action: () => Promise<void> | void): boolean => {
    if (!hasPendingQuestionChanges) {
      void action();
      return false;
    }

    promptForPendingQuestionNavigation(action);
    return true;
  }, [hasPendingQuestionChanges, promptForPendingQuestionNavigation]);

  const onStayOnChecklist = useCallback(() => {
    pendingQuestionNavigationRef.current = null;
    setIsPendingQuestionDialogOpen(false);
    syncCurrentRoute(true);
  }, [syncCurrentRoute]);

  const onDiscardQuestionChanges = useCallback(() => {
    setQuestions((current) => current.map((item) => {
      const responseCode = savedQuestionResponses[item.id];
      return {
        ...item,
        responseCode,
        responseLabel: responseCode !== undefined
          ? optionSets.questionResponse[responseCode as keyof typeof optionSets.questionResponse]
          : undefined,
      };
    }));
    setError('');
  }, [savedQuestionResponses]);

  const runPendingQuestionNavigation = useCallback(async () => {
    const action = pendingQuestionNavigationRef.current;
    pendingQuestionNavigationRef.current = null;
    setIsPendingQuestionDialogOpen(false);
    if (action) {
      await action();
    }
  }, []);

  const navigateToParsedRoute = useCallback(async (route: ReturnType<typeof parseHashRoute>) => {
    if (route.view === 'plans') {
      goPlans(true);
      return;
    }

    if (route.view === 'template-library') {
      goTemplateLibrary(true);
      return;
    }

    if (route.view === 'plan-details' && route.planId) {
      const matchedPlan = plans.find((item) => item.id === route.planId);
      if (matchedPlan) {
        await openPlan(matchedPlan, false, true, (route.tab as PlanDetailsTab | undefined) ?? 'checklists');
      }
      return;
    }

    if (route.view === 'checklist-details' && route.planId && route.checklistId) {
      const matchedPlan = plans.find((item) => item.id === route.planId);
      if (!matchedPlan) {
        return;
      }

        await openPlan(matchedPlan, false, true, 'checklists');
      const latestChecklists = await getPlanChecklists(matchedPlan.id);
      const matchedChecklist = latestChecklists.find((item) => item.id === route.checklistId);
      if (matchedChecklist) {
          await openChecklist(matchedPlan, matchedChecklist, false, true, (route.tab as ChecklistDetailsTab | undefined) ?? 'questions');
      }
    }
  }, [goPlans, goTemplateLibrary, openChecklist, openPlan, plans]);

  const onOpenTemplateChecklistModal = useCallback((template?: TemplateChecklistVm) => {
    setError('');
    setTemplateChecklistDraft(createTemplateChecklistDraft(template));
    setIsTemplateChecklistOpen(true);
  }, []);

  const onCloseTemplateChecklistEditor = useCallback(() => {
    setIsTemplateChecklistOpen(false);
    setTemplateChecklistDraft(createTemplateChecklistDraft());
  }, []);

  const onOpenTemplateQuestionModal = useCallback((question?: TemplateQuestionVm) => {
    if (!selectedTemplate) {
      return;
    }

    setError('');
    setTemplateQuestionsError('');
    setTemplateQuestionDraft(createTemplateQuestionDraft(question, {
      sequenceOrder: question?.sequenceOrder ?? (templateQuestions.length + 1),
      siteCode: question?.siteCode ?? selectedTemplate.siteCode,
    }));
    setIsTemplateQuestionOpen(true);
  }, [selectedTemplate, templateQuestions.length]);

  const onCloseTemplateQuestionEditor = useCallback(() => {
    setIsTemplateQuestionOpen(false);
    setTemplateQuestionDraft(createTemplateQuestionDraft());
  }, []);

  useEffect(() => {
    if (templateRows.length === 0) {
      setSelectedTemplateId('');
      setTemplateQuestions([]);
      setTemplateQuestionsError('');
      return;
    }

    const hasCurrentSelection = templateRows.some((item) => item.id === selectedTemplateId);
    if (!hasCurrentSelection) {
      setSelectedTemplateId(templateRows[0]?.id ?? '');
    }
  }, [selectedTemplateId, templateRows]);

  useEffect(() => {
    if ((view !== 'template-library' && !isChecklistTemplatePickerOpen) || !selectedTemplateId) {
      return;
    }

    let isCancelled = false;

    const loadSelectedTemplateQuestions = async () => {
      setTemplateQuestionsLoading(true);
      setTemplateQuestionsError('');
      try {
        const rows = await loadTemplateQuestions(selectedTemplateId);
        if (!isCancelled) {
          setTemplateQuestions(rows);
        }
      } catch (templateQuestionError) {
        if (!isCancelled) {
          setTemplateQuestions([]);
          setTemplateQuestionsError(templateQuestionError instanceof Error ? templateQuestionError.message : String(templateQuestionError));
          trackError('template.questions.load', templateQuestionError, { templateId: selectedTemplateId });
        }
      } finally {
        if (!isCancelled) {
          setTemplateQuestionsLoading(false);
        }
      }
    };

    void loadSelectedTemplateQuestions();

    return () => {
      isCancelled = true;
    };
  }, [isChecklistTemplatePickerOpen, loadTemplateQuestions, selectedTemplateId, view]);

  const onOpenChecklistTemplatePicker = useCallback(async () => {
    setError('');
    setTemplateQuestionsError('');
    setIsChecklistTemplatePickerOpen(true);

    if (templateRows.length > 0) {
      setSelectedTemplateId((current) => current || templateRows[0]?.id || '');
      return;
    }

    try {
      setLoading(true);
      const rows = await loadTemplates();
      setSelectedTemplateId((current) => current || rows[0]?.id || '');
    } catch (templateLoadError) {
      const message = templateLoadError instanceof Error ? templateLoadError.message : String(templateLoadError);
      setError(message);
      trackError('templates.load.dialog', templateLoadError, { selectedPlanId: selectedPlan?.id });
    } finally {
      setLoading(false);
    }
  }, [loadTemplates, selectedPlan?.id, templateRows]);

  const onCloseChecklistTemplatePicker = useCallback(() => {
    setIsChecklistTemplatePickerOpen(false);
    setTemplateQuestionsError('');
  }, []);

  const onSaveTemplateChecklist = useCallback(async () => {
    if (!templateChecklistDraft.name.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      let nextTemplateId = templateChecklistDraft.id;
      const duplicateSourceTemplateId = templateChecklistDraft.duplicateSourceTemplateId;

      if (templateChecklistDraft.id) {
        await updateTemplateChecklist(templateChecklistDraft.id, {
          name: templateChecklistDraft.name.trim(),
          disciplineCode: templateChecklistDraft.disciplineCode,
          siteCode: templateChecklistDraft.siteCode,
        });
        trackFlow('templateChecklist.update', { templateChecklistId: templateChecklistDraft.id });
      } else {
        nextTemplateId = await createTemplateChecklist({
          name: templateChecklistDraft.name.trim(),
          disciplineCode: templateChecklistDraft.disciplineCode,
          siteCode: templateChecklistDraft.siteCode,
        });

        if (duplicateSourceTemplateId && nextTemplateId) {
          const sourceQuestions = await loadGalleryWithRetry(() => getTemplateQuestions(duplicateSourceTemplateId));
          for (const question of sourceQuestions) {
            await createTemplateQuestion({
              templateChecklistId: nextTemplateId,
              questionText: question.questionText,
              sequenceOrder: question.sequenceOrder,
              isMandatory: question.isMandatory,
              siteCode: templateChecklistDraft.siteCode,
            });
          }
          trackFlow('templateChecklist.duplicate', {
            templateChecklistId: duplicateSourceTemplateId,
            duplicatedTemplateChecklistId: nextTemplateId,
          });
        }

        trackFlow('templateChecklist.create', { templateChecklistId: nextTemplateId });
      }

      await refreshTemplateLibrary(nextTemplateId);
      onCloseTemplateChecklistEditor();
    } catch (templateChecklistError) {
      setError(templateChecklistError instanceof Error ? templateChecklistError.message : String(templateChecklistError));
      trackError('templateChecklist.save', templateChecklistError, { templateChecklistId: templateChecklistDraft.id });
    } finally {
      setLoading(false);
    }
  }, [onCloseTemplateChecklistEditor, refreshTemplateLibrary, templateChecklistDraft]);

  const onDuplicateTemplateChecklist = useCallback((template: TemplateChecklistVm) => {
    setError('');
    setTemplateChecklistDraft({
      id: undefined,
      name: `${template.name} Copy`,
      disciplineCode: template.disciplineCode,
      siteCode: template.siteCode,
      duplicateSourceTemplateId: template.id,
    });
    setIsTemplateChecklistOpen(true);
  }, []);

  const onDeleteTemplateChecklist = useCallback(async (template: TemplateChecklistVm) => {
    if (!window.confirm(`Delete template checklist "${template.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await deleteTemplateChecklist(template.id);
      setSelectedTemplateIds((current) => current.filter((id) => id !== template.id));
      trackFlow('templateChecklist.delete', { templateChecklistId: template.id });
      const remainingTemplates = await refreshTemplateLibrary(
        template.id === selectedTemplateId
          ? templateRows.find((item) => item.id !== template.id)?.id
          : selectedTemplateId,
      );
      if (remainingTemplates.length === 0) {
        setTemplateQuestions([]);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : String(deleteError));
      trackError('templateChecklist.delete', deleteError, { templateChecklistId: template.id });
    } finally {
      setLoading(false);
    }
  }, [refreshTemplateLibrary, selectedTemplateId, templateRows]);

  const onSaveTemplateQuestion = useCallback(async () => {
    if (!selectedTemplate || !templateQuestionDraft.questionText.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTemplateQuestionsError('');

      let targetQuestionId = templateQuestionDraft.id;

      if (templateQuestionDraft.id) {
        await updateTemplateQuestion(templateQuestionDraft.id, {
          questionText: templateQuestionDraft.questionText.trim(),
          sequenceOrder: templateQuestionDraft.sequenceOrder,
          isMandatory: templateQuestionDraft.isMandatory,
          siteCode: templateQuestionDraft.siteCode,
        });
        trackFlow('templateQuestion.update', { templateQuestionId: templateQuestionDraft.id, templateChecklistId: selectedTemplate.id });
      } else {
        targetQuestionId = await createTemplateQuestion({
          templateChecklistId: selectedTemplate.id,
          questionText: templateQuestionDraft.questionText.trim(),
          sequenceOrder: templateQuestions.length + 1,
          isMandatory: templateQuestionDraft.isMandatory,
          siteCode: templateQuestionDraft.siteCode,
        });
        trackFlow('templateQuestion.create', { templateQuestionId: targetQuestionId, templateChecklistId: selectedTemplate.id });
      }

      if (targetQuestionId) {
        const orderedIds = moveQuestionIdToSequence(
          templateQuestions,
          targetQuestionId,
          templateQuestionDraft.sequenceOrder,
        );
        await resequenceTemplateQuestions(orderedIds);
      }

      await refreshTemplateLibrary(selectedTemplate.id);
      await loadTemplateQuestions(selectedTemplate.id);
      onCloseTemplateQuestionEditor();
    } catch (templateQuestionError) {
      const message = templateQuestionError instanceof Error ? templateQuestionError.message : String(templateQuestionError);
      setTemplateQuestionsError(message);
      setError(message);
      trackError('templateQuestion.save', templateQuestionError, { templateQuestionId: templateQuestionDraft.id, templateChecklistId: selectedTemplate.id });
    } finally {
      setLoading(false);
    }
  }, [loadTemplateQuestions, onCloseTemplateQuestionEditor, refreshTemplateLibrary, selectedTemplate, templateQuestionDraft, templateQuestions]);

  const onDeleteTemplateQuestion = useCallback(async (question: TemplateQuestionVm) => {
    if (!selectedTemplate || !window.confirm(`Delete question ${question.sequenceOrder}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTemplateQuestionsError('');
      await deleteTemplateQuestion(question.id);
      const remainingIds = templateQuestions
        .filter((item) => item.id !== question.id)
        .sort((left, right) => left.sequenceOrder - right.sequenceOrder)
        .map((item) => item.id);
      await resequenceTemplateQuestions(remainingIds);
      trackFlow('templateQuestion.delete', { templateQuestionId: question.id, templateChecklistId: selectedTemplate.id });
      await refreshTemplateLibrary(selectedTemplate.id);
      await loadTemplateQuestions(selectedTemplate.id);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : String(deleteError);
      setTemplateQuestionsError(message);
      setError(message);
      trackError('templateQuestion.delete', deleteError, { templateQuestionId: question.id, templateChecklistId: selectedTemplate.id });
    } finally {
      setLoading(false);
    }
  }, [loadTemplateQuestions, refreshTemplateLibrary, selectedTemplate, templateQuestions]);

  useEffect(() => {
    const initialize = async () => {
      if (await maybeRedirectToLocalPlay()) {
        return;
      }

      setLoading(true);
      setError('');
      try {
        const nextPlans = await loadPlansWithStartupRetry();
        void loadTemplatesWithStartupRetry().catch((templateError) => {
          trackError('templates.load.background', templateError);
        });

        const route = parseHashRoute();
        if (route.view === 'plan-details' && route.planId) {
          const matchedPlan = nextPlans.find((item) => item.id === route.planId);
          if (matchedPlan) {
            await openPlan(matchedPlan, false, true, (route.tab as PlanDetailsTab | undefined) ?? 'checklists');
          }
        } else if (route.view === 'checklist-details' && route.planId && route.checklistId) {
          const matchedPlan = nextPlans.find((item) => item.id === route.planId);
          if (matchedPlan) {
            await openPlan(matchedPlan, false, true, 'checklists');
            const latestChecklists = await getPlanChecklists(matchedPlan.id);
            const matchedChecklist = latestChecklists.find((item) => item.id === route.checklistId);
            if (matchedChecklist) {
              await openChecklist(matchedPlan, matchedChecklist, false, true, (route.tab as ChecklistDetailsTab | undefined) ?? 'questions');
            }
          }
        } else if (route.view === 'template-library') {
          setView('template-library');
        } else {
          goPlans(true);
        }

        initialRouteAppliedRef.current = true;
      } catch (initError) {
        const message = mapInitializationError(initError);
        setError(message);
        trackError('app.initialize', initError);
      } finally {
        setLoading(false);
      }
    };

    initialize().catch((unhandledError) => {
      trackError('app.initialize.unhandled', unhandledError);
    });
  }, [goPlans, loadPlansWithStartupRetry, loadTemplatesWithStartupRetry, openChecklist, openPlan]);

  useEffect(() => {
    if (!initialRouteAppliedRef.current) {
      return;
    }

    const onHashChange = async () => {
      if (routeSyncRef.current) {
        return;
      }

      const route = parseHashRoute();
      if (hasPendingQuestionChanges) {
        syncCurrentRoute(true);
        promptForPendingQuestionNavigation(() => navigateToParsedRoute(route));
        return;
      }

      await navigateToParsedRoute(route);
    };

    const handler = () => {
      void onHashChange();
    };

    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, [hasPendingQuestionChanges, navigateToParsedRoute, plans, promptForPendingQuestionNavigation, syncCurrentRoute]);

  useEffect(() => {
    if (!hasPendingQuestionChanges) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [hasPendingQuestionChanges]);

  useEffect(() => {
    trackView(view, {
      selectedPlanId: selectedPlan?.id,
      selectedChecklistId: selectedChecklist?.id,
    });
  }, [view, selectedPlan?.id, selectedChecklist?.id]);

  useEffect(() => {
    if (view !== 'plans' || plans.length > 0) {
      return;
    }

    let isCancelled = false;
    let timerId = 0;
    let attempt = 0;
    const maxAttempts = 10;

    const runAttempt = async () => {
      if (isCancelled || view !== 'plans') {
        return;
      }

      attempt += 1;
      try {
        const next = await loadPlans();
        if (isCancelled) {
          return;
        }
        if (next.length > 0 || attempt >= maxAttempts) {
          return;
        }
      } catch {
        if (attempt >= maxAttempts) {
          return;
        }
      }

      timerId = window.setTimeout(() => {
        void runAttempt();
      }, 2000);
    };

    timerId = window.setTimeout(() => {
      void runAttempt();
    }, 2000);

    return () => {
      isCancelled = true;
      window.clearTimeout(timerId);
    };
  }, [view, plans.length, loadPlans]);

  useEffect(() => {
    if (view !== 'template-library' || templateRows.length > 0) {
      return;
    }

    let isCancelled = false;

    const ensureTemplatesLoaded = async () => {
      try {
        const next = await loadTemplatesWithStartupRetry();
        if (isCancelled || next.length > 0) {
          return;
        }
      } catch (templateError) {
        if (!isCancelled) {
          setError(templateError instanceof Error ? templateError.message : String(templateError));
          trackError('templates.load.view', templateError);
        }
      }
    };

    void ensureTemplatesLoaded();

    return () => {
      isCancelled = true;
    };
  }, [view, templateRows.length, loadTemplatesWithStartupRetry]);

  const onCreatePlan = useCallback(async () => {
    if (!planDraft.name.trim()) {
      return;
    }

    const previousPlans = plans;
    const tempId = `temp-${Date.now()}`;
    const optimisticPlan: PlanVm = {
      id: tempId,
      planId: 'Pending...',
      name: planDraft.name,
      event: planDraft.event,
      siteCode: planDraft.siteCode,
      siteLabel: siteOptions.find((item) => item.key === planDraft.siteCode)?.label,
      typeCode: planDraft.typeCode,
      typeLabel: typeOptions.find((item) => item.key === planDraft.typeCode)?.label,
      stageCode: planDraft.stageCode,
      stageLabel: stageOptions.find((item) => item.key === planDraft.stageCode)?.label,
      system: planDraft.system,
      checklistCompletedCount: 0,
      checklistTotalCount: 0,
      percentComplete: 0,
      openDeficiencyCount: 0,
    };

    setPlans((current) => [optimisticPlan, ...current]);

    try {
      setLoading(true);
      await createPlan({
        name: planDraft.name,
        event: planDraft.event || undefined,
        system: planDraft.system || undefined,
        siteCode: planDraft.siteCode,
        typeCode: planDraft.typeCode,
        stageCode: planDraft.stageCode,
        mocId: planDraft.mocId,
        projectId: planDraft.projectId,
        taRevisionId: planDraft.taRevisionId,
      });
      trackFlow('plan.create', { name: planDraft.name });
      setPlanDraft((current) => ({
        ...current,
        name: '',
        event: '',
        system: '',
        mocId: undefined,
        projectId: undefined,
        taRevisionId: undefined,
      }));
      setIsCreatePlanOpen(false);
      await loadPlans();
    } catch (createError) {
      setPlans(previousPlans);
      setError(createError instanceof Error ? createError.message : String(createError));
      trackError('plan.create', createError);
    } finally {
      setLoading(false);
    }
  }, [loadPlans, planDraft, plans, siteOptions, stageOptions, typeOptions]);

  const onOpenCreatePlan = useCallback(() => {
    setError('');
    setIsCreatePlanOpen(true);
  }, []);

  const onResetPlanDetails = useCallback(() => {
    setPlanDetailsDraft(createPlanDetailsDraft(selectedPlan));
  }, [selectedPlan]);

  const onCloseDeficiencyPopout = useCallback(() => {
    setIsDeficiencyOpen(false);
    setDeficiencyPopoutMode('editor');
    setIsDeficiencyCloseDialogOpen(false);
    setDeficiencyCloseComment('');
  }, []);

  const onOpenDeficiencyModal = useCallback((question?: QuestionVm, deficiency?: DeficiencyVm) => {
    if (!deficiency && (!question || question.responseCode !== 507650001)) {
      setError('Deficiencies can only be created from checklist questions answered No.');
      return;
    }

    setError('');
    setDeficiencyPopoutMode('editor');
    setDeficiencyQuestionId(question?.id ?? deficiency?.questionId ?? '');
    setDeficiencyChecklistId(question?.checklistId ?? deficiency?.checklistId ?? selectedChecklist?.id ?? '');
    setDeficiencyDraft({
      id: deficiency?.id,
      name: deficiency?.name ?? '',
      initialCategoryCode: deficiency?.initialCategoryCode ?? 507650001,
      acceptedCategoryCode: deficiency?.acceptedCategoryCode,
      statusCode: deficiency?.statusCode ?? 507650000,
      generalComment: deficiency?.generalComment ?? question?.comment ?? '',
    });
    setIsDeficiencyOpen(true);
  }, [selectedChecklist?.id]);

  const onOpenQuestionDeficiencyPopout = useCallback((question: QuestionVm) => {
    const relatedDeficiencies = deficiencies.filter((item) => item.questionId === question.id);

    if (relatedDeficiencies.length > 1) {
      setError('');
      setDeficiencyQuestionId(question.id);
      setDeficiencyChecklistId(question.checklistId ?? selectedChecklist?.id ?? '');
      setDeficiencyPopoutMode('list');
      setIsDeficiencyOpen(true);
      return;
    }

    onOpenDeficiencyModal(question, relatedDeficiencies[0]);
  }, [deficiencies, onOpenDeficiencyModal, selectedChecklist?.id]);

  const onEditQuestionDeficiency = useCallback((deficiency: DeficiencyVm) => {
    const sourceQuestion = questions.find((item) => item.id === deficiency.questionId);
    onOpenDeficiencyModal(sourceQuestion, deficiency);
  }, [onOpenDeficiencyModal, questions]);

  const onAddAnotherQuestionDeficiency = useCallback(() => {
    if (!activeDeficiencyQuestion) {
      return;
    }

    onOpenDeficiencyModal(activeDeficiencyQuestion);
  }, [activeDeficiencyQuestion, onOpenDeficiencyModal]);

  const onOpenDeficiencyCloseDialog = useCallback(() => {
    setDeficiencyCloseComment('');
    setIsDeficiencyCloseDialogOpen(true);
  }, []);

  const onConfirmDeficiencyClose = useCallback(async () => {
    if (!selectedPlanLifecycleContext || !activeDeficiencyRecord) {
      return;
    }

    try {
      setLoading(true);
      const result = await closeDeficiency(
        selectedPlanLifecycleContext,
        activeDeficiencyRecord,
        deficiencyCloseComment,
        lifecycleDependencies,
      );

      const succeeded = await handleLifecycleResult(result);
      if (succeeded) {
        onCloseDeficiencyPopout();
      }
    } finally {
      setLoading(false);
    }
  }, [activeDeficiencyRecord, deficiencyCloseComment, handleLifecycleResult, lifecycleDependencies, onCloseDeficiencyPopout, selectedPlanLifecycleContext]);

  const onSavePlanDetails = useCallback(async () => {
    if (!selectedPlan || !planDetailsDraft.name.trim()) {
      return;
    }

    const previousSelectedPlan = selectedPlan;
    const previousPlans = plans;
    const nextPlan: PlanVm = {
      ...selectedPlan,
      name: planDetailsDraft.name.trim(),
      event: planDetailsDraft.event.trim() || undefined,
      siteCode: planDetailsDraft.siteCode,
      siteLabel: siteOptions.find((item) => item.key === planDetailsDraft.siteCode)?.label,
      stageCode: planDetailsDraft.stageCode,
      stageLabel: stageOptions.find((item) => item.key === planDetailsDraft.stageCode)?.label,
      system: planDetailsDraft.system.trim() || undefined,
    };

    setSelectedPlan(nextPlan);
    setPlans((current) => current.map((item) => (item.id === nextPlan.id ? nextPlan : item)));

    try {
      setLoading(true);
      setError('');
      await updatePlan(selectedPlan.id, {
        name: nextPlan.name,
        event: nextPlan.event,
        siteCode: nextPlan.siteCode,
        stageCode: nextPlan.stageCode,
        system: nextPlan.system,
      });
      trackFlow('plan.update', { planId: selectedPlan.id, stageCode: nextPlan.stageCode });
      const latestPlans = await loadPlans();
      const refreshedPlan = latestPlans.find((item) => item.id === selectedPlan.id) ?? nextPlan;
      setSelectedPlan(refreshedPlan);
    } catch (updateError) {
      setSelectedPlan(previousSelectedPlan);
      setPlans(previousPlans);
      setError(updateError instanceof Error ? updateError.message : String(updateError));
      trackError('plan.update', updateError, { planId: selectedPlan.id });
    } finally {
      setLoading(false);
    }
  }, [loadPlans, planDetailsDraft, plans, selectedPlan, siteOptions, stageOptions]);

  const onQuestionAnswer = useCallback((question: QuestionVm, responseCode: number) => {
    const responseLabel = optionSets.questionResponse[responseCode as keyof typeof optionSets.questionResponse];

    setQuestions((current) => current.map((item) => (
      item.id === question.id
        ? { ...item, responseCode, responseLabel }
        : item
    )));

    if (responseLabel === 'No') {
      onOpenQuestionDeficiencyPopout({ ...question, responseCode, responseLabel });
    }

    trackFlow('question.response.staged', { questionId: question.id, responseCode });
  }, [onOpenQuestionDeficiencyPopout]);

  const onSaveQuestionResponses = useCallback(async (): Promise<boolean> => {
    const changedQuestions = questions.filter((question) => savedQuestionResponses[question.id] !== question.responseCode);
    if (changedQuestions.length === 0) {
      return true;
    }

    setIsSavingQuestionResponses(true);
    setError('');

    try {
      const results = await Promise.allSettled(changedQuestions.map(async (item) => {
        await updateQuestionResponse(item.id, { responseCode: item.responseCode });
        return item;
      }));

      const savedItems = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
      if (savedItems.length > 0) {
        setSavedQuestionResponses((current) => {
          const next = { ...current };
          savedItems.forEach((item) => {
            next[item.id] = item.responseCode;
          });
          return next;
        });
        trackFlow('question.response.saved', {
          checklistId: selectedChecklist?.id,
          savedCount: savedItems.length,
        });
      }

      const failedResult = results.find((result) => result.status === 'rejected');
      if (failedResult && failedResult.status === 'rejected') {
        const message = failedResult.reason instanceof Error ? failedResult.reason.message : String(failedResult.reason);
        setError(message);
        trackError('question.response.save', failedResult.reason, {
          checklistId: selectedChecklist?.id,
          attemptedCount: changedQuestions.length,
          savedCount: savedItems.length,
        });
        return false;
      }

      if (selectedPlan?.id) {
        const nextChecklists = await loadPlanChildren(selectedPlan.id);
        if (selectedChecklist?.id) {
          const refreshedChecklist = nextChecklists.find((item) => item.id === selectedChecklist.id);
          if (refreshedChecklist) {
            setSelectedChecklist(refreshedChecklist);
          }
        }

        // Auto-transition Plan → Execution when first answer is saved while plan is Plan+approved
        const latestPlanApproval = findLatestApproval(approvals, PLAN_STAGE_PLAN, TEAM_ROLE_PSSR_LEAD);
        const planIsApproved = latestPlanApproval?.decisionCode === APPROVAL_STATUS_APPROVED;
        if (selectedPlanLifecycleContext && selectedPlan.stageCode === PLAN_STAGE_PLAN && planIsApproved && selectedChecklist) {
          try {
            const result = await runExecutionTransition(selectedPlanLifecycleContext, selectedChecklist, lifecycleDependencies);
            if (result.success) {
              await refreshCurrentPlanState();
            }
          } catch {
            // Non-fatal: transition will be retried on next save
          }
        }
      }

      return true;
    } finally {
      setIsSavingQuestionResponses(false);
    }
  }, [approvals, lifecycleDependencies, questions, refreshCurrentPlanState, savedQuestionResponses, selectedChecklist, selectedPlan, selectedPlanLifecycleContext]);

  const onDiscardQuestionChangesAndContinue = useCallback(async () => {
    onDiscardQuestionChanges();
    await runPendingQuestionNavigation();
  }, [onDiscardQuestionChanges, runPendingQuestionNavigation]);

  const onSaveQuestionChangesAndContinue = useCallback(async () => {
    const saved = await onSaveQuestionResponses();
    if (!saved) {
      return;
    }

    await runPendingQuestionNavigation();
  }, [onSaveQuestionResponses, runPendingQuestionNavigation]);

  const onSaveDeficiency = useCallback(async () => {
    if (!selectedPlan || !deficiencyDraft.name.trim()) {
      return;
    }

    if (!isDeficiencyDraftEditable) {
      setError(deficiencyDraft.id
        ? 'This deficiency is read-only in the current lifecycle phase.'
        : 'Deficiencies can only be created from a question answered No during Execution.');
      return;
    }

    const previousDeficiencies = deficiencies;
    const optimisticId = deficiencyDraft.id ?? `temp-def-${Date.now()}`;
    const optimisticEntry: DeficiencyVm = {
      id: optimisticId,
      planId: selectedPlan.id,
      checklistId: deficiencyChecklistId || undefined,
      questionId: deficiencyQuestionId || undefined,
      name: deficiencyDraft.name,
      initialCategoryCode: deficiencyDraft.initialCategoryCode,
      acceptedCategoryCode: deficiencyDraft.acceptedCategoryCode,
      statusCode: deficiencyDraft.statusCode,
      initialCategoryLabel: deficiencyCategoryOptions.find((item) => item.key === deficiencyDraft.initialCategoryCode)?.label,
      acceptedCategoryLabel: deficiencyCategoryOptions.find((item) => item.key === deficiencyDraft.acceptedCategoryCode)?.label,
      statusLabel: deficiencyStatusOptions.find((item) => item.key === deficiencyDraft.statusCode)?.label,
      generalComment: deficiencyDraft.generalComment,
    };

    setDeficiencies((current) => {
      if (deficiencyDraft.id) {
        return current.map((item) => (item.id === deficiencyDraft.id ? optimisticEntry : item));
      }
      return [optimisticEntry, ...current];
    });

    try {
      setLoading(true);
      if (deficiencyDraft.id) {
        await updateDeficiency(deficiencyDraft.id, {
          name: deficiencyDraft.name,
          initialCategoryCode: deficiencyDraft.initialCategoryCode,
          acceptedCategoryCode: deficiencyDraft.acceptedCategoryCode,
          statusCode: deficiencyDraft.statusCode,
          generalComment: deficiencyDraft.generalComment,
        });
        trackFlow('deficiency.update', { deficiencyId: deficiencyDraft.id });
      } else {
        await createDeficiency({
          planId: selectedPlan.id,
          checklistId: deficiencyChecklistId || undefined,
          questionId: deficiencyQuestionId || undefined,
          name: deficiencyDraft.name,
          initialCategoryCode: deficiencyDraft.initialCategoryCode,
          statusCode: deficiencyDraft.statusCode,
          generalComment: deficiencyDraft.generalComment,
        });
        trackFlow('deficiency.create', { planId: selectedPlan.id });
      }

      const nextDeficiencies = await getDeficienciesByPlan(selectedPlan.id);
      setDeficiencies(nextDeficiencies);
      onCloseDeficiencyPopout();
    } catch (saveError) {
      setDeficiencies(previousDeficiencies);
      setError(saveError instanceof Error ? saveError.message : String(saveError));
      trackError('deficiency.save', saveError, { planId: selectedPlan.id });
    } finally {
      setLoading(false);
    }
  }, [deficiencies, deficiencyCategoryOptions, deficiencyChecklistId, deficiencyDraft, deficiencyQuestionId, deficiencyStatusOptions, isDeficiencyDraftEditable, onCloseDeficiencyPopout, selectedPlan]);

  const onCloseTeamMemberPopout = useCallback(() => {
    setIsTeamMemberOpen(false);
    setTeamMemberDraft(createTeamMemberDraft());
  }, []);

  const onOpenTeamMemberPopout = useCallback(() => {
    if (!canManageTeam) {
      setError('Team changes are locked in the current lifecycle phase.');
      return;
    }

    setError('');
    setTeamMemberDraft(createTeamMemberDraft());
    setIsTeamMemberOpen(true);
  }, [canManageTeam]);

  const planHeaderCommands = useMemo(() => {
    if (!selectedPlan || !selectedPlanCommandState) {
      return [];
    }

    if (selectedPlan.stageCode === PLAN_STAGE_DRAFT) {
      return [{
        key: 'advance-to-plan',
        label: 'Advance to Plan',
        icon: <ArrowCircleRight16Regular />,
        appearance: 'primary' as const,
        disabled: !selectedPlanCommandState.advanceToPlan.enabled,
        title: selectedPlanCommandState.advanceToPlan.reasons.join(' '),
        onClick: onAdvancePlanPhase,
      }];
    }

    if (selectedPlan.stageCode === PLAN_STAGE_PLAN) {
      return [
        {
          key: 'approve-plan',
          label: 'Approve',
          icon: <CheckmarkCircle16Regular />,
          appearance: 'primary' as const,
          disabled: !selectedPlanCommandState.approve.enabled,
          title: selectedPlanCommandState.approve.reasons.join(' '),
          onClick: onApprovePlanLifecycle,
        },
        {
          key: 'reject-plan',
          label: 'Reject',
          icon: <Delete24Regular />,
          appearance: 'secondary' as const,
          disabled: !selectedPlanCommandState.reject.enabled,
          title: selectedPlanCommandState.reject.reasons.join(' '),
          onClick: onRejectPlanLifecycle,
        },
      ];
    }

    if (selectedPlan.stageCode === 507650002) {
      return [{
        key: 'advance-to-approval',
        label: 'Advance to Approval',
        icon: <ArrowCircleRight16Regular />,
        appearance: 'primary' as const,
        disabled: !selectedPlanCommandState.advanceToApproval.enabled,
        title: selectedPlanCommandState.advanceToApproval.reasons.join(' '),
        onClick: onAdvanceExecutionToApproval,
      }];
    }

    if (selectedPlan.stageCode === PLAN_STAGE_APPROVAL) {
      return [
        {
          key: 'approve-approval',
          label: 'Approve',
          icon: <CheckmarkCircle16Regular />,
          appearance: 'primary' as const,
          disabled: !selectedPlanCommandState.approve.enabled,
          title: selectedPlanCommandState.approve.reasons.join(' '),
          onClick: onApprovePlanLifecycle,
        },
        {
          key: 'reject-approval',
          label: 'Reject',
          icon: <Delete24Regular />,
          appearance: 'secondary' as const,
          disabled: !selectedPlanCommandState.reject.enabled,
          title: selectedPlanCommandState.reject.reasons.join(' '),
          onClick: onRejectPlanLifecycle,
        },
      ];
    }

    if (selectedPlan.stageCode === PLAN_STAGE_COMPLETION) {
      return [{
        key: 'final-sign-off',
        label: 'Final Sign Off',
        icon: <CheckmarkCircle16Regular />,
        appearance: 'primary' as const,
        disabled: !selectedPlanCommandState.finalSignOff.enabled,
        title: selectedPlanCommandState.finalSignOff.reasons.join(' '),
        onClick: onFinalSignOff,
      }];
    }

    return [];
  }, [onAdvanceExecutionToApproval, onAdvancePlanPhase, onApprovePlanLifecycle, onFinalSignOff, onRejectPlanLifecycle, selectedPlan, selectedPlanCommandState]);

  const onSaveTeamMember = useCallback(async () => {
    if (!selectedPlan || !teamMemberDraft.memberId || teamMemberDraft.roleCode === undefined) {
      return;
    }

    const previousTeamMembers = teamMembers;
    const optimisticEntry: TeamMemberVm = {
      id: `temp-team-${Date.now()}`,
      planId: selectedPlan.id,
      name: teamMemberDraft.memberName,
      roleCode: teamMemberDraft.roleCode,
      roleLabel: teamRoleOptions.find((item) => item.key === teamMemberDraft.roleCode)?.label,
    };

    setTeamMembers((current) => [optimisticEntry, ...current]);

    try {
      setLoading(true);
      setError('');
      await createTeamMember({
        planId: selectedPlan.id,
        memberId: teamMemberDraft.memberId,
        memberName: teamMemberDraft.memberName,
        roleCode: teamMemberDraft.roleCode,
      });
      trackFlow('team-member.create', { planId: selectedPlan.id, roleCode: teamMemberDraft.roleCode });

      const nextTeamMembers = await getTeamByPlan(selectedPlan.id);
      setTeamMembers(nextTeamMembers);
      onCloseTeamMemberPopout();
    } catch (saveError) {
      setTeamMembers(previousTeamMembers);
      setError(saveError instanceof Error ? saveError.message : String(saveError));
      trackError('team-member.save', saveError, { planId: selectedPlan.id });
    } finally {
      setLoading(false);
    }
  }, [onCloseTeamMemberPopout, selectedPlan, teamMemberDraft, teamMembers, teamRoleOptions]);

  const onCopyTemplates = useCallback(async () => {
    if (!selectedPlan || selectedTemplateIds.length === 0) {
      return;
    }

    const previousChecklists = checklists;
    const placeholders = selectedTemplateIds
      .map((templateId) => templateRows.find((item) => item.id === templateId))
      .filter((item): item is TemplateChecklistVm => Boolean(item))
      .map((item) => ({
        id: `temp-copy-${item.id}`,
        name: item.name,
        disciplineCode: item.disciplineCode,
        disciplineLabel: item.disciplineLabel,
        statusCode: 507650000,
        statusLabel: 'NotStarted',
        planId: selectedPlan.id,
        questionCompletedCount: 0,
        questionTotalCount: item.questionCount,
      }));

    setChecklists((current) => [...placeholders, ...current]);

    try {
      setLoading(true);
      await copyTemplatesToPlan(selectedPlan.id, selectedTemplateIds);
      trackFlow('templates.copy', { planId: selectedPlan.id, templateCount: selectedTemplateIds.length });
      setSelectedTemplateIds([]);
      await openPlan(selectedPlan, false, true, 'checklists');
      setView('plan-details');
      syncHash('plan-details', selectedPlan.id, undefined, 'checklists', true);
    } catch (copyError) {
      setChecklists(previousChecklists);
      setError(copyError instanceof Error ? copyError.message : String(copyError));
      trackError('templates.copy', copyError, { planId: selectedPlan.id });
    } finally {
      setLoading(false);
    }
  }, [checklists, openPlan, selectedPlan, selectedTemplateIds, syncHash, templateRows]);

  const onConfirmChecklistTemplateCopy = useCallback(async () => {
    if (!selectedPlan || !selectedTemplate) {
      return;
    }

    const previousChecklists = checklists;
    const placeholder: ChecklistVm = {
      id: `temp-copy-${selectedTemplate.id}`,
      checklistId: 'Pending',
      name: selectedTemplate.name,
      disciplineCode: selectedTemplate.disciplineCode,
      disciplineLabel: selectedTemplate.disciplineLabel,
      statusCode: 507650000,
      statusLabel: 'NotStarted',
      planId: selectedPlan.id,
      questionCompletedCount: 0,
      questionTotalCount: selectedTemplate.questionCount,
    };

    setChecklists((current) => [placeholder, ...current]);

    try {
      setLoading(true);
      setError('');
      await copyTemplatesToPlan(selectedPlan.id, [selectedTemplate.id]);
      trackFlow('templates.copy.dialog', { planId: selectedPlan.id, templateId: selectedTemplate.id });
      await openPlan(selectedPlan, false, true, 'checklists');
      setIsChecklistTemplatePickerOpen(false);
    } catch (copyError) {
      setChecklists(previousChecklists);
      setError(copyError instanceof Error ? copyError.message : String(copyError));
      trackError('templates.copy.dialog', copyError, { planId: selectedPlan.id, templateId: selectedTemplate.id });
    } finally {
      setLoading(false);
    }
  }, [checklists, openPlan, selectedPlan, selectedTemplate]);

  const pageHeader = useMemo((): { title: string; subtitle: string; breadcrumbs: HeaderBreadcrumb[] } => {
    if (view === 'plan-details' && selectedPlan) {
      return {
        title: 'PSSR Details',
        subtitle: `${selectedPlan.planId} - ${selectedPlan.name}`,
        breadcrumbs: [
          { key: 'plans', label: 'Plans', onClick: () => { requestQuestionNavigation(() => goPlans()); } },
          { key: 'plan', label: selectedPlan.name },
        ],
      };
    }

    if (view === 'checklist-details' && selectedPlan && selectedChecklist) {
      return {
        title: 'Checklist Details',
        subtitle: `${selectedChecklist.checklistId} - ${selectedChecklist.name}`,
        breadcrumbs: [
          { key: 'plans', label: 'Plans', onClick: () => { requestQuestionNavigation(() => goPlans()); } },
          { key: 'plan', label: selectedPlan.name, onClick: () => { requestQuestionNavigation(() => goPlanDetails()); } },
          { key: 'checklist', label: selectedChecklist.name },
        ],
      };
    }

    if (view === 'template-library') {
      return {
        title: 'Template Library',
        subtitle: '',
        breadcrumbs: selectedPlan
          ? [
              { key: 'plans', label: 'Plans', onClick: () => { requestQuestionNavigation(() => goPlans()); } },
              { key: 'plan', label: selectedPlan.name, onClick: () => { requestQuestionNavigation(() => goPlanDetails()); } },
              { key: 'templates', label: 'Templates' },
            ]
          : [{ key: 'templates', label: 'Templates' }],
      };
    }

    return {
      title: 'PSSR Management',
      subtitle: '',
      breadcrumbs: [{ key: 'plans', label: 'Plans' }],
    };
  }, [goPlanDetails, goPlans, requestQuestionNavigation, selectedChecklist, selectedPlan, view]);
  const selectedPlanStageLabel = selectedPlan?.stageLabel ?? 'Unknown phase';
  const selectedPlanStageIcon = getPlanHeaderIcon(selectedPlan?.stageLabel);
  const selectedChecklistStatusLabel = selectedChecklist?.statusLabel ?? 'Unknown status';
  const selectedChecklistStatusIcon = getChecklistHeaderIcon(selectedChecklist?.statusLabel);

  useEffect(() => {
    setIsPlanSummaryExpanded(!getIsMobileBreadcrumbLayout());
  }, [selectedPlan?.id, view]);

  useEffect(() => {
    setIsChecklistSummaryExpanded(!getIsMobileBreadcrumbLayout());
  }, [selectedChecklist?.id, view]);

  return (
    <FluentProvider theme={webLightTheme} applyStylesToPortals className={styles.root}>
      <div className={styles.appShell}>
        <header className={styles.appHeader}>
          <div className={styles.appHeaderBrand}>
            <div className={styles.appHeaderTitleRow}>
              <div className={styles.appHeaderTitleLeft}>
                <div className={styles.appHeaderTitleGroup}>
                  <Title2 className={styles.appHeaderScreenTitle}>{pageHeader.title}</Title2>
                  {pageHeader.subtitle ? <Caption1 className={styles.appHeaderScreenSubtitle}>{pageHeader.subtitle}</Caption1> : null}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.appHeaderNav}>
            <div className={styles.appHeaderNavDesktop}>
              {view !== 'plans' && (
                <Button
                  appearance="subtle"
                  icon={<Home24Regular />}
                  className={styles.appHeaderNavButton}
                  aria-label={t('home')}
                  onClick={() => { requestQuestionNavigation(() => goPlans()); }}
                >
                  <span className={styles.appHeaderNavLabel}>{t('home')}</span>
                </Button>
              )}
              {hasTemplateAccess() && (
                <Button
                  appearance={view === 'template-library' ? 'primary' : 'subtle'}
                  icon={<DocumentMultiple24Regular />}
                  className={view === 'template-library' ? styles.appHeaderNavButtonActive : styles.appHeaderNavButton}
                  aria-label={t('templateLibrary')}
                  onClick={() => { requestQuestionNavigation(() => goTemplateLibrary()); }}
                >
                  <span className={styles.appHeaderNavLabel}>{t('templateLibrary')}</span>
                </Button>
              )}
            </div>
          </div>
          <div className={styles.appHeaderUser}>
            <button
              type="button"
              className={styles.appHeaderUserButton}
              aria-expanded={isMobileUserDetailsOpen}
              aria-label="Toggle user details"
              onClick={() => {
                setIsMobileUserDetailsOpen((value) => !value);
              }}
            >
              <div className={styles.appHeaderUserBadge} aria-hidden="true">
                {getInitials(currentUser?.fullName)}
              </div>
            </button>
            <div className={styles.appHeaderUserText}>
              <Text className={styles.appHeaderUserName}>{currentUser?.fullName?.trim() || 'Loading user...'}</Text>
              <div className={styles.appHeaderUserMeta}>
                <span className={styles.appHeaderUserMetaBadge}>
                  <span className={styles.appHeaderUserMetaText}>
                    <Briefcase16Regular />
                    {formatRoleLabel(currentUser?.roleLabel)}
                  </span>
                </span>
                <span className={styles.appHeaderUserMetaBadge}>
                  <span className={styles.appHeaderUserMetaText}>
                    <Building16Regular />
                    {currentUser?.siteLabel?.trim() || 'Site unavailable'}
                  </span>
                </span>
              </div>
              <Caption1 className={styles.appHeaderUserUpn}>{currentUser?.userPrincipalName?.trim() || ' '}</Caption1>
            </div>
            {isMobileUserDetailsOpen && (
              <div className={styles.appHeaderUserMobilePanel}>
                <Caption1 className={styles.appHeaderUserMobileEmail}>{currentUser?.userPrincipalName?.trim() || 'Email unavailable'}</Caption1>
                <div className={styles.appHeaderUserMobileMeta}>
                  <span className={styles.appHeaderUserMetaBadge}>
                    <span className={styles.appHeaderUserMetaText}>
                      <Briefcase16Regular />
                      {formatRoleLabel(currentUser?.roleLabel)}
                    </span>
                  </span>
                  <span className={styles.appHeaderUserMetaBadge}>
                    <span className={styles.appHeaderUserMetaText}>
                      <Building16Regular />
                      {currentUser?.siteLabel?.trim() || 'Site unavailable'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className={mergeClasses(
          styles.main,
          view === 'plans' ? styles.mainLocked : styles.mainDetail,
        )}>
          {view !== 'plans' && (
            <div className={styles.breadcrumbRow}>
              <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
                {pageHeader.breadcrumbs.map((breadcrumb, index) => (
                  <Fragment key={breadcrumb.key}>
                    {index > 0 && <ChevronRight12Regular className={styles.breadcrumbSeparator} />}
                    {breadcrumb.onClick ? (
                      <Link className={styles.breadcrumbLink} onClick={breadcrumb.onClick}>
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page">
                        <Text className={styles.breadcrumbActive}>{breadcrumb.label}</Text>
                      </span>
                    )}
                  </Fragment>
                ))}
              </nav>
              {view === 'plan-details' && selectedPlan && (
                <Button
                  appearance="subtle"
                  className={styles.breadcrumbLifecycleButton}
                  icon={<span className={styles.breadcrumbLifecycleIcon}>{selectedPlanStageIcon}</span>}
                  iconPosition="before"
                  onClick={() => setIsPlanSummaryExpanded((expanded) => !expanded)}
                >
                  <span className={styles.breadcrumbLifecycleLabel}>
                    <span className={styles.breadcrumbLifecycleText}>{selectedPlanStageLabel}</span>
                    <ChevronDown16Regular style={{ transform: isPlanSummaryExpanded ? 'rotate(180deg)' : undefined }} />
                  </span>
                </Button>
              )}
              {view === 'checklist-details' && selectedChecklist && (
                <Button
                  appearance="subtle"
                  className={styles.breadcrumbLifecycleButton}
                  icon={<span className={styles.breadcrumbLifecycleIcon}>{selectedChecklistStatusIcon}</span>}
                  iconPosition="before"
                  onClick={() => setIsChecklistSummaryExpanded((expanded) => !expanded)}
                >
                  <span className={styles.breadcrumbLifecycleLabel}>
                    <span className={styles.breadcrumbLifecycleText}>{selectedChecklistStatusLabel}</span>
                    <ChevronDown16Regular style={{ transform: isChecklistSummaryExpanded ? 'rotate(180deg)' : undefined }} />
                  </span>
                </Button>
              )}
            </div>
          )}

          <Suspense fallback={<div className={styles.viewFallback}><Spinner label="Loading view..." /></div>}>
            {view === 'plans' && (
              <PlansScreen
                loading={loading}
                error={error}
                plans={filteredPlans}
                searchText={searchText}
                siteFilter={siteFilter}
                typeFilter={typeFilter}
                phaseFilter={phaseFilter}
                siteOptions={siteOptions}
                typeOptions={typeOptions}
                phaseOptions={stageOptions}
                onSearchTextChange={setSearchText}
                onSiteFilterChange={setSiteFilter}
                onTypeFilterChange={setTypeFilter}
                onPhaseFilterChange={setPhaseFilter}
                onCreatePlan={() => { void onOpenCreatePlan(); }}
                onOpenPlan={(plan) => void openPlan(plan, true, false, 'checklists')}
                onRefreshPlans={() => { void loadPlansWithStartupRetry(); }}
              />
            )}

            {view === 'plan-details' && selectedPlan && (
              <PlanDetailsScreen
                loading={loading}
                error={error}
                selectedPlan={selectedPlan}
                planTab={planTab}
                planDetailsDraft={planDetailsDraft}
                checklists={checklists}
                deficiencies={deficiencies}
                approvals={approvals}
                teamMembers={teamMembers}
                siteOptions={siteOptions}
                stageOptions={stageOptions}
                isPlanEditable={isPlanEditable}
                isPhaseEditable={false}
                hasPlanDetailsChanges={hasPlanDetailsChanges}
                hasTemplateAccess={hasTemplateAccess()}
                headerCommands={planHeaderCommands}
                warningMessages={planWarningMessages}
                isSummaryExpanded={isPlanSummaryExpanded}
                canManageChecklistStructure={canManageChecklistStructure}
                checklistActionTitle={canManageChecklistStructure ? undefined : 'Checklist structure is locked in the current lifecycle phase.'}
                canCreateDeficiency={false}
                deficiencyActionTitle="Deficiencies must be created from a checklist question answered No during Execution."
                canManageTeam={canManageTeam}
                teamActionTitle={canManageTeam ? undefined : 'Team changes are locked in the current lifecycle phase.'}
                onPlanDetailsChange={(changes) => {
                  setPlanDetailsDraft((current) => ({ ...current, ...changes }));
                }}
                onResetPlanDetails={onResetPlanDetails}
                onSavePlanDetails={() => { void onSavePlanDetails(); }}
                onPlanTabChange={(tab) => {
                  setPlanTab(tab);
                  syncHash('plan-details', selectedPlan.id, undefined, tab, true);
                }}
                onOpenChecklistTemplatePicker={() => { void onOpenChecklistTemplatePicker(); }}
                onOpenTemplateLibrary={() => {
                  setView('template-library');
                  syncHash('template-library', selectedPlan.id);
                }}
                onRefreshPlan={() => { void openPlan(selectedPlan, false, true, planTab); }}
                onOpenChecklist={(checklist) => { void openChecklist(selectedPlan, checklist); }}
                onOpenNewDeficiency={() => onOpenDeficiencyModal()}
                onEditDeficiency={(deficiency) => onOpenDeficiencyModal(undefined, deficiency)}
                onOpenAddTeamMember={onOpenTeamMemberPopout}
              />
            )}

            {view === 'checklist-details' && selectedChecklist && selectedPlan && (
              <ChecklistDetailsScreen
                loading={loading}
                error={error}
                selectedPlan={selectedPlan}
                selectedChecklist={selectedChecklist}
                questions={questions}
                deficiencies={deficiencies}
                responseOptions={responseOptions}
                hasPendingChanges={hasPendingQuestionChanges}
                pendingResponseCount={pendingQuestionResponseCount}
                isSavingResponses={isSavingQuestionResponses}
                isQuestionAnsweringEnabled={isQuestionEditingEnabled}
                questionAnsweringTitle={questionAnsweringTitle}
                warningMessages={checklistCompleteReasons}
                canCreateDeficiency={canCreateDeficiencyForActiveQuestion}
                deficiencyActionTitle={canCreateDeficiencyForActiveQuestion ? undefined : 'Deficiencies can only be created from a question answered No during Execution.'}
                canCompleteChecklist={canCompleteCurrentChecklist}
                completeChecklistTitle={checklistCompleteTitle}
                onCompleteChecklist={onCompleteChecklist}
                onQuestionAnswer={onQuestionAnswer}
                onSaveResponses={() => { void onSaveQuestionResponses(); }}
                onQuestionCommentChange={(questionId, comment) => {
                  setQuestions((current) => current.map((item) => (
                    item.id === questionId ? { ...item, comment } : item
                  )));
                }}
                onAddDeficiency={(question) => onOpenDeficiencyModal(question)}
                onOpenQuestionDeficiencies={onOpenQuestionDeficiencyPopout}
                isSummaryExpanded={isChecklistSummaryExpanded}
                checklistTab={checklistTab}
                onChecklistTabChange={(tab) => {
                  setChecklistTab(tab);
                  syncHash('checklist-details', selectedPlan.id, selectedChecklist.id, tab, true);
                }}
              />
            )}

            {view === 'template-library' && (
              <TemplateLibraryScreen
                loading={loading}
                error={error}
                hasSelectedPlan={Boolean(selectedPlan)}
                templateRows={templateRows}
                selectedTemplateId={selectedTemplateId}
                selectedTemplateIds={selectedTemplateIds}
                selectedTemplate={selectedTemplate}
                templateQuestions={templateQuestions}
                templateQuestionsLoading={templateQuestionsLoading}
                templateQuestionsError={templateQuestionsError}
                isTemplateChecklistEditorOpen={isTemplateChecklistOpen}
                templateChecklistDraft={templateChecklistDraft}
                templateDisciplineOptions={templateDisciplineOptions}
                templateSiteOptions={templateSiteOptions}
                onTemplateChecklistDraftChange={(changes) => {
                  setTemplateChecklistDraft((current) => ({ ...current, ...changes }));
                }}
                onCloseTemplateChecklistEditor={onCloseTemplateChecklistEditor}
                onSaveTemplateChecklist={() => { void onSaveTemplateChecklist(); }}
                isTemplateQuestionEditorOpen={isTemplateQuestionOpen}
                templateQuestionDraft={templateQuestionDraft}
                templateQuestionSiteOptions={templateQuestionSiteOptions}
                onTemplateQuestionDraftChange={(changes) => {
                  setTemplateQuestionDraft((current) => ({ ...current, ...changes }));
                }}
                onCloseTemplateQuestionEditor={onCloseTemplateQuestionEditor}
                onSaveTemplateQuestion={() => { void onSaveTemplateQuestion(); }}
                onSelectTemplate={setSelectedTemplateId}
                onOpenCreateTemplateChecklist={onOpenTemplateChecklistModal}
                onEditTemplateChecklist={onOpenTemplateChecklistModal}
                onDuplicateTemplateChecklist={(template) => { void onDuplicateTemplateChecklist(template); }}
                onDeleteTemplateChecklist={(template) => { void onDeleteTemplateChecklist(template); }}
                onOpenCreateTemplateQuestion={() => onOpenTemplateQuestionModal()}
                onEditTemplateQuestion={onOpenTemplateQuestionModal}
                onDeleteTemplateQuestion={(question) => { void onDeleteTemplateQuestion(question); }}
                onToggleTemplate={(templateId) => {
                  setSelectedTemplateIds((current) => (
                    current.includes(templateId)
                      ? current.filter((id) => id !== templateId)
                      : [...current, templateId]
                  ));
                }}
                onCopySelected={() => { void onCopyTemplates(); }}
              />
            )}
          </Suspense>
        </main>

        <div className={styles.mobileBottomBar}>
          <div className={styles.mobileBottomBarInner}>
            <Button
              appearance={view === 'plans' ? 'primary' : 'subtle'}
              icon={<Home24Regular />}
              className={view === 'plans' ? mergeClasses(styles.mobileBottomBarButton, styles.appHeaderNavButtonActive) : styles.mobileBottomBarButton}
              aria-label={t('home')}
              onClick={() => { requestQuestionNavigation(() => goPlans()); }}
            />
            {hasTemplateAccess() && (
              <Button
                appearance={view === 'template-library' ? 'primary' : 'subtle'}
                icon={<DocumentMultiple24Regular />}
                className={view === 'template-library' ? mergeClasses(styles.mobileBottomBarButton, styles.appHeaderNavButtonActive) : styles.mobileBottomBarButton}
                aria-label={t('templateLibrary')}
                onClick={() => { requestQuestionNavigation(() => goTemplateLibrary()); }}
              />
            )}
          </div>
        </div>
      </div>

      {isPendingQuestionDialogOpen && (
        <div className={styles.floatingEditorHost}>
          <Card appearance="filled-alternative" className={styles.unsavedResponsesPopout}>
            <div className={styles.unsavedResponsesBody}>
              <ModalHeader title="Unsaved Responses" onClose={onStayOnChecklist} />
              <Text>
                You have {pendingQuestionResponseCount} unsaved {pendingQuestionResponseCount === 1 ? 'response' : 'responses'} on this checklist.
                Save before leaving, or discard the staged changes.
              </Text>
              <Divider />
              <div className={styles.unsavedResponsesActions}>
                <ResponsiveButton appearance="subtle" icon={<Delete24Regular />} label="Discard Changes" onClick={() => { void onDiscardQuestionChangesAndContinue(); }} />
                <ResponsiveButton appearance="primary" icon={<Save24Regular />} label={isSavingQuestionResponses ? 'Saving...' : 'Save and Close'} disabled={isSavingQuestionResponses} onClick={() => { void onSaveQuestionChangesAndContinue(); }} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {isDeficiencyOpen && (
        <div className={styles.floatingEditorHost}>
          <Card appearance="filled-alternative" className={styles.floatingEditorCard}>
            <div className={styles.deficiencyEditorLayout}>
              <ModalHeader
                title={deficiencyPopoutMode === 'list' ? 'Question Deficiencies' : deficiencyDraft.id ? 'Edit Deficiency' : 'Create Deficiency'}
                onClose={onCloseDeficiencyPopout}
              />

              {deficiencyPopoutMode === 'list' ? (
                <>
                  <Text>{activeDeficiencyQuestion?.text ?? 'This question has associated deficiencies.'}</Text>

                  <div className={styles.deficiencyList}>
                    {associatedQuestionDeficiencies.map((deficiency) => {
                      const statusTone = getDeficiencyStatusTone(deficiency.statusLabel);

                      return (
                        <Card
                          key={deficiency.id}
                          appearance="filled-alternative"
                          className={styles.deficiencyListCard}
                          onClick={() => onEditQuestionDeficiency(deficiency)}
                        >
                          <div className={styles.deficiencyListHeader}>
                            <Text weight="semibold">{deficiency.name || 'Untitled deficiency'}</Text>
                            <StatusChip value={deficiency.statusLabel} tone={statusTone} />
                          </div>
                          <div className={styles.deficiencyListMeta}>
                            <StatusChip value={`Init ${deficiency.initialCategoryLabel ?? 'N/A'}`} color="informative" />
                            <StatusChip value={`Acc ${deficiency.acceptedCategoryLabel ?? 'N/A'}`} color="brand" />
                          </div>
                          <Caption1>{deficiency.generalComment?.trim() || 'No general comment'}</Caption1>
                        </Card>
                      );
                    })}
                  </div>

                  <Divider />

                  <div className={styles.deficiencyEditorActions}>
                    <ResponsiveButton appearance="primary" icon={<Add24Regular />} label="Add Another Deficiency" onClick={onAddAnotherQuestionDeficiency} />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.modalFields}>
                    <Field label="Deficiency Description">
                      <Input
                        value={deficiencyDraft.name}
                        onChange={(_, data) => setDeficiencyDraft((current) => ({ ...current, name: data.value }))}
                        disabled={!isDeficiencyDraftEditable}
                      />
                    </Field>

                    <div className={styles.deficiencyCategoryRow}>
                      <Field label="Initial Category">
                        <Combobox
                          inlinePopup
                          placeholder="Select initial category"
                          value={deficiencyCategoryOptions.find((item) => item.key === deficiencyDraft.initialCategoryCode)?.label ?? ''}
                          selectedOptions={deficiencyDraft.initialCategoryCode ? [String(deficiencyDraft.initialCategoryCode)] : []}
                          onOptionSelect={(_, data) => {
                            if (data.optionValue) {
                              setDeficiencyDraft((current) => ({ ...current, initialCategoryCode: Number(data.optionValue) }));
                            }
                          }}
                          disabled={!isDeficiencyDraftEditable}
                        >
                          {deficiencyCategoryOptions.map((option) => (
                            <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                          ))}
                        </Combobox>
                      </Field>

                      <Field label="Accepted Category">
                        <Combobox
                          inlinePopup
                          placeholder={isAcceptedCategoryEnabled ? 'Select accepted category' : 'Available when status is In Progress'}
                          value={deficiencyCategoryOptions.find((item) => item.key === deficiencyDraft.acceptedCategoryCode)?.label ?? ''}
                          selectedOptions={deficiencyDraft.acceptedCategoryCode ? [String(deficiencyDraft.acceptedCategoryCode)] : []}
                          onOptionSelect={(_, data) => {
                            if (data.optionValue) {
                              setDeficiencyDraft((current) => ({ ...current, acceptedCategoryCode: Number(data.optionValue) }));
                            }
                          }}
                          disabled={!isDeficiencyDraftEditable || !isAcceptedCategoryEnabled}
                        >
                          {deficiencyCategoryOptions.map((option) => (
                            <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                          ))}
                        </Combobox>
                      </Field>
                    </div>

                    <Field label="Status">
                      <Combobox
                        inlinePopup
                        placeholder="Select status"
                        value={deficiencyStatusOptions.find((item) => item.key === deficiencyDraft.statusCode)?.label ?? ''}
                        selectedOptions={deficiencyDraft.statusCode ? [String(deficiencyDraft.statusCode)] : []}
                        onOptionSelect={(_, data) => {
                          if (data.optionValue) {
                            const nextStatusCode = Number(data.optionValue);
                            setDeficiencyDraft((current) => ({
                              ...current,
                              statusCode: nextStatusCode,
                              acceptedCategoryCode: nextStatusCode === DEFICIENCY_STATUS_IN_PROGRESS
                                ? current.acceptedCategoryCode
                                : undefined,
                            }));
                          }
                        }}
                        disabled={!isDeficiencyDraftEditable}
                      >
                        {deficiencyStatusOptions.filter((option) => option.key !== 507650002).map((option) => (
                          <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                        ))}
                      </Combobox>
                    </Field>

                    <Field label="Assigned To (UI only until Dataverse lookup is added)">
                      <Input placeholder="Future Dataverse lookup" disabled />
                    </Field>

                    <Field label="General Comment (open/in-progress notes)">
                      <Textarea
                        value={deficiencyDraft.generalComment ?? ''}
                        onChange={(_, data) => setDeficiencyDraft((current) => ({ ...current, generalComment: data.value }))}
                        disabled={!isDeficiencyDraftEditable}
                      />
                    </Field>
                  </div>

                  <Divider />

                  <div className={styles.deficiencyEditorActions}>
                    {associatedQuestionDeficiencies.length > 1 && deficiencyDraft.id && (
                      <ResponsiveButton appearance="subtle" icon={<ArrowCircleRight16Regular />} label="Back to List" onClick={() => setDeficiencyPopoutMode('list')} />
                    )}
                    {deficiencyQuestionId && (
                      <ResponsiveButton appearance="secondary" icon={<Add24Regular />} label="Add Another Deficiency" onClick={onAddAnotherQuestionDeficiency} />
                    )}
                    {deficiencyDraft.id && activeDeficiencyRecord?.statusCode !== 507650002 && (
                      <ResponsiveButton appearance="secondary" icon={<CheckmarkCircle16Regular />} label="Close" disabled={!isActiveDeficiencyEditable} title={isActiveDeficiencyEditable ? undefined : 'This deficiency is read-only in the current lifecycle phase.'} onClick={onOpenDeficiencyCloseDialog} />
                    )}
                    <ResponsiveButton appearance="primary" icon={<Save24Regular />} label={t('save')} disabled={!canSaveDeficiency} onClick={() => { void onSaveDeficiency(); }} />
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {isDeficiencyCloseDialogOpen && (
        <Dialog open onOpenChange={(_, data) => {
          if (!data.open) {
            setIsDeficiencyCloseDialogOpen(false);
          }
        }}>
          <DialogSurface>
            <DialogBody>
              <DialogContent>
                <Field label="Closing Comment" required>
                  <Textarea value={deficiencyCloseComment} onChange={(_, data) => setDeficiencyCloseComment(data.value)} />
                </Field>
              </DialogContent>
              <div className={styles.unsavedResponsesActions}>
                <Button appearance="secondary" onClick={() => setIsDeficiencyCloseDialogOpen(false)}>Cancel</Button>
                <Button appearance="primary" disabled={!deficiencyCloseComment.trim()} onClick={() => { void onConfirmDeficiencyClose(); }}>
                  Confirm Close
                </Button>
              </div>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}

      {isTeamMemberOpen && (
        <div className={styles.floatingEditorHost}>
          <Card appearance="filled-alternative" className={styles.floatingEditorCard}>
            <div className={styles.deficiencyEditorLayout}>
              <ModalHeader title="Add Team Member" onClose={onCloseTeamMemberPopout} />

              <div className={styles.modalFields}>
                <Field label="Member" required>
                  <Combobox
                    inlinePopup
                    placeholder={userLookupLoading ? 'Loading users...' : 'Select a user'}
                    value={teamMemberDraft.memberName}
                    selectedOptions={teamMemberDraft.memberId ? [teamMemberDraft.memberId] : []}
                    onOptionSelect={(_, data) => {
                      const selectedUser = userLookupOptions.find((item) => item.id === data.optionValue);
                      setTeamMemberDraft((current) => ({
                        ...current,
                        memberId: selectedUser?.id,
                        memberName: selectedUser?.label ?? '',
                      }));
                    }}
                    disabled={userLookupLoading || userLookupOptions.length === 0}
                  >
                    {userLookupOptions.map((option) => (
                      <Option key={option.id} value={option.id} text={option.label}>{option.label}</Option>
                    ))}
                  </Combobox>
                </Field>

                <Field label="Role" required>
                  <Combobox
                    inlinePopup
                    placeholder="Select a role"
                    value={teamRoleOptions.find((item) => item.key === teamMemberDraft.roleCode)?.label ?? ''}
                    selectedOptions={teamMemberDraft.roleCode !== undefined ? [String(teamMemberDraft.roleCode)] : []}
                    onOptionSelect={(_, data) => {
                      if (!data.optionValue) {
                        return;
                      }

                      setTeamMemberDraft((current) => ({
                        ...current,
                        roleCode: Number(data.optionValue),
                      }));
                    }}
                  >
                    {teamRoleOptions.map((option) => (
                      <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                    ))}
                  </Combobox>
                </Field>
              </div>

              <Divider />

              <div className={styles.deficiencyEditorActions}>
                <ResponsiveButton appearance="primary" icon={<Add24Regular />} label="Add Member" disabled={!canSaveTeamMember || loading} onClick={() => { void onSaveTeamMember(); }} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {isChecklistTemplatePickerOpen && (
        <div className={styles.floatingEditorHost}>
          <Card appearance="filled-alternative" className={styles.floatingEditorCard}>
            <div className={styles.templatePickerLayout}>
              <ModalHeader title="Add Checklist From Template" onClose={onCloseChecklistTemplatePicker} />

              <Field label="Template Checklist" required>
                <Dropdown
                  inlinePopup
                  value={selectedTemplate?.name}
                  selectedOptions={selectedTemplateId ? [selectedTemplateId] : []}
                  onOptionSelect={(_, data) => {
                    if (data.optionValue) {
                      setSelectedTemplateId(data.optionValue);
                    }
                  }}
                  disabled={loading || templateRows.length === 0}
                >
                  {templateRows.map((template) => (
                    <Option key={template.id} value={template.id}>{template.name}</Option>
                  ))}
                </Dropdown>
              </Field>

              {selectedTemplate && (
                <div className={styles.templatePickerMeta}>
                  <Text weight="semibold">{selectedTemplate.name}</Text>
                  <Caption1 className={styles.helperText}>
                    {selectedTemplate.disciplineLabel ?? 'No discipline'} | {selectedTemplate.siteLabel ?? 'No site'}
                  </Caption1>
                  <Caption1 className={styles.helperText}>
                    {selectedTemplate.description ?? 'No description provided.'}
                  </Caption1>
                </div>
              )}

              <Divider />

              {!selectedTemplate && (
                <Text className={styles.helperText}>Select a template checklist to preview the questions that will be copied to this plan.</Text>
              )}

              {selectedTemplate && templateQuestionsLoading && <Spinner label="Loading template questions..." />}

              {selectedTemplate && !templateQuestionsLoading && templateQuestionsError && (
                <Text>{templateQuestionsError}</Text>
              )}

              {selectedTemplate && !templateQuestionsLoading && !templateQuestionsError && templateQuestions.length === 0 && (
                <Text className={styles.helperText}>This template does not have any associated questions yet.</Text>
              )}

              {selectedTemplate && !templateQuestionsLoading && !templateQuestionsError && templateQuestions.length > 0 && (
                <div className={styles.templateQuestionPanel}>
                  <div className={styles.templateQuestionList}>
                    {templateQuestions.map((question) => (
                      <Card key={question.id} className={styles.templateQuestionCard} size="small">
                        <Text weight="semibold" className={styles.templateQuestionTitle}>{question.sequenceOrder}. {question.questionText}</Text>
                        <Caption1 className={styles.helperText}>{question.isMandatory ? 'Required question' : 'Optional question'}</Caption1>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Divider />

              <div className={styles.controlsRow}>
                <ResponsiveButton appearance="primary" icon={<CheckmarkCircle16Regular />} label="Confirm" disabled={!selectedTemplate || templateQuestionsLoading || loading} onClick={() => { void onConfirmChecklistTemplateCopy(); }} />
              </div>
            </div>
          </Card>
        </div>
      )}

      <Dialog open={isCreatePlanOpen}>
        <DialogSurface>
          <DialogBody>
            <ModalHeader title="Create PSSR Plan" onClose={() => setIsCreatePlanOpen(false)} />
            <DialogContent>
              <div className={styles.modalFields}>
                <Field label="Name" required>
                  <Input
                    value={planDraft.name}
                    onChange={(_, data) => setPlanDraft((current) => ({ ...current, name: data.value }))}
                  />
                </Field>
                <Field label="Event">
                  <Input
                    value={planDraft.event}
                    onChange={(_, data) => setPlanDraft((current) => ({ ...current, event: data.value }))}
                  />
                </Field>
                <Field label="Site">
                  <Dropdown
                    inlinePopup
                    value={siteOptions.find((item) => item.key === planDraft.siteCode)?.label}
                    selectedOptions={planDraft.siteCode ? [String(planDraft.siteCode)] : []}
                    onOptionSelect={(_, data) => {
                      if (data.optionValue) {
                        setPlanDraft((current) => ({ ...current, siteCode: Number(data.optionValue) }));
                      }
                    }}
                  >
                    {siteOptions.map((option) => (
                      <Option key={option.key} value={String(option.key)}>{option.label}</Option>
                    ))}
                  </Dropdown>
                </Field>
                <Field label="Type">
                  <Dropdown
                    inlinePopup
                    value={typeOptions.find((item) => item.key === planDraft.typeCode)?.label}
                    selectedOptions={planDraft.typeCode ? [String(planDraft.typeCode)] : []}
                    onOptionSelect={(_, data) => {
                      if (data.optionValue) {
                        setPlanDraft((current) => ({
                          ...current,
                          typeCode: Number(data.optionValue),
                          mocId: undefined,
                          projectId: undefined,
                          taRevisionId: undefined,
                        }));
                      }
                    }}
                  >
                    {typeOptions.map((option) => (
                      <Option key={option.key} value={String(option.key)}>{option.label}</Option>
                    ))}
                  </Dropdown>
                </Field>
                {planDraft.typeCode === PLAN_TYPE_CODES.moc && (
                  <Field label="MoC">
                    <Combobox
                      inlinePopup
                      placeholder="Search and select MoC"
                      selectedOptions={planDraft.mocId ? [planDraft.mocId] : []}
                      onOptionSelect={(_, data) => {
                        setPlanDraft((current) => ({
                          ...current,
                          mocId: data.optionValue,
                        }));
                      }}
                      disabled={lookupLoading}
                    >
                      {mocLookupOptions.map((option) => (
                        <Option key={option.id} value={option.id} text={option.label}>{option.label}</Option>
                      ))}
                    </Combobox>
                  </Field>
                )}
                {planDraft.typeCode === PLAN_TYPE_CODES.project && (
                  <Field label="Project">
                    <Combobox
                      inlinePopup
                      placeholder="Search and select Project"
                      selectedOptions={planDraft.projectId ? [planDraft.projectId] : []}
                      onOptionSelect={(_, data) => {
                        setPlanDraft((current) => ({
                          ...current,
                          projectId: data.optionValue,
                        }));
                      }}
                      disabled={lookupLoading}
                    >
                      {projectLookupOptions.map((option) => (
                        <Option key={option.id} value={option.id} text={option.label}>{option.label}</Option>
                      ))}
                    </Combobox>
                  </Field>
                )}
                {planDraft.typeCode === PLAN_TYPE_CODES.turnaround && (
                  <Field label="Turnaround">
                    <Combobox
                      inlinePopup
                      placeholder="Search and select Turnaround"
                      selectedOptions={planDraft.taRevisionId ? [planDraft.taRevisionId] : []}
                      onOptionSelect={(_, data) => {
                        setPlanDraft((current) => ({
                          ...current,
                          taRevisionId: data.optionValue,
                        }));
                      }}
                      disabled={lookupLoading}
                    >
                      {taRevisionLookupOptions.map((option) => (
                        <Option key={option.id} value={option.id} text={option.label}>{option.label}</Option>
                      ))}
                    </Combobox>
                  </Field>
                )}
                <Field label="System">
                  <Input
                    value={planDraft.system}
                    onChange={(_, data) => setPlanDraft((current) => ({ ...current, system: data.value }))}
                  />
                </Field>
              </div>
            </DialogContent>
            <Divider />
            <div className={styles.unsavedResponsesActions}>
              <ResponsiveButton appearance="primary" icon={<Save24Regular />} label="OK" onClick={() => { void onCreatePlan(); }} />
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  );
}
