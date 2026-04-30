import { Button, Field, Input, MessageBar, ProgressBar, Tab, TabList, Text, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { Add24Regular, Checkmark24Regular, ClipboardTask24Regular, DismissCircle24Regular, Info24Regular, Save24Regular, Warning24Filled } from '@fluentui/react-icons';
import { useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import type { ChecklistVm, DeficiencyVm, PlanVm, QuestionVm } from '../app/types';
import { mobileHeaderStyles } from '../components/mobileHeaderStyles';
import { DataState, GalleryListItem, Pill, ResponsiveButton, GalleryCard, CardDate, SectionPanel, VirtualizedList } from '../components/ui';
import type { ChecklistDetailsTab } from '../app/router';

const MOBILE_TAB_QUERY = '(max-width: 700px)';
const SWIPE_PREVIEW_LIMIT = 96;
const SWIPE_TRIGGER_DISTANCE = 84;

function getIsMobileTabLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_TAB_QUERY).matches;
}

const useStyles = makeStyles({
  ...mobileHeaderStyles,
  screenPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    overflowX: 'hidden',
  },
  summarySection: {
    flexShrink: 0,
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
    minHeight: '40px',
  },
  summaryPills: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  summaryProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flex: '1 1 280px',
    minWidth: '220px',
  },
  summaryProgressLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
  },
  summaryProgressBar: {
    flex: '1 1 180px',
    minWidth: '140px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
  deficienciesList: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  listPanel: {
    display: 'grid',
    gridTemplateRows: 'auto auto minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    overflowX: 'hidden',
  },
  questionRow: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'grid',
    gridTemplateColumns: 'max-content minmax(0, 1fr) auto',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '100%',
    boxSizing: 'border-box',
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'max-content minmax(0, 1fr)',
      gap: tokens.spacingVerticalM,
    },
    '@media (max-width: 700px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: tokens.spacingVerticalS,
    },
  },
  questionRowSwipeable: {
    touchAction: 'pan-y',
    willChange: 'transform',
  },
  questionRowYes: {
    backgroundColor: '#edf7ee',
    border: '1px solid #9fd3a5',
  },
  questionRowNo: {
    backgroundColor: '#fdeeee',
    border: '1px solid #e2a6a6',
  },
  questionRowNa: {
    backgroundColor: '#f2f4f7',
    border: '1px solid #c8ced8',
  },
  sequenceCell: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  requiredIndicator: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  questionText: {
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
  questionContent: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    maxWidth: '100%',
  },
  deficiencyHint: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  deficiencyHintText: {
    color: '#8a5a00',
  },
  deficiencyHintButton: {
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 'auto',
    color: tokens.colorBrandForeground1,
  },
  deficiencyCount: {
    minWidth: 'auto',
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
    color: '#b65a00',
    fontWeight: tokens.fontWeightSemibold,
  },
  answerCell: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'flex-end',
    minWidth: 0,
    maxWidth: '100%',
    '@media (max-width: 900px)': {
      gridColumn: '1 / -1',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      justifyContent: 'stretch',
      width: '100%',
      gap: tokens.spacingHorizontalXS,
    },
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  answerButton: {
    minWidth: '72px',
    '@media (max-width: 900px)': {
      width: '100%',
      minWidth: '0',
      paddingLeft: tokens.spacingHorizontalSNudge,
      paddingRight: tokens.spacingHorizontalSNudge,
    },
  },
  chipButtonActiveYes: {
    backgroundColor: '#2f8f46',
    border: '1px solid #2f8f46',
    color: '#ffffff',
    ':hover': {
      backgroundColor: '#247238',
      border: '1px solid #247238',
      color: '#ffffff',
    },
  },
  chipButtonActiveNo: {
    backgroundColor: '#c54b4b',
    border: '1px solid #c54b4b',
    color: '#ffffff',
    ':hover': {
      backgroundColor: '#a73d3d',
      border: '1px solid #a73d3d',
      color: '#ffffff',
    },
  },
  chipButtonActiveNa: {
    backgroundColor: '#6b7280',
    border: '1px solid #6b7280',
    color: '#ffffff',
    ':hover': {
      backgroundColor: '#4b5563',
      border: '1px solid #4b5563',
      color: '#ffffff',
    },
  },
  questionSection: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    minHeight: 0,
    minWidth: 0,
    flex: '1 1 auto',
    gridTemplateRows: 'auto minmax(0, 1fr)',
  },
  questionHeader: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
  },
  questionGalleryRegion: {
    display: 'grid',
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
    overflow: 'hidden',
  },
  mobileQuestionList: {
    display: 'grid',
    gap: '2px',
  },
  swipeRowShell: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: tokens.borderRadiusLarge,
  },
  swipeBackground: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  swipeAction: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalM}`,
    fontWeight: tokens.fontWeightSemibold,
    color: '#ffffff',
    opacity: 0.3,
    transitionDuration: '120ms',
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'ease-out',
  },
  swipeActionYes: {
    flex: '1 1 50%',
    justifyContent: 'flex-start',
    backgroundColor: '#2f8f46',
    transform: 'translateX(-10px)',
  },
  swipeActionNo: {
    flex: '1 1 50%',
    justifyContent: 'flex-end',
    backgroundColor: '#c54b4b',
    transform: 'translateX(10px)',
  },
  swipeActionVisible: {
    opacity: 0.92,
    transform: 'translateX(0)',
  },
  mobileQuestionListShell: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr) auto',
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  mobileQuestionListContent: {
    display: 'grid',
    gap: '2px',
    padding: tokens.spacingHorizontalXS,
    minHeight: 0,
    minWidth: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  mobileQuestionListFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  footerMeta: {
    minWidth: 0,
  },
  footerActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginLeft: 'auto',
  },
  footerStatus: {
    color: tokens.colorNeutralForeground2,
    textAlign: 'right',
  },
});

export interface ChecklistDetailsScreenProps {
  loading: boolean;
  error: string;
  selectedPlan: PlanVm;
  selectedChecklist: ChecklistVm;
  questions: QuestionVm[];
  deficiencies: DeficiencyVm[];
  responseOptions: Array<{ key: number; label: string }>;
  hasPendingChanges: boolean;
  pendingResponseCount: number;
  isSavingResponses: boolean;
  isQuestionAnsweringEnabled: boolean;
  questionAnsweringTitle?: string;
  warningMessages: string[];
  canCreateDeficiency: boolean;
  deficiencyActionTitle?: string;
  canCompleteChecklist: boolean;
  completeChecklistTitle?: string;
  onCompleteChecklist: () => void;
  onQuestionAnswer: (question: QuestionVm, responseCode: number) => void;
  onSaveResponses: () => void;
  onQuestionCommentChange: (questionId: string, comment: string) => void;
  onAddDeficiency: (question: QuestionVm) => void;
  onOpenQuestionDeficiencies: (question: QuestionVm) => void;
  onEditDeficiency: (deficiency: DeficiencyVm) => void;
  isSummaryExpanded: boolean;
  checklistTab: ChecklistDetailsTab;
  onChecklistTabChange: (tab: ChecklistDetailsTab) => void;
}

export default function ChecklistDetailsScreen(props: ChecklistDetailsScreenProps): ReactNode {
  const styles = useStyles();
  const [isMobileTabLayout, setIsMobileTabLayout] = useState<boolean>(getIsMobileTabLayout);
  const [swipeQuestionId, setSwipeQuestionId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const swipeStartRef = useRef<{ questionId: string; x: number; y: number } | null>(null);

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

  const sortedQuestions = useMemo(
    () => [...props.questions].sort((a, b) => a.sequenceOrder - b.sequenceOrder),
    [props.questions],
  );
  const answeredQuestionCount = useMemo(
    () => props.questions.filter((question) => question.responseCode !== undefined).length,
    [props.questions],
  );
  const totalQuestionCount = props.questions.length > 0
    ? props.questions.length
    : props.selectedChecklist.questionTotalCount ?? 0;
  const progressValue = totalQuestionCount > 0 ? answeredQuestionCount / totalQuestionCount : 0;
  const checklistDeficiencies = useMemo(
    () => props.deficiencies.filter((item) => item.checklistId === props.selectedChecklist.id),
    [props.deficiencies, props.selectedChecklist.id],
  );
  const questionTabLabel = `Questions (${sortedQuestions.length})`;
  const checklistTabs = useMemo(() => ([
    { value: 'questions' as ChecklistDetailsTab, label: questionTabLabel, icon: <ClipboardTask24Regular /> },
    { value: 'details' as ChecklistDetailsTab, label: 'Details', icon: <Info24Regular /> },
    { value: 'deficiencies' as ChecklistDetailsTab, label: `Deficiencies (${checklistDeficiencies.length})`, icon: <DismissCircle24Regular /> },
  ]), [checklistDeficiencies.length, questionTabLabel]);
  const deficiencyCountByQuestionId = useMemo(() => {
    return props.deficiencies.reduce((counts, item) => {
      if (!item.questionId) {
        return counts;
      }

      counts.set(item.questionId, (counts.get(item.questionId) ?? 0) + 1);
      return counts;
    }, new Map<string, number>());
  }, [props.deficiencies]);

  const getResponseLabel = (responseCode?: number): string | undefined => {
    return props.responseOptions.find((option) => option.key === responseCode)?.label;
  };

  const yesResponseOption = useMemo(
    () => props.responseOptions.find((option) => option.label.trim().toLowerCase() === 'yes'),
    [props.responseOptions],
  );
  const noResponseOption = useMemo(
    () => props.responseOptions.find((option) => option.label.trim().toLowerCase() === 'no'),
    [props.responseOptions],
  );
  const isSwipeAnsweringEnabled = props.isQuestionAnsweringEnabled && Boolean(yesResponseOption && noResponseOption);

  const isMissingDeficiency = (question: QuestionVm): boolean => {
    return getResponseLabel(question.responseCode) === 'No' && !deficiencyCountByQuestionId.has(question.id);
  };

  const getDeficiencyCount = (question: QuestionVm): number => {
    return deficiencyCountByQuestionId.get(question.id) ?? 0;
  };

  const getQuestionRowClassName = (question: QuestionVm): string => {
    const selectedLabel = getResponseLabel(question.responseCode);

    if (selectedLabel === 'Yes') {
      return styles.questionRowYes;
    }

    if (selectedLabel === 'No') {
      return styles.questionRowNo;
    }

    if (selectedLabel === 'NA') {
      return styles.questionRowNa;
    }

    return '';
  };

  const getActiveButtonClassName = (optionLabel: string): string => {
    if (optionLabel === 'Yes') {
      return styles.chipButtonActiveYes;
    }

    if (optionLabel === 'No') {
      return styles.chipButtonActiveNo;
    }

    if (optionLabel === 'NA') {
      return styles.chipButtonActiveNa;
    }

    return '';
  };

  const resetSwipeState = (): void => {
    setSwipeQuestionId(null);
    setSwipeOffset(0);
    swipeStartRef.current = null;
  };

  const handleQuestionTouchStart = (questionId: string, event: TouchEvent<HTMLDivElement>): void => {
    if (!isSwipeAnsweringEnabled) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    swipeStartRef.current = { questionId, x: touch.clientX, y: touch.clientY };
    setSwipeQuestionId(questionId);
    setSwipeOffset(0);
  };

  const handleQuestionTouchMove = (questionId: string, event: TouchEvent<HTMLDivElement>): void => {
    if (!isSwipeAnsweringEnabled) {
      resetSwipeState();
      return;
    }

    const swipeStart = swipeStartRef.current;
    if (!swipeStart || swipeStart.questionId !== questionId) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - swipeStart.x;
    const deltaY = touch.clientY - swipeStart.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      resetSwipeState();
      return;
    }

    setSwipeQuestionId(questionId);
    setSwipeOffset(Math.max(-SWIPE_PREVIEW_LIMIT, Math.min(SWIPE_PREVIEW_LIMIT, deltaX)));
  };

  const handleQuestionTouchEnd = (question: QuestionVm, event: TouchEvent<HTMLDivElement>): void => {
    if (!isSwipeAnsweringEnabled) {
      resetSwipeState();
      return;
    }

    const swipeStart = swipeStartRef.current;
    if (!swipeStart || swipeStart.questionId !== question.id) {
      resetSwipeState();
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      resetSwipeState();
      return;
    }

    const deltaX = touch.clientX - swipeStart.x;
    const deltaY = touch.clientY - swipeStart.y;

    if (Math.abs(deltaX) >= SWIPE_TRIGGER_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0 && yesResponseOption) {
        props.onQuestionAnswer(question, yesResponseOption.key);
      }

      if (deltaX < 0 && noResponseOption) {
        props.onQuestionAnswer(question, noResponseOption.key);
      }
    }

    resetSwipeState();
  };

  return (
    <div className={styles.screenPanel}>
      {props.isSummaryExpanded && (
        <SectionPanel className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryPills}>
              <Pill kind="neutral" value={props.selectedChecklist.disciplineLabel ?? 'No discipline'} />
              <Pill kind="status" value={props.selectedChecklist.statusLabel ?? 'No Status'} />
            </div>
            <div className={styles.summaryProgress}>
              <Text weight="semibold" className={styles.summaryProgressLabel}>Progress</Text>
              <ProgressBar value={progressValue} thickness="medium" className={styles.summaryProgressBar} />
              <Text>{answeredQuestionCount} / {totalQuestionCount}</Text>
            </div>
          </div>
        </SectionPanel>
      )}

      <div className={styles.questionSection}>
        <div className={styles.questionHeader}>
          <div className={styles.tabsRow}>
            <div className={styles.tabScroller}>
              <TabList
                className={styles.pageTabs}
                selectedValue={props.checklistTab}
                onTabSelect={(_, data) => props.onChecklistTabChange(data.value as ChecklistDetailsTab)}
                size={isMobileTabLayout ? 'medium' : 'large'}
              >
                {checklistTabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} icon={isMobileTabLayout ? undefined : tab.icon}>
                    <span className={styles.mobileTabLabel}>{tab.label}</span>
                  </Tab>
                ))}
              </TabList>
            </div>

            <div className={styles.tabActions}>
              <ResponsiveButton
                appearance="secondary"
                icon={<Checkmark24Regular />}
                label="Complete"
                disabled={!props.canCompleteChecklist}
                title={props.completeChecklistTitle}
                onClick={props.onCompleteChecklist}
              />
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
        </div>

          {props.checklistTab === 'details' && (
            <SectionPanel title="Checklist Details">
              <div className={styles.detailsGrid}>
                <Field label="Plan">
                  <Input value={props.selectedPlan.name} readOnly disabled />
                </Field>
                <Field label="Checklist ID">
                  <Input value={props.selectedChecklist.checklistId ?? 'N/A'} readOnly disabled />
                </Field>
                <Field label="Checklist Name">
                  <Input value={props.selectedChecklist.name} readOnly disabled />
                </Field>
                <Field label="Discipline">
                  <Input value={props.selectedChecklist.disciplineLabel ?? 'N/A'} readOnly disabled />
                </Field>
                <Field label="Status">
                  <Input value={props.selectedChecklist.statusLabel ?? 'N/A'} readOnly disabled />
                </Field>
                <Field label="Progress">
                  <Input value={`${answeredQuestionCount} / ${totalQuestionCount}`} readOnly disabled />
                </Field>
              </div>
            </SectionPanel>
          )}

          {props.checklistTab === 'deficiencies' && (
            <SectionPanel title="Checklist Deficiencies" className={styles.listPanel}>
              <DataState
                loading={props.loading}
                error={props.error}
                empty={checklistDeficiencies.length === 0}
                emptyTitle="No deficiencies are associated with this checklist"
              >
                <VirtualizedList
                  items={checklistDeficiencies}
                  rowHeight={188}
                  fillHeight
                  layout="stack"
                  gap="4px"
                  row={(deficiency) => {
                    return (
                      <GalleryListItem>
                        <GalleryCard
                          key={deficiency.id}
                          title={`${deficiency.deficiencyId ?? '—'} - ${deficiency.name}`}
                          accentKind="status"
                          accentValue={deficiency.statusLabel ?? ''}
                          pills={
                            <Pill kind="status" value={deficiency.statusLabel ?? 'No Status'} />
                          }
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

          {props.checklistTab === 'questions' && (
          <DataState
            loading={props.loading}
            error={props.error}
            empty={props.questions.length === 0}
            emptyTitle="No questions found for this checklist"
          >
            <div className={styles.questionGalleryRegion}>
              <div className={styles.mobileQuestionListShell}>
                <div className={styles.mobileQuestionListContent}>
                  {sortedQuestions.map((question) => (
                    <div key={question.id} className={styles.mobileQuestionList}>
                      <div className={styles.swipeRowShell}>
                        {isSwipeAnsweringEnabled && (
                          <div className={styles.swipeBackground} aria-hidden="true">
                            <div
                              className={mergeClasses(
                                styles.swipeAction,
                                styles.swipeActionYes,
                                swipeQuestionId === question.id && swipeOffset > 24 ? styles.swipeActionVisible : '',
                              )}
                            >
                              Swipe for {yesResponseOption?.label ?? 'Yes'}
                            </div>
                            <div
                              className={mergeClasses(
                                styles.swipeAction,
                                styles.swipeActionNo,
                                swipeQuestionId === question.id && swipeOffset < -24 ? styles.swipeActionVisible : '',
                              )}
                            >
                              Swipe for {noResponseOption?.label ?? 'No'}
                            </div>
                          </div>
                        )}
                        <div
                          className={mergeClasses(
                            styles.questionRow,
                            isSwipeAnsweringEnabled ? styles.questionRowSwipeable : '',
                            getQuestionRowClassName(question),
                          )}
                          style={{
                            transform: swipeQuestionId === question.id ? `translateX(${swipeOffset}px)` : 'translateX(0)',
                            transition: swipeQuestionId === question.id ? 'none' : 'transform 160ms ease-out',
                          }}
                          onTouchStart={isSwipeAnsweringEnabled ? (event) => handleQuestionTouchStart(question.id, event) : undefined}
                          onTouchMove={isSwipeAnsweringEnabled ? (event) => handleQuestionTouchMove(question.id, event) : undefined}
                          onTouchEnd={isSwipeAnsweringEnabled ? (event) => handleQuestionTouchEnd(question, event) : undefined}
                          onTouchCancel={isSwipeAnsweringEnabled ? resetSwipeState : undefined}
                        >
                          <div className={styles.sequenceCell}>
                            <Pill kind="neutral" value={String(question.sequenceOrder)} />
                            {question.required && <Text className={styles.requiredIndicator}>*</Text>}
                            {getDeficiencyCount(question) > 0 && (
                              <Button
                                appearance="subtle"
                                icon={<Warning24Filled />}
                                className={styles.deficiencyCount}
                                onClick={() => props.onOpenQuestionDeficiencies(question)}
                              >
                                ({getDeficiencyCount(question)})
                              </Button>
                            )}
                            {isMissingDeficiency(question) && <Pill kind="neutral" value="Deficiency Missing" />}
                          </div>

                          <div className={styles.questionContent}>
                            <Text className={styles.questionText}>{question.text}</Text>
                            {isMissingDeficiency(question) && (
                              <div className={styles.deficiencyHint}>
                                <Text size={200} className={styles.deficiencyHintText}>
                                  A deficiency is required for a No response.
                                </Text>
                                <ResponsiveButton
                                  appearance="subtle"
                                  className={styles.deficiencyHintButton}
                                  icon={<Add24Regular />}
                                  label="Create deficiency"
                                  disabled={!props.canCreateDeficiency}
                                  title={props.deficiencyActionTitle}
                                  onClick={() => props.onAddDeficiency(question)}
                                />
                              </div>
                            )}
                          </div>

                          <div className={styles.answerCell}>
                            {props.responseOptions.map((option) => (
                              <Button
                                key={option.key}
                                appearance="outline"
                                className={mergeClasses(
                                  styles.answerButton,
                                  question.responseCode === option.key ? getActiveButtonClassName(option.label) : '',
                                )}
                                disabled={!props.isQuestionAnsweringEnabled}
                                title={props.questionAnsweringTitle}
                                onClick={() => props.onQuestionAnswer(question, option.key)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.mobileQuestionListFooter}>
                  <Text className={styles.footerMeta}>Total {sortedQuestions.length}</Text>
                  <div className={styles.footerActions}>
                    <Text className={styles.footerStatus}>
                      {props.hasPendingChanges
                        ? `${props.pendingResponseCount} unsaved ${props.pendingResponseCount === 1 ? 'change' : 'changes'}`
                        : 'All checklist changes saved'}
                    </Text>
                    <ResponsiveButton
                      appearance="primary"
                      icon={<Save24Regular />}
                      label={props.isSavingResponses ? 'Saving...' : 'Save Changes'}
                      disabled={!props.isQuestionAnsweringEnabled || !props.hasPendingChanges || props.loading || props.isSavingResponses}
                      title={props.questionAnsweringTitle}
                      onClick={props.onSaveResponses}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DataState>
          )}
      </div>
    </div>
  );
}
