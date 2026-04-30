import {
  Button,
  Caption1,
  Card,
  Field,
  Input,
  Textarea,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Add24Regular, Copy24Regular, Delete24Regular, Edit24Regular, MoreHorizontal24Regular, Save24Regular } from '@fluentui/react-icons';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { truncate } from '../app/format';
import type { TemplateChecklistVm, TemplateQuestionVm } from '../app/types';
import { AppDialog, DataState, Pill, ResponsiveButton, RowCard, SearchableCombobox, SectionPanel } from '../components/ui';

const useStyles = makeStyles({
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 980px)': {
      gridTemplateColumns: '1fr',
    },
  },
  columnPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    minWidth: 0,
  },
  contentShell: {
    position: 'relative',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  headerText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
  },
  listStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  scrollRegion: {
    minHeight: 0,
    maxHeight: '68vh',
    overflowY: 'auto',
    paddingRight: tokens.spacingHorizontalXS,
    '@media (max-width: 980px)': {
      maxHeight: '40vh',
    },
  },
  actionRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  actionMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
  },
  rowShell: {
    padding: '1px 0',
    borderRadius: tokens.borderRadiusLarge,
    border: '2px solid transparent',
    position: 'relative',
  },
  anchoredActionPanel: {
    position: 'absolute',
    top: tokens.spacingVerticalXL,
    right: tokens.spacingHorizontalS,
    zIndex: 5,
    padding: tokens.spacingHorizontalXXS,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
  },
  chipsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selectedTemplateShell: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
  questionsPanel: {
    padding: tokens.spacingHorizontalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minHeight: 0,
  },
  questionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  questionCard: {
    padding: tokens.spacingHorizontalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  inlineEditor: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  questionTitle: {
    fontWeight: tokens.fontWeightSemibold,
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-start',
  },
  helperText: {
    color: tokens.colorNeutralForeground3,
  },
});

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
  const [expandedTemplateActionsId, setExpandedTemplateActionsId] = useState<string>('');
  const expandedActionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!expandedTemplateActionsId) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (expandedActionRef.current?.contains(event.target as Node)) {
        return;
      }

      setExpandedTemplateActionsId('');
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [expandedTemplateActionsId]);

  return (
    <SectionPanel 
      title="Template Library"
    >
      <DataState
        loading={props.loading}
        error={props.error}
        empty={props.templateRows.length === 0}
        emptyTitle="No templates available for your role/site"
      >
        <div className={styles.contentShell}>
          <div className={styles.splitLayout}>
          <div className={styles.columnPanel}>
            <div className={styles.columnHeader}>
              <div className={styles.headerText}>
                <Text weight="semibold">Template Checklists</Text>
                <Caption1>{props.templateRows.length} records</Caption1>
              </div>
              <ResponsiveButton icon={<Add24Regular />} label="Add Checklist" onClick={props.onOpenCreateTemplateChecklist} />
            </div>
            <div className={styles.scrollRegion}>
              <div className={styles.listStack}>
              {props.templateRows.map((template) => {
                const selectedForDetail = props.selectedTemplateId === template.id;
                const actionsOpen = expandedTemplateActionsId === template.id;
                return (
                  <div
                    key={template.id}
                    className={`${styles.rowShell} ${selectedForDetail ? styles.selectedTemplateShell : ''}`}
                  >
                    <RowCard
                      title={template.name}
                      subtitle={`${template.disciplineLabel ?? 'No discipline'} | ${template.siteLabel ?? 'No site'}`}
                      accentKind="status"
                      accentValue={template.statusLabel ?? ''}
                      onClick={() => props.onSelectTemplate(template.id)}
                      right={
                        <div className={styles.chipsRow}>
                          <Pill kind="status" value={template.statusLabel ?? 'No Status'} />
                          <Pill kind="neutral" value={`${template.questionCount} questions`} />
                          <Button
                            appearance="subtle"
                            aria-label={`Open actions for ${template.name}`}
                            icon={<MoreHorizontal24Regular />}
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedTemplateActionsId((current) => (current === template.id ? '' : template.id));
                            }}
                          />
                        </div>
                      }
                      details={
                        <div>
                          {selectedForDetail && <Caption1 className={styles.helperText}>Showing questions on the right.</Caption1>}
                          <Text>{truncate(template.description ?? 'No description')}</Text>
                        </div>
                      }
                    />
                    {actionsOpen && (
                      <div
                        ref={expandedActionRef}
                        className={styles.anchoredActionPanel}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className={styles.actionMenu}>
                          <ResponsiveButton appearance="subtle" icon={<Edit24Regular />} label="Edit" ariaLabel={`Edit checklist ${template.name}`} onClick={() => {
                            setExpandedTemplateActionsId('');
                            props.onEditTemplateChecklist(template);
                          }} />
                          <ResponsiveButton appearance="subtle" icon={<Copy24Regular />} label="Duplicate" ariaLabel={`Duplicate checklist ${template.name}`} onClick={() => {
                            setExpandedTemplateActionsId('');
                            props.onDuplicateTemplateChecklist(template);
                          }} />
                          <ResponsiveButton appearance="subtle" icon={<Delete24Regular />} label="Delete" ariaLabel={`Delete checklist ${template.name}`} onClick={() => {
                            setExpandedTemplateActionsId('');
                            props.onDeleteTemplateChecklist(template);
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>

          <div className={styles.columnPanel}>
            <div className={styles.columnHeader}>
              <div>
                <Text weight="semibold">Template Questions</Text>
                {props.selectedTemplate && <Caption1>{props.selectedTemplate.name}</Caption1>}
              </div>
              <ResponsiveButton icon={<Add24Regular />} label="Add Question" onClick={props.onOpenCreateTemplateQuestion} disabled={!props.selectedTemplate} />
            </div>
            <Card appearance="filled-alternative">
              <div className={`${styles.questionsPanel} ${styles.scrollRegion}`}>
                {!props.selectedTemplate && (
                  <Text className={styles.helperText}>Select a template checklist to view its questions.</Text>
                )}

                {props.selectedTemplate && props.templateQuestionsLoading && (
                  <Text className={styles.helperText}>Loading template questions...</Text>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && props.templateQuestionsError && (
                  <Text>{props.templateQuestionsError}</Text>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && !props.templateQuestionsError && props.templateQuestions.length === 0 && (
                  <Text className={styles.helperText}>No questions are associated with this template.</Text>
                )}

                {props.selectedTemplate && !props.templateQuestionsLoading && !props.templateQuestionsError && props.templateQuestions.length > 0 && (
                  <div className={styles.questionList}>
                    {props.templateQuestions.map((question) => (
                      <Card key={question.id} className={styles.questionCard} size="small">
                        <div className={styles.questionHeader}>
                          <Text className={styles.questionTitle}>
                            {question.sequenceOrder}. {question.questionText}
                          </Text>
                          <div className={styles.actionRow}>
                            <ResponsiveButton appearance="subtle" icon={<Edit24Regular />} label="Edit" ariaLabel={`Edit question ${question.sequenceOrder}`} onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                              event.stopPropagation();
                              props.onEditTemplateQuestion(question);
                            }} />
                            <ResponsiveButton appearance="subtle" icon={<Delete24Regular />} label="Delete" ariaLabel={`Delete question ${question.sequenceOrder}`} onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                              event.stopPropagation();
                              props.onDeleteTemplateQuestion(question);
                            }} />
                          </div>
                        </div>
                        <div className={styles.chipsRow}>
                          <Pill kind="neutral" value={question.isMandatory ? 'Required' : 'Optional'} />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
          </div>

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
              actions={<ResponsiveButton appearance="primary" icon={<Save24Regular />} label="Save" onClick={props.onSaveTemplateQuestion} />}
            >
              <div className={styles.inlineEditor}>
                <Field label="Question" required>
                  <Textarea
                    value={props.templateQuestionDraft.questionText}
                    onChange={(_, data) => props.onTemplateQuestionDraftChange({ questionText: data.value })}
                  />
                </Field>
                <Field label="Sequence Number">
                  <Input
                    type="number"
                    min={1}
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
