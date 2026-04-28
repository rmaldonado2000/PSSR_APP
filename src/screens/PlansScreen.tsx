import {
  Button,
  Caption1,
  Card,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Field,
  Input,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  Option,
  ProgressBar,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowCircleRight16Regular,
  ArrowClockwise24Regular,
  Dismiss24Regular,
  Filter24Regular,
  Link16Regular,
  Location16Regular,
  Tag16Regular,
} from '@fluentui/react-icons';
import { useEffect, useState, type ReactNode } from 'react';
import type { PlanVm } from '../app/types';
import { getCardAccentStyle } from '../components/CardAccent/CardAccent';
import { DataState, GalleryListItem, Pill, ResponsiveButton, SectionPanel, VirtualizedList } from '../components/ui';
import { t } from '../app/i18n';

const ALL_OPTION_VALUE = '__all__';
const MOBILE_LAYOUT_QUERY = '(max-width: 700px)';
const DESKTOP_PLAN_ROW_HEIGHT = 112;
const MOBILE_PLAN_ROW_HEIGHT = 144;

function getIsMobileLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
}

interface FilterOption {
  key: number;
  label: string;
}

const useStyles = makeStyles({
  screenPanel: {
    height: '100%',
    minHeight: 0,
    gridTemplateRows: 'auto minmax(0, 1fr)',
  },
  topSection: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    minHeight: 0,
  },
  controlsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    alignItems: 'end',
    justifyContent: 'space-between',
  },
  filtersContainer: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    alignItems: 'end',
    '@media (max-width: 700px)': {
      display: 'none',
    },
  },
  drawerFiltersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  drawerFilterField: {
     display: 'flex',
     flexDirection: 'column',
  },
  mobileFilterTagsContainer: {
    display: 'none',
    '@media (max-width: 700px)': {
      display: 'flex',
      gap: tokens.spacingHorizontalS,
      flexWrap: 'wrap',
      marginTop: tokens.spacingVerticalS,
    },
  },
  mobileFilterButtonRow: {
    display: 'none',
    '@media (max-width: 700px)': {
      display: 'flex',
      gap: tokens.spacingHorizontalM,
    },
  },
  searchRow: {
    display: 'flex',
    alignItems: 'end',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 700px)': {
      width: '100%',
    },
  },
  searchInput: {
    minWidth: '250px',
    '@media (max-width: 700px)': {
      minWidth: 0,
      width: '100%',
    },
  },
  desktopCreateButton: {
    '@media (max-width: 700px)': {
      display: 'none',
    },
  },
  galleryRegion: {
    display: 'grid',
    minHeight: 0,
    overflow: 'hidden',
  },
  planCard: {
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusLarge,
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid',
    ':focus-visible': {
      outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
      outlineOffset: '1px',
    },
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  planId: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    flexShrink: 0,
  },
  progressSummary: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 1fr) auto',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    flex: '1 1 220px',
    minWidth: 0,
  },
  badgesRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    alignItems: 'center',
    flexShrink: 0,
  },
  planName: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaField: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXS,
    alignItems: 'baseline',
    color: tokens.colorNeutralForeground2,
    minWidth: 0,
    overflow: 'hidden',
  },
  metaLabel: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  metaText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressTrack: {
    minWidth: 0,
  },
  progressLabel: {
    color: tokens.colorNeutralForeground2,
    whiteSpace: 'nowrap',
  },
});

export interface PlansScreenProps {
  loading: boolean;
  error: string;
  plans: PlanVm[];
  searchText: string;
  siteFilter?: number;
  typeFilter?: number;
  phaseFilter?: number;
  siteOptions: FilterOption[];
  typeOptions: FilterOption[];
  phaseOptions: FilterOption[];
  onSearchTextChange: (value: string) => void;
  onSiteFilterChange: (value?: number) => void;
  onTypeFilterChange: (value?: number) => void;
  onPhaseFilterChange: (value?: number) => void;
  onCreatePlan: () => void;
  onOpenPlan: (plan: PlanVm) => void;
  onRefreshPlans: () => void;
}

function selectedOptionLabel(options: FilterOption[], value: number | undefined, fallbackLabel: string): string {
  if (value === undefined) {
    return fallbackLabel;
  }

  return options.find((option) => option.key === value)?.label ?? fallbackLabel;
}

function selectedOptionValue(value: number | undefined): string[] {
  return value === undefined ? [ALL_OPTION_VALUE] : [String(value)];
}

function readFilterValue(optionValue?: string): number | undefined {
  if (!optionValue || optionValue === ALL_OPTION_VALUE) {
    return undefined;
  }

  return Number(optionValue);
}

export default function PlansScreen(props: PlansScreenProps): ReactNode {
  const styles = useStyles();
  const [isMobileLayout, setIsMobileLayout] = useState<boolean>(getIsMobileLayout);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeSiteFilterLabel = selectedOptionLabel(props.siteOptions, props.siteFilter, '');
  const activeTypeFilterLabel = selectedOptionLabel(props.typeOptions, props.typeFilter, '');
  const activePhaseFilterLabel = selectedOptionLabel(props.phaseOptions, props.phaseFilter, '');

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LAYOUT_QUERY);
    const onChange = () => {
      setIsMobileLayout(mediaQuery.matches);
    };

    onChange();
    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  const planRowHeight = isMobileLayout ? MOBILE_PLAN_ROW_HEIGHT : DESKTOP_PLAN_ROW_HEIGHT;

  return (
    <SectionPanel className={styles.screenPanel}>
      <div className={styles.topSection}>
        <div className={styles.controlsRow}>
          <div className={styles.searchRow}>
            <Field label={t('searchPlans')} style={{ flex: 1 }}>
              <Input className={styles.searchInput} value={props.searchText} onChange={(_, data) => props.onSearchTextChange(data.value)} />
            </Field>
            <Button aria-label="Open filters" icon={<Filter24Regular />} className={styles.mobileFilterButtonRow} onClick={() => setIsDrawerOpen(true)} />
          </div>

          <div className={styles.mobileFilterTagsContainer}>
             {props.siteFilter !== undefined && (
               <InteractionTag>
                 <InteractionTagPrimary>Site: {activeSiteFilterLabel}</InteractionTagPrimary>
                 <InteractionTagSecondary aria-label="Remove site filter" onClick={() => props.onSiteFilterChange(undefined)} />
               </InteractionTag>
             )}
             {props.typeFilter !== undefined && (
               <InteractionTag>
                 <InteractionTagPrimary>Type: {activeTypeFilterLabel}</InteractionTagPrimary>
                 <InteractionTagSecondary aria-label="Remove type filter" onClick={() => props.onTypeFilterChange(undefined)} />
               </InteractionTag>
             )}
             {props.phaseFilter !== undefined && (
               <InteractionTag>
                 <InteractionTagPrimary>Phase: {activePhaseFilterLabel}</InteractionTagPrimary>
                 <InteractionTagSecondary aria-label="Remove phase filter" onClick={() => props.onPhaseFilterChange(undefined)} />
               </InteractionTag>
             )}
          </div>

          <div className={styles.filtersContainer}>
             <Field label="Site">
               <Dropdown
                 inlinePopup
                 value={selectedOptionLabel(props.siteOptions, props.siteFilter, 'All sites')}
                 selectedOptions={selectedOptionValue(props.siteFilter)}
                 onOptionSelect={(_, data) => {
                   props.onSiteFilterChange(readFilterValue(data.optionValue));
                 }}
               >
                 <Option value={ALL_OPTION_VALUE} text="All sites">All sites</Option>
                 {props.siteOptions.map((option) => (
                   <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                 ))}
               </Dropdown>
             </Field>
             <Field label="Type">
               <Dropdown
                 inlinePopup
                 value={selectedOptionLabel(props.typeOptions, props.typeFilter, 'All types')}
                 selectedOptions={selectedOptionValue(props.typeFilter)}
                 onOptionSelect={(_, data) => {
                   props.onTypeFilterChange(readFilterValue(data.optionValue));
                 }}
               >
                 <Option value={ALL_OPTION_VALUE} text="All types">All types</Option>
                 {props.typeOptions.map((option) => (
                   <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                 ))}
               </Dropdown>
             </Field>
             <Field label="Phase">
               <Dropdown
                 inlinePopup
                 value={selectedOptionLabel(props.phaseOptions, props.phaseFilter, 'All phases')}
                 selectedOptions={selectedOptionValue(props.phaseFilter)}
                 onOptionSelect={(_, data) => {
                   props.onPhaseFilterChange(readFilterValue(data.optionValue));
                 }}
               >
                 <Option value={ALL_OPTION_VALUE} text="All phases">All phases</Option>
                 {props.phaseOptions.map((option) => (
                   <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                 ))}
               </Dropdown>
             </Field>
             <ResponsiveButton className={styles.desktopCreateButton} icon={<Add24Regular />} label="Create Plan" onClick={props.onCreatePlan} />
          </div>
        </div>
        <Drawer type="overlay" open={isDrawerOpen} onOpenChange={(_, { open }) => setIsDrawerOpen(open)}>
          <DrawerHeader>
            <DrawerHeaderTitle
               action={
                 <ResponsiveButton appearance="subtle" label="Close" icon={<Dismiss24Regular />} onClick={() => setIsDrawerOpen(false)} />
               }
            >
               Filters
             </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody>
              <div className={styles.drawerFiltersContainer}>
                   <Field label="Site" className={styles.drawerFilterField}>
                    <Dropdown
                       inlinePopup
                      value={selectedOptionLabel(props.siteOptions, props.siteFilter, 'All sites')}
                       selectedOptions={selectedOptionValue(props.siteFilter)}
                       onOptionSelect={(_, data) => {
                        props.onSiteFilterChange(readFilterValue(data.optionValue));
                      }}
                     >
                       <Option value={ALL_OPTION_VALUE} text="All sites">All sites</Option>
                       {props.siteOptions.map((option) => (
                        <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                      ))}
                    </Dropdown>
                  </Field>
                   <Field label="Type" className={styles.drawerFilterField}>
                     <Dropdown
                       inlinePopup
                       value={selectedOptionLabel(props.typeOptions, props.typeFilter, 'All types')}
                       selectedOptions={selectedOptionValue(props.typeFilter)}
                       onOptionSelect={(_, data) => {
                         props.onTypeFilterChange(readFilterValue(data.optionValue));
                       }}
                     >
                       <Option value={ALL_OPTION_VALUE} text="All types">All types</Option>
                       {props.typeOptions.map((option) => (
                        <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                      ))}
                    </Dropdown>
                  </Field>
                  <Field label="Phase" className={styles.drawerFilterField}>
                    <Dropdown
                       inlinePopup
                       value={selectedOptionLabel(props.phaseOptions, props.phaseFilter, 'All phases')}
                       selectedOptions={selectedOptionValue(props.phaseFilter)}
                       onOptionSelect={(_, data) => {
                        props.onPhaseFilterChange(readFilterValue(data.optionValue));
                      }}
                    >
                      <Option value={ALL_OPTION_VALUE} text="All phases">All phases</Option>
                      {props.phaseOptions.map((option) => (
                        <Option key={option.key} value={String(option.key)} text={option.label}>{option.label}</Option>
                      ))}
                    </Dropdown>
                  </Field>
               </div>
          </DrawerBody>
        </Drawer>
      </div>

      <DataState
        loading={props.loading}
        error={props.error}
        empty={props.plans.length === 0}
        emptyTitle="No plans match current filters"
      >
        <div className={styles.galleryRegion}>
          <VirtualizedList
            items={props.plans}
            rowHeight={planRowHeight}
            fillHeight
            layout="stack"
            gap="4px"
            row={(plan) => {
              return (
                <GalleryListItem inset>
                  <Card
                    className={styles.planCard}
                    style={getCardAccentStyle('phase', plan.stageLabel ?? '')}
                    onClick={() => props.onOpenPlan(plan)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        props.onOpenPlan(plan);
                      }
                    }}
                    tabIndex={0}
                    appearance="filled-alternative"
                    size="small"
                  >
                    <div className={styles.cardBody}>
                      {/* Row 1: autonumber Plan ID (left) + stage/type/site/moc badges (right) */}
                      <div className={styles.topRow}>
                        <Caption1 className={styles.planId}># {plan.planId}</Caption1>
                        <div className={styles.progressSummary}>
                          <ProgressBar
                            className={styles.progressTrack}
                            value={Math.max(0, Math.min(1, plan.percentComplete / 100))}
                          />
                          <Caption1 className={styles.progressLabel}>
                            {plan.checklistCompletedCount}/{plan.checklistTotalCount}
                          </Caption1>
                        </div>
                        <div className={styles.badgesRow}>
                          <Pill kind="phase" value={plan.stageLabel ?? 'No Stage'} icon={<ArrowCircleRight16Regular />} />
                          <Pill kind="neutral" value={plan.typeLabel ?? 'No Type'} icon={<Tag16Regular />} />
                          <Pill kind="neutral" value={plan.siteLabel ?? 'No Site'} icon={<Location16Regular />} />
                          {plan.mocName && (
                            <Pill kind="neutral" value={plan.mocName} icon={<Link16Regular />} />
                          )}
                        </div>
                      </div>

                      {/* Row 2: Plan name – big and bold */}
                      <Text className={styles.planName}>{plan.name}</Text>

                      {/* Row 3: Event value */}
                      <span className={styles.metaField}>
                        <Caption1 className={styles.metaLabel}>Event:</Caption1>
                        <Caption1 className={styles.metaText}>{plan.event ?? '—'}</Caption1>
                      </span>

                      {/* Row 4: System value */}
                      <span className={styles.metaField}>
                        <Caption1 className={styles.metaLabel}>System:</Caption1>
                        <Caption1 className={styles.metaText}>{plan.system ?? '—'}</Caption1>
                      </span>
                    </div>
                  </Card>
                </GalleryListItem>
              );
            }}
            footer={<ResponsiveButton appearance="subtle" icon={<ArrowClockwise24Regular />} label="Refresh" onClick={props.onRefreshPlans} />}
          />
        </div>
      </DataState>
    </SectionPanel>
  );
}
