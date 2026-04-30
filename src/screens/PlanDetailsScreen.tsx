import { Caption1, Dropdown, Field, Input, MessageBar, Option, ProgressBar, Tab, TabList, Text, type ButtonProps, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { Add24Regular, ArrowClockwise24Regular, Checkmark12Regular, CheckmarkCircle16Regular, ClipboardTask24Regular, Info24Regular, Person24Regular, Save24Regular, TableMoveAbove24Regular, Tag16Regular, Wrench24Regular } from '@fluentui/react-icons';
import { Fragment, useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { formatRoleLabel } from '../app/format';
import { isPlanApproved, isPlanFinalized, PLAN_STAGE_APPROVAL, PLAN_STAGE_COMPLETION, PLAN_STAGE_DRAFT, PLAN_STAGE_EXECUTION, PLAN_STAGE_PLAN } from '../app/lifecycle';
import type { ApprovalVm, ChecklistVm, DeficiencyVm, PlanDetailsDraftVm, PlanVm, TeamMemberVm } from '../app/types';
import { mobileHeaderStyles } from '../components/mobileHeaderStyles';
import { CardDate, DataState, GalleryCard, GalleryListItem, Pill, ResponsiveButton, SectionPanel, VirtualizedList } from '../components/ui';
import type { PlanDetailsTab } from '../app/router';

const MOBILE_TAB_QUERY = '(max-width: 700px)';
const DESKTOP_CHECKLIST_ROW_HEIGHT = 128;
const MOBILE_CHECKLIST_ROW_HEIGHT = 156;
const DESKTOP_DEFICIENCY_ROW_HEIGHT = 188;
const MOBILE_DEFICIENCY_ROW_HEIGHT = 236;
const DESKTOP_APPROVAL_ROW_HEIGHT = 172;
const MOBILE_APPROVAL_ROW_HEIGHT = 216;
const DESKTOP_TEAM_ROW_HEIGHT = 142;
const MOBILE_TEAM_ROW_HEIGHT = 158;

const PLAN_LIFECYCLE_STAGES = [
  { code: PLAN_STAGE_DRAFT, label: 'Draft', icon: <Info24Regular /> },
  { code: PLAN_STAGE_PLAN, label: 'Plan', icon: <ClipboardTask24Regular /> },
  { code: PLAN_STAGE_EXECUTION, label: 'Execution', icon: <Wrench24Regular /> },
  { code: PLAN_STAGE_APPROVAL, label: 'Approval', icon: <Tag16Regular /> },
  { code: PLAN_STAGE_COMPLETION, label: 'Completion', icon: <CheckmarkCircle16Regular /> },
] as const;

function getIsMobileTabLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_TAB_QUERY).matches;
}

const useStyles = makeStyles({
  ...mobileHeaderStyles,
  screenPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    overflowX: 'hidden',
  },
  summarySection: {
    flexShrink: 0,
  },
  summaryCard: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    justifyItems: 'center',
  },
  lifecycleRail: {
    width: '100%',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
    '@media (max-width: 700px)': {
      paddingLeft: tokens.spacingHorizontalM,
      paddingRight: tokens.spacingHorizontalM,
    },
  },
  lifecycleStepper: {
    display: 'grid',
    gridTemplateColumns: '42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px',
    alignItems: 'center',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (max-width: 700px)': {
      gridTemplateColumns: '34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px',
    },
  },
  lifecycleNodeCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifecycleStepCircle: {
    width: '42px',
    height: '42px',
    borderRadius: tokens.borderRadiusCircular,
    display: 'grid',
    placeItems: 'center',
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
    boxSizing: 'border-box',
    '@media (max-width: 700px)': {
      width: '34px',
      height: '34px',
    },
  },
  lifecycleStepCircleCompleted: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    border: `2px solid ${tokens.colorPaletteGreenBorderActive}`,
    color: tokens.colorPaletteGreenForeground2,
  },
  lifecycleStepCircleApproved: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    border: `2px solid ${tokens.colorPaletteGreenBorderActive}`,
    color: tokens.colorPaletteGreenForeground2,
    boxShadow: `0 0 0 4px ${tokens.colorPaletteGreenBackground1}`,
  },
  lifecycleStepCircleActive: {
    backgroundColor: tokens.colorBrandBackground2,
    border: `2px solid ${tokens.colorBrandForeground1}`,
    color: tokens.colorBrandForeground1,
    boxShadow: `0 0 0 4px ${tokens.colorBrandBackgroundInvertedHover}`,
  },
  lifecycleLabels: {
    display: 'grid',
    gridTemplateColumns: '42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px minmax(12px, 1fr) 42px',
    alignItems: 'start',
    width: '100%',
    marginTop: tokens.spacingVerticalXS,
    '@media (max-width: 700px)': {
      gridTemplateColumns: '34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px minmax(4px, 1fr) 34px',
      marginTop: tokens.spacingVerticalXXS,
    },
  },
  lifecycleLabelCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 0,
    gridRow: '1',
  },
  lifecycleStepLabel: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    width: '100%',
    whiteSpace: 'nowrap',
    wordBreak: 'normal',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    '@media (max-width: 700px)': {
      fontSize: tokens.fontSizeBase100,
      lineHeight: tokens.lineHeightBase100,
    },
  },
  lifecycleStepLabelActive: {
    color: tokens.colorNeutralForeground1,
  },
  lifecycleStepLabelCompleted: {
    color: tokens.colorNeutralForeground2,
  },
  lifecycleConnector: {
    height: '2px',
    width: '100%',
    backgroundColor: tokens.colorNeutralStroke2,
    justifySelf: 'stretch',
  },
  lifecycleConnectorCompleted: {
    backgroundColor: tokens.colorPaletteGreenBorderActive,
  },
  summaryMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'nowrap',
    width: '100%',
    minWidth: 0,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  summaryProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flex: '1 1 auto',
    minWidth: 0,
    maxWidth: 'none',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  summaryProgressBar: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  controlsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    alignItems: 'end',
  },
  chipsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
  detailSection: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  detailNote: {
    color: tokens.colorNeutralForeground3,
  },
  listPanel: {
    display: 'grid',
    gridTemplateRows: 'auto auto minmax(0, 1fr)',
    minHeight: 0,
    flex: '1 1 auto',
  },
});

export interface PlanDetailsScreenProps {
  loading: boolean;
  error: string;
  selectedPlan: PlanVm;
  planTab: PlanDetailsTab;
  planDetailsDraft: PlanDetailsDraftVm;
  checklists: ChecklistVm[];
  deficiencies: DeficiencyVm[];
  approvals: ApprovalVm[];
  teamMembers: TeamMemberVm[];
  siteOptions: Array<{ key: number; label: string }>;
  stageOptions: Array<{ key: number; label: string }>;
  isPlanEditable: boolean;
  isPhaseEditable: boolean;
  hasPlanDetailsChanges: boolean;
  hasTemplateAccess: boolean;
  headerCommands: Array<{
    key: string;
    label: string;
    icon: ReactElement;
    appearance?: ButtonProps['appearance'];
    disabled?: boolean;
    title?: string;
    onClick: () => void;
  }>;
  warningMessages: string[];
  isSummaryExpanded: boolean;
  canManageChecklistStructure: boolean;
  checklistActionTitle?: string;
  canCreateDeficiency: boolean;
  deficiencyActionTitle?: string;
  canManageTeam: boolean;
  teamActionTitle?: string;
  onPlanDetailsChange: (changes: Partial<PlanDetailsDraftVm>) => void;
  onResetPlanDetails: () => void;
  onSavePlanDetails: () => void;
  onPlanTabChange: (tab: PlanDetailsTab) => void;
  onOpenChecklistTemplatePicker: () => void;
  onOpenTemplateLibrary: () => void;
  onRefreshPlan: () => void;
  onOpenChecklist: (checklist: ChecklistVm) => void;
  onOpenNewDeficiency: () => void;
  onEditDeficiency: (deficiency: DeficiencyVm) => void;
  onOpenAddTeamMember: () => void;
  onEditTeamMember: (member: TeamMemberVm) => void;
}

export default function PlanDetailsScreen(props: PlanDetailsScreenProps): ReactNode {
  const styles = useStyles();
  const [isMobileTabLayout, setIsMobileTabLayout] = useState<boolean>(getIsMobileTabLayout);
  const progressValue = Math.max(0, Math.min(1, props.selectedPlan.percentComplete / 100));
  const currentStageIndex = PLAN_LIFECYCLE_STAGES.findIndex((stage) => stage.code === props.selectedPlan.stageCode);
  const normalizedCurrentStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const isCompletionFinalized = isPlanFinalized(props.approvals);
  const isPlanApprovalApproved = props.selectedPlan.stageCode === PLAN_STAGE_PLAN && isPlanApproved(props.approvals);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_TAB_QUERY);
    const onChange = () => {
      setIsMobileTabLayout(mediaQuery.matches);
    };

    onChange();
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  const checklistTabLabel = `Checklists (${props.checklists.length})`;
  const deficiencyTabLabel = `Deficiencies (${props.deficiencies.length})`;
  const planTabs = useMemo(() => ([
    { value: 'details' as PlanDetailsTab, label: 'Details', icon: <Info24Regular /> },
    { value: 'checklists' as PlanDetailsTab, label: checklistTabLabel, icon: <ClipboardTask24Regular /> },
    { value: 'deficiencies' as PlanDetailsTab, label: deficiencyTabLabel, icon: <Wrench24Regular /> },
    { value: 'approvals' as PlanDetailsTab, label: 'Approvals', icon: <TableMoveAbove24Regular /> },
    { value: 'team' as PlanDetailsTab, label: 'Team', icon: <Person24Regular /> },
  ]), [checklistTabLabel, deficiencyTabLabel]);

  const checklistRowHeight = isMobileTabLayout ? MOBILE_CHECKLIST_ROW_HEIGHT : DESKTOP_CHECKLIST_ROW_HEIGHT;
  const deficiencyRowHeight = isMobileTabLayout ? MOBILE_DEFICIENCY_ROW_HEIGHT : DESKTOP_DEFICIENCY_ROW_HEIGHT;
  const approvalRowHeight = isMobileTabLayout ? MOBILE_APPROVAL_ROW_HEIGHT : DESKTOP_APPROVAL_ROW_HEIGHT;
  const teamRowHeight = isMobileTabLayout ? MOBILE_TEAM_ROW_HEIGHT : DESKTOP_TEAM_ROW_HEIGHT;
  return (
    <div className={styles.screenPanel}>
      {props.isSummaryExpanded && (
        <SectionPanel className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.lifecycleRail}>
              <div className={styles.lifecycleStepper}>
                {PLAN_LIFECYCLE_STAGES.map((stage, index) => {
                  const isPlanApprovedStep = isPlanApprovalApproved && stage.code === PLAN_STAGE_PLAN;
                  const isCompleted = isCompletionFinalized
                    ? index <= normalizedCurrentStageIndex
                    : index < normalizedCurrentStageIndex;
                  const isActive = isCompletionFinalized
                    ? false
                    : index === normalizedCurrentStageIndex;
                  const connectorCompleted = isCompletionFinalized
                    ? index < normalizedCurrentStageIndex
                    : index < normalizedCurrentStageIndex;

                  return (
                    <Fragment key={stage.code}>
                      <div className={styles.lifecycleNodeCell}>
                        <div
                          className={mergeClasses(
                            styles.lifecycleStepCircle,
                            isCompleted && styles.lifecycleStepCircleCompleted,
                            isActive && !isPlanApprovedStep && styles.lifecycleStepCircleActive,
                            isPlanApprovedStep && styles.lifecycleStepCircleApproved,
                          )}
                          aria-current={isActive ? 'step' : undefined}
                          aria-label={isPlanApprovedStep ? 'Plan approved' : undefined}
                          role={isPlanApprovedStep ? 'img' : undefined}
                        >
                          {isPlanApprovedStep || isCompleted ? <Checkmark12Regular /> : stage.icon}
                        </div>
                      </div>
                      {index < PLAN_LIFECYCLE_STAGES.length - 1 && (
                        <div
                          className={mergeClasses(
                            styles.lifecycleConnector,
                            connectorCompleted && styles.lifecycleConnectorCompleted,
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>

              <div className={styles.lifecycleLabels}>
                {PLAN_LIFECYCLE_STAGES.map((stage, index) => {
                  const isCompleted = isCompletionFinalized
                    ? index <= normalizedCurrentStageIndex
                    : index < normalizedCurrentStageIndex;
                  const isActive = isCompletionFinalized
                    ? false
                    : index === normalizedCurrentStageIndex;

                  return (
                    <div
                      key={stage.code}
                      className={styles.lifecycleLabelCell}
                      style={{
                        gridColumn: `${(index * 2) + 1} / ${(index * 2) + 2}`,
                      }}
                    >
                      <Text
                        className={mergeClasses(
                          styles.lifecycleStepLabel,
                          isCompleted && styles.lifecycleStepLabelCompleted,
                          isActive && styles.lifecycleStepLabelActive,
                        )}
                      >
                        {stage.label}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.summaryMeta}>
              <Pill
                kind="neutral"
                value={`${props.selectedPlan.checklistCompletedCount}/${props.selectedPlan.checklistTotalCount} ${props.selectedPlan.checklistTotalCount === 1 ? 'Checklist' : 'Checklists'}`}
              />
              <div className={styles.summaryProgress}>
                <ProgressBar value={progressValue} thickness="medium" className={styles.summaryProgressBar} />
                <Text>{Math.round(progressValue * 100)}%</Text>
              </div>
            </div>
          </div>
        </SectionPanel>
      )}

      <div className={styles.tabsRow}>
        <div className={styles.tabScroller}>
          <TabList
            className={styles.pageTabs}
            selectedValue={props.planTab}
            onTabSelect={(_, data) => props.onPlanTabChange(data.value as PlanDetailsTab)}
            size={isMobileTabLayout ? 'medium' : 'large'}
          >
            {planTabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={isMobileTabLayout ? undefined : tab.icon}>
                <span className={styles.mobileTabLabel}>{tab.label}</span>
              </Tab>
            ))}
          </TabList>
        </div>

        <div className={styles.tabActions}>
          {props.headerCommands.map((command) => (
            <ResponsiveButton
              key={command.key}
              appearance={command.appearance ?? 'secondary'}
              icon={command.icon}
              label={command.label}
              disabled={command.disabled}
              title={command.title}
              onClick={command.onClick}
            />
          ))}
          <ResponsiveButton appearance="subtle" icon={<ArrowClockwise24Regular />} label="Refresh Plan" onClick={props.onRefreshPlan} />
        </div>
      </div>

      {props.warningMessages.length > 0 && (
        <MessageBar intent="warning" className={styles.warningBar}>
          <div className={styles.warningBody}>
            <Text className={styles.warningTitle}>Lifecycle conditions not met</Text>
            <Text className={styles.warningText}>{props.warningMessages.join(' ')}</Text>
          </div>
        </MessageBar>
      )}

      {props.planTab === 'details' && (
        <SectionPanel
          title="Plan Details"
          action={props.isPlanEditable ? (
            <div className={styles.controlsRow}>
              <ResponsiveButton appearance="secondary" icon={<ArrowClockwise24Regular />} label="Reset" disabled={!props.hasPlanDetailsChanges || props.loading} onClick={props.onResetPlanDetails} />
              <ResponsiveButton appearance="primary" icon={<Save24Regular />} label="Save Changes" disabled={!props.hasPlanDetailsChanges || !props.planDetailsDraft.name.trim() || props.loading} onClick={props.onSavePlanDetails} />
            </div>
          ) : undefined}
        >
          <div className={styles.detailSection}>
            <Caption1 className={styles.detailNote}>
              {props.isPlanEditable
                ? 'This plan is in Draft. Core plan details can be edited here.'
                : 'This plan is read-only because its phase is no longer Draft.'}
            </Caption1>

            <div className={styles.detailGrid}>
              <Field label="Plan ID">
                <Input value={props.selectedPlan.planId} readOnly disabled />
              </Field>

              <Field label="Type">
                <Input value={props.selectedPlan.typeLabel ?? 'N/A'} readOnly disabled />
              </Field>

              <Field label="Name" required>
                <Input
                  value={props.planDetailsDraft.name}
                  onChange={(_, data) => props.onPlanDetailsChange({ name: data.value })}
                  disabled={!props.isPlanEditable}
                />
              </Field>

              <Field label="Event">
                <Input
                  value={props.planDetailsDraft.event}
                  onChange={(_, data) => props.onPlanDetailsChange({ event: data.value })}
                  disabled={!props.isPlanEditable}
                />
              </Field>

              <Field label="Site">
                <Dropdown
                  inlinePopup
                  value={props.siteOptions.find((item) => item.key === props.planDetailsDraft.siteCode)?.label}
                  selectedOptions={props.planDetailsDraft.siteCode ? [String(props.planDetailsDraft.siteCode)] : []}
                  onOptionSelect={(_, data) => {
                    if (data.optionValue) {
                      props.onPlanDetailsChange({ siteCode: Number(data.optionValue) });
                    }
                  }}
                  disabled={!props.isPlanEditable}
                >
                  {props.siteOptions.map((option) => (
                    <Option key={option.key} value={String(option.key)}>{option.label}</Option>
                  ))}
                </Dropdown>
              </Field>

              <Field label="Phase">
                <Dropdown
                  inlinePopup
                  value={props.stageOptions.find((item) => item.key === props.planDetailsDraft.stageCode)?.label}
                  selectedOptions={props.planDetailsDraft.stageCode ? [String(props.planDetailsDraft.stageCode)] : []}
                  onOptionSelect={(_, data) => {
                    if (data.optionValue) {
                      props.onPlanDetailsChange({ stageCode: Number(data.optionValue) });
                    }
                  }}
                  disabled={!props.isPhaseEditable}
                >
                  {props.stageOptions.map((option) => (
                    <Option key={option.key} value={String(option.key)}>{option.label}</Option>
                  ))}
                </Dropdown>
              </Field>

              <Field label="System">
                <Input
                  value={props.planDetailsDraft.system}
                  onChange={(_, data) => props.onPlanDetailsChange({ system: data.value })}
                  disabled={!props.isPlanEditable}
                />
              </Field>

              <Field label="Linked Record">
                <Input
                  value={props.selectedPlan.mocName ?? props.selectedPlan.projectName ?? props.selectedPlan.taRevisionName ?? 'N/A'}
                  readOnly
                  disabled
                />
              </Field>
            </div>
          </div>
        </SectionPanel>
      )}

      {props.planTab === 'checklists' && (
        <SectionPanel
          title="Plan Checklists"
          className={styles.listPanel}
          action={(
            <ResponsiveButton icon={<Add24Regular />} label="Add Checklist" disabled={!props.hasTemplateAccess || !props.canManageChecklistStructure} title={props.checklistActionTitle} onClick={props.onOpenChecklistTemplatePicker} />
          )}
        >
          <DataState
            loading={props.loading}
            error={props.error}
            empty={props.checklists.length === 0}
            emptyTitle="No checklists are associated with this plan"
          >
            <VirtualizedList
              items={props.checklists}
              rowHeight={checklistRowHeight}
              fillHeight
              layout="stack"
              gap="4px"
                row={(checklist) => {
                  return (
                  <GalleryListItem>
                    <GalleryCard
                      title={`${checklist.checklistId ?? '—'} - ${checklist.name}`}
                      accentKind="status"
                      accentValue={checklist.statusLabel ?? ''}
                      pills={(
                        <>
                          <Pill kind="status" value={checklist.statusLabel ?? 'No Status'} />
                          <Pill kind="neutral" value={checklist.disciplineLabel ?? 'No Discipline'} icon={<Tag16Regular />} />
                        </>
                      )}
                      progress={{
                        value: checklist.questionTotalCount > 0 ? checklist.questionCompletedCount / checklist.questionTotalCount : 0,
                        label: `${checklist.questionCompletedCount}/${checklist.questionTotalCount} Questions`,
                      }}
                      footer={<CardDate value={checklist.createdOn} />}
                      onClick={() => props.onOpenChecklist(checklist)}
                    />
                  </GalleryListItem>
                );
              }}
            />
          </DataState>
        </SectionPanel>
      )}

      {props.planTab === 'deficiencies' && (
        <SectionPanel
          title="Deficiencies"
          className={styles.listPanel}
          action={<ResponsiveButton icon={<Add24Regular />} label="New Deficiency" disabled={!props.canCreateDeficiency} title={props.deficiencyActionTitle} onClick={props.onOpenNewDeficiency} />}
        >
          <DataState
            loading={props.loading}
            error={props.error}
            empty={props.deficiencies.length === 0}
            emptyTitle={props.checklists.length === 0 ? 'No checklists are associated with this plan' : 'No deficiencies for this plan'}
            emptyBody={props.checklists.length === 0 ? 'Attach a checklist to this plan before tracking checklist deficiencies.' : undefined}
          >
            <VirtualizedList
              items={props.deficiencies}
              rowHeight={deficiencyRowHeight}
              fillHeight
              layout="stack"
              gap="4px"
                row={(deficiency) => {
                  return (
                  <GalleryListItem>
                    <GalleryCard
                      title={`${deficiency.deficiencyId ?? '—'} - ${deficiency.name}`}
                      accentKind="status"
                      accentValue={deficiency.statusLabel ?? ''}
                      pills={(
                        <Pill kind="status" value={deficiency.statusLabel ?? 'No Status'} />
                      )}
                      meta={[
                        { label: 'Initial Cat', value: deficiency.initialCategoryLabel },
                        { label: 'Accepted Cat', value: deficiency.acceptedCategoryLabel },
                        { label: 'General Comment', value: deficiency.generalComment, valueBehavior: 'clamp' },
                        { label: 'Closing Comment', value: deficiency.closeoutComment, valueBehavior: 'clamp' },
                      ]}
                      footer={<CardDate value={deficiency.createdOn} />}
                      onClick={() => props.onEditDeficiency(deficiency)}
                    />
                  </GalleryListItem>
                );
              }}
            />
          </DataState>
        </SectionPanel>
      )}

      {props.planTab === 'approvals' && (
        <SectionPanel title="Approvals" className={styles.listPanel}>
          <DataState
            loading={props.loading}
            error={props.error}
            empty={props.approvals.length === 0}
            emptyTitle="No approval records"
          >
            <VirtualizedList
              items={props.approvals}
              rowHeight={approvalRowHeight}
              fillHeight
              layout="stack"
              gap="4px"
                row={(approval) => {
                  return (
                  <GalleryListItem>
                    <GalleryCard
                      title={approval.memberName?.trim() || 'Member unavailable'}
                      accentKind="status"
                      accentValue={approval.decisionLabel ?? ''}
                      pills={(
                        <>
                          <Pill kind="phase" value={approval.stageLabel ?? 'No Phase'} icon={<Tag16Regular />} />
                          <Pill kind="status" value={approval.decisionLabel ?? 'In Progress'} />
                        </>
                      )}
                      meta={[
                        { label: 'Role', value: formatRoleLabel(approval.roleLabel, 'Role not set') },
                        { label: 'Approved', value: approval.approveOn },
                        { label: 'Comment', value: approval.comment, valueBehavior: 'clamp' },
                      ]}
                      footer={<CardDate value={approval.createdOn} />}
                    />
                  </GalleryListItem>
                );
              }}
            />
          </DataState>
        </SectionPanel>
      )}

      {props.planTab === 'team' && (
        <SectionPanel
          title="Team"
          className={styles.listPanel}
          action={<ResponsiveButton icon={<Add24Regular />} label="Add Team Member" disabled={!props.canManageTeam} title={props.teamActionTitle} onClick={props.onOpenAddTeamMember} />}
        >
          <DataState
            loading={props.loading}
            error={props.error}
            empty={props.teamMembers.length === 0}
            emptyTitle="No team members assigned"
          >
            <VirtualizedList
              items={props.teamMembers}
              rowHeight={teamRowHeight}
              fillHeight
              layout="stack"
              gap="4px"
              row={(member) => (
                <GalleryListItem>
                  <GalleryCard
                    title={member.name ?? 'Unnamed member'}
                    accentKind="neutral"
                    accentValue={formatRoleLabel(member.roleLabel, 'Role not assigned')}
                    pills={(
                      <Pill kind="neutral" value={formatRoleLabel(member.roleLabel, 'Role not assigned')} icon={<Tag16Regular />} />
                    )}
                    meta={[
                      { label: 'Email', value: member.email, valueBehavior: 'truncate' },
                      { label: 'Phone Number', value: member.phone },
                    ]}
                    footer={member.createdOn ? <CardDate value={member.createdOn} /> : undefined}
                    onClick={props.canManageTeam ? () => props.onEditTeamMember(member) : undefined}
                  />
                </GalleryListItem>
              )}
            />
          </DataState>
        </SectionPanel>
      )}
    </div>
  );
}
