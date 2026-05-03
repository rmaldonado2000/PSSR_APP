import {
  Button,
  Caption1,
  Card,
  Field,
  Input,
  MessageBar,
  Textarea,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { Add24Regular, ArrowLeft16Regular, Copy24Regular, Delete24Regular, Edit24Regular, Location16Regular, MoreHorizontal24Regular, Save24Regular, Tag16Regular } from '@fluentui/react-icons';
import { useEffect, useState, type ReactNode } from 'react';
import type { TemplateChecklistVm, TemplateQuestionVm } from '../app/types';
import { getCardAccentStyle } from '../components/CardAccent/CardAccent';
import { AppDialog, DataState, Pill, ResponsiveButton, SearchableCombobox, SectionPanel } from '../components/ui';

type ActionMenuState = {
  kind: 'template' | 'question';
  id: string;
  top: number;
  left: number;
};

const useStyles = makeStyles({
  screenPanel: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    overflow: 'hidden',
  },
  screenBody: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    overflow: 'hidden',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    overflow: 'hidden',
    '@media (max-width: 980px)': {
      gridTemplateColumns: '1fr',
    },
  },
  columnPanel: {
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    minHeight: 0,
    height: '100%',
    overflow: 'hidden',
  },
  contentShell: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    overflow: 'hidden',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  headerText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  listStack: {
    display: 'grid',
    gap: '2px',
  },
  listShell: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    minWidth: 0,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  scrollRegion: {
    minHeight: 0,
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '2px 0',
  },
  rowActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: '0 0 auto',
    minWidth: 0,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  actionMenu: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: '156px',
  },
  menuTriggerShell: {
    position: 'relative',
    flex: '0 0 auto',
  },
  floatingActionPanel: {
    position: 'fixed',
    zIndex: 1000,
    width: 'max-content',
    maxWidth: 'min(280px, calc(100vw - 16px))',
    padding: tokens.spacingHorizontalXXS,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
  },
  rowShell: {
    padding: '1px 0',
    borderRadius: tokens.borderRadiusLarge,
    border: '2px solid transparent',
    minWidth: 0,
  },
  checklistCard: {
    outlineOffset: '2px',
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid',
    ':focus-visible': {
      outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
    },
  },
  checklistCardInteractive: {
    cursor: 'pointer',
  },
  selectedTemplateShell: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
  cardBody: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  rowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'nowrap',
    minWidth: 0,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  titleStack: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    flex: '1 1 auto',
    minWidth: 0,
  },
  titleText: {
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  rightCluster: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalXS,
    flex: '0 0 auto',
    minWidth: 0,
    marginLeft: 'auto',
  },
  headerPills: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'nowrap',
    minWidth: 0,
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXXS,
    },
  },
  secondaryPills: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  questionsPanel: {
    padding: tokens.spacingHorizontalM,
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    gap: tokens.spacingVerticalM,
    minHeight: 0,
    height: '100%',
  },
  warningRegion: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
  },
  warningMessage: {
    minWidth: 0,
    width: '100%',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    boxSizing: 'border-box',
  },
  questionList: {
    display: 'grid',
    gap: '2px',
    paddingBottom: tokens.spacingVerticalM,
    minWidth: 0,
  },
  questionCard: {
    padding: tokens.spacingHorizontalM,
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  inlineEditor: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  questionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  questionHeader: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  questionMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    minWidth: 0,
    flexWrap: 'nowrap',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
    },
  },
  questionTitleStack: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  questionHeaderPills: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  questionScrollRegion: {
    minHeight: 0,
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: tokens.spacingVerticalM,
  },
  questionEmptyState: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    alignContent: 'start',
  },
  questionPanelShell: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    minHeight: 0,
    height: '100%',
    overflow: 'hidden',
  },
  helperText: {
    color: tokens.colorNeutralForeground3,
  },
});

const MOBILE_TEMPLATE_LAYOUT_QUERY = '(max-width: 700px)';

function getIsMobileTemplateLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_TEMPLATE_LAYOUT_QUERY).matches;
}

type OptionItem = { key: number; label: string };
type TemplateChecklistDraft = {
  id?: string;
  name: string;
  disciplineCode?: number;
  siteCode?: number;
};
type TemplateQuestionDraft = {
  id?: string;
  questionText: string;
  sequenceOrder: number;
  isMandatory: boolean;
  siteCode?: number;
};

export interface TemplateLibraryScreenProps {
  loading: boolean;
  error: string;
  hasSelectedPlan: boolean;
  canCreateTemplateQuestion: boolean;
  canEditTemplateChecklist: (template: TemplateChecklistVm) => boolean;
  canDuplicateTemplateChecklist: (template: TemplateChecklistVm) => boolean;
  canDeleteTemplateChecklist: (template: TemplateChecklistVm) => boolean;
  canEditTemplateQuestion: (question: TemplateQuestionVm) => boolean;
  canDeleteTemplateQuestion: (question: TemplateQuestionVm) => boolean;
  templateQuestionActionTitle?: string;
  selectedTemplateBanner?: string;
  createTemplateQuestionLabel: string;
  lockTemplateChecklistSite: boolean;
  lockTemplateQuestionSite: boolean;
  templateRows: TemplateChecklistVm[];
  selectedTemplateId: string;
  selectedTemplateIds: string[];
  selectedTemplate?: TemplateChecklistVm;
  templateQuestions: TemplateQuestionVm[];
  templateQuestionsLoading: boolean;
  templateQuestionsError: string;
  isTemplateChecklistEditorOpen: boolean;
  templateChecklistDraft: TemplateChecklistDraft;
  templateDisciplineOptions: OptionItem[];
  templateSiteOptions: OptionItem[];
  onTemplateChecklistDraftChange: (changes: Partial<TemplateChecklistDraft>) => void;
  onCloseTemplateChecklistEditor: () => void;
  onSaveTemplateChecklist: () => void;
  isTemplateQuestionEditorOpen: boolean;
  templateQuestionDraft: TemplateQuestionDraft;
  templateQuestionSequenceError?: string;
  templateQuestionSequenceLimit: number;
  canSaveTemplateQuestion: boolean;
  templateQuestionSiteOptions: OptionItem[];
  onTemplateQuestionDraftChange: (changes: Partial<TemplateQuestionDraft>) => void;
  onCloseTemplateQuestionEditor: () => void;
  onSaveTemplateQuestion: () => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenCreateTemplateChecklist: () => void;
  onEditTemplateChecklist: (template: TemplateChecklistVm) => void;
  onDuplicateTemplateChecklist: (template: TemplateChecklistVm) => void;
  onDeleteTemplateChecklist: (template: TemplateChecklistVm) => void;
  onOpenCreateTemplateQuestion: () => void;
  onEditTemplateQuestion: (question: TemplateQuestionVm) => void;
  onDeleteTemplateQuestion: (question: TemplateQuestionVm) => void;
  onToggleTemplate: (templateId: string) => void;
  onCopySelected: () => void;
}

export default function TemplateLibraryScreen(props: TemplateLibraryScreenProps): ReactNode {
  const styles = useStyles();
  const { onSelectTemplate, selectedTemplateId, templateRows } = props;
  const [actionMenuState, setActionMenuState] = useState<ActionMenuState | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState<boolean>(getIsMobileTemplateLayout);
  const [isMobileQuestionView, setIsMobileQuestionView] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_TEMPLATE_LAYOUT_QUERY);
    const onChange = () => {
      setIsMobileLayout(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setIsMobileQuestionView(false);
      }
    };

    onChange();
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (!selectedTemplateId || templateRows.some((template) => template.id === selectedTemplateId)) {
      return;
    }

    onSelectTemplate('');
  }, [onSelectTemplate, selectedTemplateId, templateRows]);

  useEffect(() => {
    if (!actionMenuState) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('[data-template-action-root="true"]')) {
        return;
      }

      setActionMenuState(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [actionMenuState]);

  const showChecklistPanel = !isMobileLayout || !isMobileQuestionView;
  const showQuestionsPanel = !isMobileLayout || isMobileQuestionView;

  const openTemplateDetails = (templateId: string): void => {
    onSelectTemplate(templateId);
    if (isMobileLayout) {
      setIsMobileQuestionView(true);
    }
  };

  const showChecklistList = (): void => {
    setIsMobileQuestionView(false);
  };

  const openActionMenu = (event: React.MouseEvent<HTMLButtonElement>, kind: 'template' | 'question', id: string): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const panelWidth = kind === 'template' ? 210 : 176;
    const nextLeft = Math.max(8, Math.min(window.innerWidth - panelWidth - 8, rect.right - panelWidth));
    const nextTop = Math.min(window.innerHeight - 8, rect.bottom + 6);

    setActionMenuState((current) => (
      current?.kind === kind && current.id === id
        ? null
        : {
          kind,
          id,
          top: nextTop,
          left: nextLeft,
        }
    ));
  };

  const activeTemplateAction = actionMenuState?.kind === 'template'
    ? props.templateRows.find((template) => template.id === actionMenuState.id)
    : undefined;
  const activeQuestionAction = actionMenuState?.kind === 'question'
    ? props.templateQuestions.find((question) => question.id === actionMenuState.id)
    : undefined;

  return (
    <SectionPanel
      className={styles.screenPanel}
      title="Template Library"
    >
      <DataState
        loading={props.loading}
        error={props.error}
        empty={props.templateRows.length === 0}
        emptyTitle="No templates available for your role/site"
      >
        <div className={styles.screenBody}>
          <div className={styles.contentShell}>
            <div className={styles.splitLayout}>
          {showChecklistPanel && (
          <div className={styles.columnPanel}>
            <div className={styles.columnHeader}>
              <div className={styles.headerText}>
                <Text weight="semibold">Template Checklists</Text>
                <Caption1>{props.templateRows.length} records</Caption1>
              </div>
              <ResponsiveButton
                icon={<Add24Regular />}
                label="Add Checklist"
                title={undefined}
                onClick={() => props.onOpenCreateTemplateChecklist()}
              />
            </div>
            <div className={styles.listShell}>
            <div className={styles.scrollRegion}>
              <div className={styles.listStack}>
              {props.templateRows.map((template) => {
                const selectedForDetail = props.selectedTemplateId === template.id;
                return (
                  <div
                    key={template.id}
                    className={mergeClasses(styles.rowShell, selectedForDetail && styles.selectedTemplateShell)}
                  >
                    <Card
                      appearance="filled-alternative"
                      size="small"
                      className={mergeClasses(styles.checklistCard, styles.checklistCardInteractive)}
                      style={getCardAccentStyle('status', template.statusLabel ?? '')}
                      onClick={() => openTemplateDetails(template.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openTemplateDetails(template.id);
                        }
                      }}
                      tabIndex={0}
                    >
                      <div className={styles.cardBody}>
                        <div className={styles.rowHeader}>
                          <div className={styles.titleStack}>
                            <Text weight="semibold" className={styles.titleText}>{template.name}</Text>
                          </div>
                          <div className={styles.rightCluster}>
                            <div className={styles.headerPills}>
                              <Pill kind="neutral" value={template.disciplineLabel ?? 'No discipline'} icon={<Tag16Regular />} />
                              <Pill kind="neutral" value={template.siteLabel ?? 'No Site'} icon={<Location16Regular />} />
                            </div>
                            <div className={styles.menuTriggerShell} data-template-action-root="true">
                                <Button
                                  appearance="subtle"
                                  aria-label={`Open actions for ${template.name}`}
                                  icon={<MoreHorizontal24Regular />}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openActionMenu(event, 'template', template.id);
                                  }}
                                />
                            </div>
                          </div>
                        </div>
                        <div className={styles.secondaryPills}>
                          <Pill kind="neutral" value={`${template.questionCount} ${template.questionCount === 1 ? 'question' : 'questions'}`} />
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
              </div>
            </div>
            </div>
          </div>
          )}

          {showQuestionsPanel && (
          <div className={styles.columnPanel}>
            <div className={styles.columnHeader}>
              <div className={styles.headerText}>
                <Text weight="semibold">Template Questions</Text>
                {props.selectedTemplate && <Caption1>{props.selectedTemplate.name}</Caption1>}
              </div>
              <div className={styles.rowActions}>
                {isMobileLayout && props.selectedTemplate && (
                  <ResponsiveButton
                    appearance="subtle"
                    icon={<ArrowLeft16Regular />}
                    label="Back"
                    onClick={showChecklistList}
                  />
                )}
                <ResponsiveButton
                  icon={<Add24Regular />}
                  label={props.createTemplateQuestionLabel}
                  onClick={props.onOpenCreateTemplateQuestion}
                  disabled={!props.selectedTemplate || !props.canCreateTemplateQuestion}
                  title={props.selectedTemplate && props.canCreateTemplateQuestion ? undefined : props.templateQuestionActionTitle}
                />
              </div>
            </div>
            <Card appearance="filled-alternative" className={styles.questionPanelShell}>
              <div className={styles.questionsPanel}>
                <div className={styles.warningRegion}>
                  {props.selectedTemplateBanner && props.selectedTemplate && (
                    <MessageBar className={styles.warningMessage} intent="warning">{props.selectedTemplateBanner}</MessageBar>
                  )}
                </div>

                <div className={styles.questionScrollRegion}>
                {!props.selectedTemplate && (
                  <div className={styles.questionEmptyState}>
                    <Text className={styles.helperText}>Select a template checklist to view its questions.</Text>
                  </div>
                )}

                {props.selectedTemplate && props.templateQuestionsLoading && (
                  <div className={styles.questionEmptyState}>
                    <Text className={styles.helperText}>Loading template questions...</Text>
                  </div>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && props.templateQuestionsError && (
                  <div className={styles.questionEmptyState}>
                    <Text>{props.templateQuestionsError}</Text>
                  </div>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && !props.templateQuestionsError && props.templateQuestions.length === 0 && (
                  <div className={styles.questionEmptyState}>
                    <Text className={styles.helperText}>No questions are associated with this template.</Text>
                  </div>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && !props.templateQuestionsError && props.templateQuestions.length > 0 && (
                  <div className={styles.questionList}>
                    {props.templateQuestions.map((question) => (
                      <Card key={question.id} className={styles.questionCard} size="small">
                        <div className={styles.questionHeader}>
                          <div className={styles.questionTitleStack}>
                            <Text className={styles.questionTitle}>
                              {question.sequenceOrder}. {question.questionText}
                            </Text>
                          </div>
                          <div className={styles.questionMetaRow}>
                            <div className={styles.questionHeaderPills}>
                              <Pill kind="neutral" value={question.isMandatory ? 'Mandatory' : 'Optional'} />
                              <Pill kind="neutral" value={question.siteLabel ?? 'No Site'} icon={<Location16Regular />} />
                            </div>
                            <div className={styles.menuTriggerShell} data-template-action-root="true">
                                <Button
                                  appearance="subtle"
                                  aria-label={`Open actions for question ${question.sequenceOrder}`}
                                  icon={<MoreHorizontal24Regular />}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openActionMenu(event, 'question', question.id);
                                  }}
                                />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </Card>
          </div>
          )}
          </div>
          </div>

          {activeTemplateAction && actionMenuState && (
            <div data-template-action-root="true">
              <Card
                appearance="filled-alternative"
                size="small"
                className={styles.floatingActionPanel}
                style={{ top: `${actionMenuState.top}px`, left: `${actionMenuState.left}px` }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.actionMenu}>
                  <ResponsiveButton appearance="subtle" icon={<Edit24Regular />} label="Edit" disabled={!props.canEditTemplateChecklist(activeTemplateAction)} ariaLabel={`Edit checklist ${activeTemplateAction.name}`} onClick={() => {
                    setActionMenuState(null);
                    props.onEditTemplateChecklist(activeTemplateAction);
                  }} />
                  <ResponsiveButton appearance="subtle" icon={<Copy24Regular />} label="Duplicate" disabled={!props.canDuplicateTemplateChecklist(activeTemplateAction)} ariaLabel={`Duplicate checklist ${activeTemplateAction.name}`} onClick={() => {
                    setActionMenuState(null);
                    props.onDuplicateTemplateChecklist(activeTemplateAction);
                  }} />
                  <ResponsiveButton appearance="subtle" icon={<Delete24Regular />} label="Delete" disabled={!props.canDeleteTemplateChecklist(activeTemplateAction)} ariaLabel={`Delete checklist ${activeTemplateAction.name}`} onClick={() => {
                    setActionMenuState(null);
                    props.onDeleteTemplateChecklist(activeTemplateAction);
                  }} />
                </div>
              </Card>
            </div>
          )}

          {activeQuestionAction && actionMenuState && (
            <div data-template-action-root="true">
              <Card
                appearance="filled-alternative"
                size="small"
                className={styles.floatingActionPanel}
                style={{ top: `${actionMenuState.top}px`, left: `${actionMenuState.left}px` }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.actionMenu}>
                  <ResponsiveButton appearance="subtle" icon={<Edit24Regular />} label="Edit" disabled={!props.canEditTemplateQuestion(activeQuestionAction)} title={props.canEditTemplateQuestion(activeQuestionAction) ? undefined : props.templateQuestionActionTitle} ariaLabel={`Edit question ${activeQuestionAction.sequenceOrder}`} onClick={() => {
                    setActionMenuState(null);
                    props.onEditTemplateQuestion(activeQuestionAction);
                  }} />
                  <ResponsiveButton appearance="subtle" icon={<Delete24Regular />} label="Delete" disabled={!props.canDeleteTemplateQuestion(activeQuestionAction)} title={props.canDeleteTemplateQuestion(activeQuestionAction) ? undefined : props.templateQuestionActionTitle} ariaLabel={`Delete question ${activeQuestionAction.sequenceOrder}`} onClick={() => {
                    setActionMenuState(null);
                    props.onDeleteTemplateQuestion(activeQuestionAction);
                  }} />
                </div>
              </Card>
            </div>
          )}

          {props.isTemplateChecklistEditorOpen && (
            <AppDialog
              open={props.isTemplateChecklistEditorOpen}
              title={props.templateChecklistDraft.id ? 'Edit Checklist' : 'New Checklist'}
              onClose={props.onCloseTemplateChecklistEditor}
              actions={<ResponsiveButton appearance="primary" icon={<Save24Regular />} label="Save" onClick={props.onSaveTemplateChecklist} />}
            >
              <div className={styles.inlineEditor}>
                <Field label="Name" required>
                  <Input
                    value={props.templateChecklistDraft.name}
                    onChange={(_, data) => props.onTemplateChecklistDraftChange({ name: data.value })}
                  />
                </Field>
                <Field label="Discipline">
                  <SearchableCombobox
                    options={props.templateDisciplineOptions.map((option) => ({ value: String(option.key), label: option.label }))}
                    selectedValue={props.templateChecklistDraft.disciplineCode !== undefined ? String(props.templateChecklistDraft.disciplineCode) : undefined}
                    onSelect={(value) => {
                      if (value) {
                        props.onTemplateChecklistDraftChange({ disciplineCode: Number(value) });
                      }
                    }}
                  />
                </Field>
                <Field label="Site">
                  <SearchableCombobox
                    disabled={props.lockTemplateChecklistSite}
                    options={props.templateSiteOptions.map((option) => ({ value: String(option.key), label: option.label }))}
                    selectedValue={props.templateChecklistDraft.siteCode !== undefined ? String(props.templateChecklistDraft.siteCode) : undefined}
                    onSelect={(value) => {
                      if (value) {
                        props.onTemplateChecklistDraftChange({ siteCode: Number(value) });
                      }
                    }}
                  />
                </Field>
              </div>
            </AppDialog>
          )}

          {props.isTemplateQuestionEditorOpen && (
            <AppDialog
              open={props.isTemplateQuestionEditorOpen}
              title={props.templateQuestionDraft.id ? 'Edit Question' : 'New Question'}
              onClose={props.onCloseTemplateQuestionEditor}
              actions={<ResponsiveButton appearance="primary" icon={<Save24Regular />} label="Save" disabled={!props.canSaveTemplateQuestion} onClick={props.onSaveTemplateQuestion} />}
            >
              <div className={styles.inlineEditor}>
                <Field label="Question" required>
                  <Textarea
                    value={props.templateQuestionDraft.questionText}
                    onChange={(_, data) => props.onTemplateQuestionDraftChange({ questionText: data.value })}
                  />
                </Field>
                <Field label="Sequence Number" validationMessage={props.templateQuestionSequenceError}>
                  <Input
                    type="number"
                    min={1}
                    max={props.templateQuestionSequenceLimit}
                    value={String(props.templateQuestionDraft.sequenceOrder)}
                    onChange={(_, data) => {
                      const nextValue = Number(data.value);
                      props.onTemplateQuestionDraftChange({
                        sequenceOrder: Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1,
                      });
                    }}
                  />
                </Field>
                <Field label="Mandatory">
                  <SearchableCombobox
                    options={[
                      { value: 'required', label: 'Required' },
                      { value: 'optional', label: 'Optional' },
                    ]}
                    selectedValue={props.templateQuestionDraft.isMandatory ? 'required' : 'optional'}
                    onSelect={(value) => {
                      props.onTemplateQuestionDraftChange({ isMandatory: value !== 'optional' });
                    }}
                  />
                </Field>
                <Field label="Site">
                  <SearchableCombobox
                    disabled={props.lockTemplateQuestionSite}
                    options={props.templateQuestionSiteOptions.map((option) => ({ value: String(option.key), label: option.label }))}
                    selectedValue={props.templateQuestionDraft.siteCode !== undefined ? String(props.templateQuestionDraft.siteCode) : undefined}
                    onSelect={(value) => {
                      if (value) {
                        props.onTemplateQuestionDraftChange({ siteCode: Number(value) });
                      }
                    }}
                  />
                </Field>
              </div>
            </AppDialog>
          )}
        </div>
      </DataState>
    </SectionPanel>
  );
}
