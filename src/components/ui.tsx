import {
  Body1,
  Button,
  type ButtonProps,
  Caption1,
  Card,
  Divider,
  makeStyles,
  mergeClasses,
  MessageBar,
  ProgressBar,
  Spinner,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { useEffect, useRef, useState, type CSSProperties, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';
import { getCardAccentColor } from './CardAccent/CardAccent';
import type { PillKind } from '../ui/tokens/pillTokens';
import { formatDate } from '../app/format';
import { List } from 'react-window';

export { default as Pill } from './Pill/Pill';

const useStyles = makeStyles({
  pageSection: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  stateBox: {
    minHeight: '220px',
    display: 'grid',
    placeItems: 'center',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  responsiveButton: {
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    maxWidth: '100%',
  },
  responsiveButtonLabel: {
    whiteSpace: 'nowrap',
    '@media (max-width: 700px)': {
      display: 'none',
    },
  },
  galleryListItem: {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  galleryListItemInset: {
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
    '@media (max-width: 700px)': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  rowCard: {
    cursor: 'pointer',
    outlineOffset: '2px',
    borderLeftWidth: '5px',
    borderLeftStyle: 'solid',
    ':focus-visible': {
      outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
    },
    '@media (max-width: 700px)': {
      borderRadius: tokens.borderRadiusMedium,
    },
  },
  rowCardBody: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    '@media (max-width: 700px)': {
      gap: tokens.spacingVerticalXXS,
    },
  },
  rowCardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'nowrap',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
      flexWrap: 'wrap',
    },
  },
  rowCardTitleGroup: {
    display: 'grid',
    minWidth: 0,
    flex: '1 1 240px',
    '@media (max-width: 700px)': {
      flexBasis: '180px',
    },
  },
  rowCardText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  rowCardTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowCardSubtitle: {
    color: tokens.colorNeutralForeground3,
    overflowWrap: 'anywhere',
  },
  rowCardBadges: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: '0 1 auto',
    maxWidth: '40%',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXXS,
      maxWidth: '100%',
      width: '100%',
    },
  },
  rowCardProgressRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  rowCardProgressBar: {
    minWidth: 0,
  },
  rowCardProgressLabel: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
  },
  rowCardMetaList: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
  },
  rowCardMetaField: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXS,
    alignItems: 'baseline',
    color: tokens.colorNeutralForeground2,
    minWidth: 0,
    overflow: 'hidden',
  },
  rowCardMetaLabel: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  rowCardMetaText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowCardMetaTextClamp: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '2',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    '@media (max-width: 700px)': {
      display: 'block',
      WebkitLineClamp: 'unset',
    },
  },
  rowCardMetaTextWrap: {
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'clip',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
  rowCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXXS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
  },
  listShell: {
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr) auto',
    height: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: 0,
  },
  stackedListContent: {
    display: 'grid',
    alignContent: 'start',
    minHeight: 0,
    height: '100%',
    padding: '2px 0',
    overflowY: 'auto',
  },
  listFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

export function SectionPanel(props: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}): ReactNode {
  const styles = useStyles();
  const hasHeader = Boolean(props.title || props.description || props.action);
  return (
    <Card className={mergeClasses(styles.pageSection, props.className)}>
      {hasHeader && (
        <>
          <div className={styles.panelHeader}>
            <div>
              {props.title && <Subtitle2>{props.title}</Subtitle2>}
              {props.description && <Caption1 block style={{ marginTop: tokens.spacingVerticalXXS }}>{props.description}</Caption1>}
            </div>
            {props.action}
          </div>
          <Divider />
        </>
      )}
      {props.children}
    </Card>
  );
}

export function DataState(props: {
  loading: boolean;
  error?: string;
  empty: boolean;
  emptyTitle: string;
  emptyBody?: string;
  children: ReactNode;
}): ReactNode {
  const styles = useStyles();

  if (props.loading) {
    return (
      <div className={styles.stateBox}>
        <Spinner label="Loading records from Dataverse..." />
      </div>
    );
  }

  if (props.error) {
    return (
      <MessageBar intent="error">
        <strong>Something went wrong</strong>
        <div>{props.error}</div>
      </MessageBar>
    );
  }

  if (props.empty) {
    return (
      <div className={styles.stateBox}>
        <div>
          <Subtitle2>{props.emptyTitle}</Subtitle2>
          <Caption1>{props.emptyBody ?? 'Create records or adjust filters to continue.'}</Caption1>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
}

export function VirtualizedList<T>(props: {
  items: T[];
  rowHeight: number;
  height?: number;
  fillHeight?: boolean;
  row: (item: T, index: number) => ReactNode;
  footer?: ReactNode;
  layout?: 'virtual' | 'stack';
  gap?: string;
}): ReactNode {
  const styles = useStyles();
  const shellRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [fillListHeight, setFillListHeight] = useState<number>(0);

  type RowData = {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
  };

  const RowComponent = ({ index, style, items, renderItem }: {
    index: number;
    style: CSSProperties;
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
  }): ReactElement => {
    return <div style={style}>{renderItem(items[index] as T, index)}</div>;
  };

  useEffect(() => {
    if (!props.fillHeight) {
      return undefined;
    }

    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const updateHeight = () => {
      const shellHeight = shell.clientHeight;
      const footerHeight = footerRef.current?.offsetHeight ?? 0;
      setFillListHeight(Math.max(0, shellHeight - footerHeight));
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(shell);
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [props.fillHeight, props.footer]);

  const effectiveHeight = props.fillHeight ? fillListHeight : props.height;
  const isStackLayout = props.layout === 'stack';

  const content = isStackLayout ? (
    <div
      className={styles.stackedListContent}
      style={{ gap: props.gap ?? '4px' }}
    >
      {props.items.map((item, index) => (
        <div key={index}>{props.row(item, index)}</div>
      ))}
    </div>
  ) : effectiveHeight ? (
    <List<RowData>
      rowCount={props.items.length}
      rowHeight={props.rowHeight}
      rowComponent={RowComponent as never}
      rowProps={{ items: props.items, renderItem: props.row }}
      overscanCount={5}
      style={{ height: effectiveHeight, width: '100%' }}
    />
  ) : (
    <div>
      {props.items.map((item, index) => (
        <div key={index}>{props.row(item, index)}</div>
      ))}
    </div>
  );

  return (
    <div ref={shellRef} className={styles.listShell}>
      {content}
      <div ref={footerRef} className={styles.listFooter}>
        <Body1>{props.items.length} records</Body1>
        {props.footer}
      </div>
    </div>
  );
}

export function GalleryListItem(props: {
  children: ReactNode;
  inset?: boolean;
}): ReactNode {
  const styles = useStyles();

  return (
    <div className={mergeClasses(styles.galleryListItem, props.inset && styles.galleryListItemInset)}>
      {props.children}
    </div>
  );
}

export function ResponsiveButton(props: {
  label: string;
  icon: ReactElement;
  ariaLabel?: string;
  appearance?: ButtonProps['appearance'];
  className?: string;
  disabled?: boolean;
  iconPosition?: ButtonProps['iconPosition'];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: ButtonProps['size'];
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}): ReactNode {
  const styles = useStyles();
  const {
    appearance,
    ariaLabel,
    className,
    disabled,
    icon,
    iconPosition,
    label,
    onClick,
    size,
    type,
    title,
  } = props;

  return (
    <Button
      as="button"
      appearance={appearance}
      className={mergeClasses(styles.responsiveButton, className)}
      disabled={disabled}
      icon={icon}
      iconPosition={iconPosition}
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      size={size}
      type={type}
      title={title}
    >
      <span className={styles.responsiveButtonLabel}>{label}</span>
    </Button>
  );
}

export function CardPillStack(props: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  const styles = useStyles();

  return <div className={mergeClasses(styles.rowCardBadges, props.className)}>{props.children}</div>;
}

export function CardMetaRow(props: {
  label: string;
  value?: ReactNode;
  valueBehavior?: 'truncate' | 'clamp' | 'wrap';
}): ReactNode {
  const styles = useStyles();
  const valueClassName = props.valueBehavior === 'clamp'
    ? styles.rowCardMetaTextClamp
    : props.valueBehavior === 'wrap'
      ? styles.rowCardMetaTextWrap
      : styles.rowCardMetaText;

  return (
    <span className={styles.rowCardMetaField}>
      <Caption1 className={styles.rowCardMetaLabel}>{props.label}:</Caption1>
      <Caption1 className={valueClassName}>
        {typeof props.value === 'string'
          ? (props.value.trim() ? props.value : '—')
          : (props.value ?? '—')}
      </Caption1>
    </span>
  );
}

export function CardDate(props: {
  label?: string;
  value?: string;
}): ReactNode {
  const styles = useStyles();

  return (
    <div className={styles.rowCardFooter}>
      <Caption1>{props.label ?? 'Created On'}</Caption1>
      <Caption1>{formatDate(props.value)}</Caption1>
    </div>
  );
}

export function GalleryCard(props: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  accentKind?: PillKind;
  accentValue?: string;
  accentColor?: string;
  pills?: ReactNode;
  progress?: {
    value: number;
    label?: string;
  };
  meta?: Array<{ label: string; value?: ReactNode; valueBehavior?: 'truncate' | 'clamp' | 'wrap' }>;
  footer?: ReactNode;
}): ReactNode {
  const styles = useStyles();
  const accentColor = props.accentKind
    ? getCardAccentColor(props.accentKind, props.accentValue ?? '')
    : (props.accentColor ?? tokens.colorNeutralStroke2);

  return (
    <Card
      className={styles.rowCard}
      style={{ borderLeftColor: accentColor }}
      onClick={props.onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          props.onClick?.();
        }
      }}
      tabIndex={0}
      appearance="filled-alternative"
      size="small"
    >
      <div className={styles.rowCardBody}>
        <div className={styles.rowCardTopRow}>
          <div className={styles.rowCardTitleGroup}>
            <div className={styles.rowCardText}>
              <Subtitle2 className={styles.rowCardTitle}>{props.title}</Subtitle2>
              {props.subtitle ? <Caption1 className={styles.rowCardSubtitle}>{props.subtitle}</Caption1> : null}
            </div>
          </div>
          {props.pills ? <CardPillStack>{props.pills}</CardPillStack> : null}
        </div>
        {props.progress ? (
          <div className={styles.rowCardProgressRow}>
            <ProgressBar className={styles.rowCardProgressBar} value={Math.max(0, Math.min(1, props.progress.value))} />
            {props.progress.label ? <Caption1 className={styles.rowCardProgressLabel}>{props.progress.label}</Caption1> : null}
          </div>
        ) : null}
        {props.meta?.length ? (
          <div className={styles.rowCardMetaList}>
            {props.meta.map((field) => (
              <CardMetaRow
                key={field.label}
                label={field.label}
                value={field.value}
                valueBehavior={field.valueBehavior}
              />
            ))}
          </div>
        ) : null}
        {props.footer}
      </div>
    </Card>
  );
}

export function RowCard(props: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: ReactElement;
  details?: ReactNode;
  icon?: ReactElement;
  accentKind?: PillKind;
  accentValue?: string;
  accentColor?: string;
  badges?: ReactNode;
  meta?: Array<{ label: string; value?: ReactNode; valueBehavior?: 'truncate' | 'clamp' | 'wrap' }>;
}): ReactNode {
  return (
    <GalleryCard
      title={props.title}
      subtitle={props.subtitle}
      onClick={props.onClick}
      accentKind={props.accentKind}
      accentValue={props.accentValue}
      accentColor={props.accentColor}
      pills={props.badges ?? props.right}
      meta={props.meta}
      footer={props.details}
    />
  );
}

export function ModalHeader(props: {
  title: string;
  onClose: () => void;
}): ReactNode {
  const styles = useStyles();
  return (
    <div className={styles.panelHeader}>
      <Subtitle2>{props.title}</Subtitle2>
      <ResponsiveButton label="Close" icon={<Dismiss24Regular />} appearance="subtle" onClick={props.onClose} />
    </div>
  );
}
