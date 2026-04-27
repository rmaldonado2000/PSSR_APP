import { Badge, Button, Caption1, Dropdown, Field, Input, Option, ProgressBar, Tab, TabList, Tooltip, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { Add24Regular, ArrowClockwise24Regular, Checkmark24Regular, ClipboardTask24Regular, Info24Regular, MoreHorizontal24Regular, Person24Regular, Save24Regular, TableMoveAbove24Regular, Tag16Regular, Wrench24Regular } from '@fluentui/react-icons';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { formatDate, truncate } from '../app/format';
import { getApprovalDecisionTone, getChecklistStatusTone, getDeficiencyStatusTone, getPlanPhaseTone } from '../app/semanticColors';
import type { ApprovalVm, ChecklistVm, DeficiencyVm, PlanDetailsDraftVm, PlanVm, TeamMemberVm } from '../app/types';
import { DataState, GalleryListItem, ResponsiveButton, RowCard, SectionPanel, StatusChip, VirtualizedList } from '../components/ui';
import type { PlanDetailsTab } from '../app/router';

const MOBILE_TAB_QUERY = '(max-width: 700px)';
const MOBILE_VISIBLE_TAB_COUNT = 3;
const DESKTOP_CHECKLIST_ROW_HEIGHT = 128;
const MOBILE_CHECKLIST_ROW_HEIGHT = 144;
const DESKTOP_DEFICIENCY_ROW_HEIGHT = 134;
const MOBILE_DEFICIENCY_ROW_HEIGHT = 160;
const DESKTOP_APPROVAL_ROW_HEIGHT = 118;
const MOBILE_APPROVAL_ROW_HEIGHT = 132;
const DESKTOP_TEAM_ROW_HEIGHT = 98;
const MOBILE_TEAM_ROW_HEIGHT = 82;

function getIsMobileTabLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_TAB_QUERY).matches;
}

const useStyles = makeStyles({
  screenPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    height: '100%',
    minHeight: 0,
  },
  controlsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    alignItems: 'end',
  },
  pageTabs: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
    overflowX: 'hidden',
    '@media (max-width: 700px)': {
      '& [role="tab"]': {
        flex: '1 1 0',
        minWidth: 0,
        justifyContent: 'center',
        paddingLeft: tokens.spacingHorizontalXS,
        paddingRight: tokens.spacingHorizontalXS,
      },
    },
  },
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  tabActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
    position: 'relative',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXXS,
    },
  },
  mobileOverflowButton: {
    minWidth: '36px',
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
  },
  mobileOverflowPanel: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    zIndex: 2,
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: '180px',
    padding: tokens.spacingHorizontalXS,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
  },
  mobileOverflowItem: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  mobileTabLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '@media (max-width: 700px)': {
      fontSize: tokens.fontSizeBase200,
      lineHeight: tokens.lineHeightBase200,
    },
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
  hasPlanDetailsChanges: boolean;
  hasTemplateAccess: boolean;
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
}

export default function PlanDetailsScreen(props: PlanDetailsScreenProps): ReactNode {
  const styles = useStyles();
  const [isMobileTabLayout, setIsMobileTabLayout] = useState<boolean>(getIsMobileTabLayout);
  const [isMobileOverflowOpen, setIsMobileOverflowOpen] = useState<boolean>(false);

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

  useEffect(() => {
    if (!isMobileTabLayout) {
      setIsMobileOverflowOpen(false);
    }
  }, [isMobileTabLayout]);

  useEffect(() => {
    setIsMobileOverflowOpen(false);
  }, [props.planTab]);

  const checklistTabLabel = `Checklists (${props.checklists.length})`;
  const deficiencyTabLabel = `Deficiencies (${props.deficiencies.length})`;
  const planTabs = useMemo(() => ([
    { value: 'details' as PlanDetailsTab, label: 'Details', icon: <Info24Regular /> },
    { value: 'checklists' as PlanDetailsTab, label: checklistTabLabel, icon: <ClipboardTask24Regular /> },
    { value: 'deficiencies' as PlanDetailsTab, label: deficiencyTabLabel, icon: <Wrench24Regular /> },
    { value: 'approvals' as PlanDetailsTab, label: 'Approvals', icon: <TableMoveAbove24Regular /> },
    { value: 'team' as PlanDetailsTab, label: 'Team', icon: <Person24Regular /> },
  ]), [checklistTabLabel, deficiencyTabLabel]);

  const selectedTabIndex = Math.max(planTabs.findIndex((tab) => tab.value === props.planTab), 0);
  const mobileVisibleStart = Math.min(
    Math.max(selectedTabIndex - (MOBILE_VISIBLE_TAB_COUNT - 1), 0),
    Math.max(planTabs.length - MOBILE_VISIBLE_TAB_COUNT, 0),
  );
  const visibleTabs = isMobileTabLayout
    ? planTabs.slice(mobileVisibleStart, mobileVisibleStart + MOBILE_VISIBLE_TAB_COUNT)
    : planTabs;
  const overflowTabs = isMobileTabLayout
    ? planTabs.filter((_, index) => index < mobileVisibleStart || index >= mobileVisibleStart + MOBILE_VISIBLE_TAB_COUNT)
    : [];
  const checklistRowHeight = isMobileTabLayout ? MOBILE_CHECKLIST_ROW_HEIGHT : DESKTOP_CHECKLIST_ROW_HEIGHT;
  const deficiencyRowHeight = isMobileTabLayout ? MOBILE_DEFICIENCY_ROW_HEIGHT : DESKTOP_DEFICIENCY_ROW_HEIGHT;
  const approvalRowHeight = isMobileTabLayout ? MOBILE_APPROVAL_ROW_HEIGHT : DESKTOP_APPROVAL_ROW_HEIGHT;
  const teamRowHeight = isMobileTabLayout ? MOBILE_TEAM_ROW_HEIGHT : DESKTOP_TEAM_ROW_HEIGHT;
  return (
    <div className={styles.screenPanel}>
      <div className={styles.tabsRow}>
        <TabList
          className={styles.pageTabs}
          selectedValue={props.planTab}
          onTabSelect={(_, data) => props.onPlanTabChange(data.value as PlanDetailsTab)}
          size={isMobileTabLayout ? 'medium' : 'large'}
        >
          {visibleTabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={isMobileTabLayout ? undefined : tab.icon}>
              <span className={styles.mobileTabLabel}>{tab.label}</span>
            </Tab>
          ))}
        </TabList>

        <div className={styles.tabActions}>
          {overflowTabs.length > 0 && (
            <>
              <Button
                appearance="subtle"
                className={styles.mobileOverflowButton}
                aria-label="More tabs"
                aria-expanded={isMobileOverflowOpen}
                icon={<MoreHorizontal24Regular />}
                onClick={() => setIsMobileOverflowOpen((value) => !value)}
              />
              {isMobileOverflowOpen && (
                <div className={styles.mobileOverflowPanel}>
                  {overflowTabs.map((tab) => (
                    <Button
                      key={tab.value}
                      appearance="subtle"
                      className={styles.mobileOverflowItem}
                      icon={tab.icon}
                      onClick={() => {
                        setIsMobileOverflowOpen(false);
                        props.onPlanTabChange(tab.value);
                      }}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
          <ResponsiveButton appearance="subtle" icon={<ArrowClockwise24Regular />} label="Refresh Plan" onClick={props.onRefreshPlan} />
        </div>
      </div>

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
                  disabled={!props.isPlanEditable}
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
            <ResponsiveButton icon={<Add24Regular />} label="Add Checklist" disabled={!props.hasTemplateAccess} onClick={props.onOpenChecklistTemplatePicker} />
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
                const statusTone = getChecklistStatusTone(checklist.statusLabel);

                return (
                  <GalleryListItem>
                    <RowCard
                      title={checklist.name}
                      icon={<ClipboardTask24Regular />}
                      accentColor={statusTone.accentColor}
                      badges={(
                        <>
                          <StatusChip value={checklist.statusLabel ?? 'No Status'} tone={statusTone} icon={<Info24Regular />} />
                          <Badge size="small" appearance="tint" color="informative" icon={<Tag16Regular />}>
                            {checklist.disciplineLabel ?? 'No Discipline'}
                          </Badge>
                        </>
                      )}
                      meta={[
                        { label: 'Autonumber', value: checklist.checklistId },
                      ]}
                      details={(
                        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS, marginTop: tokens.spacingVerticalS }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>Progress</Caption1>
                            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{`${checklist.questionCompletedCount}/${checklist.questionTotalCount} Questions`}</Caption1>
                          </div>
                          <ProgressBar value={checklist.questionTotalCount > 0 ? checklist.questionCompletedCount / checklist.questionTotalCount : 0} />
                        </div>
                      )}
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
          action={<ResponsiveButton icon={<Add24Regular />} label="New Deficiency" onClick={props.onOpenNewDeficiency} />}
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
                const statusTone = getDeficiencyStatusTone(deficiency.statusLabel);

                return (
                  <GalleryListItem>
                    <RowCard
                      title={deficiency.name}
                      subtitle={deficiency.questionName ?? deficiency.deficiencyId ?? 'Deficiency'}
                      accentColor={statusTone.accentColor}
                      badges={(
                        <StatusChip value={deficiency.statusLabel ?? 'No Status'} tone={statusTone} />
                      )}
                      meta={[
                        { label: 'Question', value: deficiency.questionName ?? 'N/A' },
                        { label: 'Category', value: deficiency.initialCategoryLabel ?? 'N/A' },
                        { label: 'Comment', value: deficiency.generalComment ?? 'N/A' },
                      ]}
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
                const decisionTone = getApprovalDecisionTone(approval.decisionLabel);
                const phaseTone = getPlanPhaseTone(approval.stageLabel);

                return (
                  <GalleryListItem>
                    <RowCard
                      title={approval.roleLabel ?? 'Role not set'}
                      icon={<TableMoveAbove24Regular />}
                      accentColor={decisionTone.accentColor}
                      badges={(
                        <>
                          <StatusChip value={approval.decisionLabel ?? 'No Decision'} tone={decisionTone} icon={<Info24Regular />} />
                          <StatusChip value={approval.stageLabel ?? 'No Phase'} tone={phaseTone} icon={<Tag16Regular />} />
                        </>
                      )}
                      meta={[
                        { label: 'Approved On', value: formatDate(approval.approveOn) },
                        { label: 'Comment', value: truncate(approval.comment ?? 'No comment') },
                      ]}
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
          action={<ResponsiveButton icon={<Add24Regular />} label="Add Team Member" onClick={props.onOpenAddTeamMember} />}
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
                  <RowCard
                    title={member.name ?? 'Unnamed member'}
                    icon={<Person24Regular />}
                    accentColor={tokens.colorPaletteBlueBorderActive}
                    badges={(
                      <Badge size="small" appearance="tint" color="brand" icon={<Tag16Regular />}>
                        {member.roleLabel ?? 'Role not assigned'}
                      </Badge>
                    )}
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
