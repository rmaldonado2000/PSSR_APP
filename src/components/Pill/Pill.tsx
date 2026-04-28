import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { type ReactNode } from 'react';
import { getPillStyle, type PillKind } from '../../ui/tokens/pillTokens';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    maxWidth: '100%',
    height: '24px',
    minWidth: 0,
    boxSizing: 'border-box',
    paddingLeft: '10px',
    paddingRight: '10px',
    borderRadius: '999px',
    border: '1px solid transparent',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '120ms',
    transitionTimingFunction: 'ease-out',
    ':hover': {
      boxShadow: tokens.shadow2,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.colorCompoundBrandStroke}`,
      outlineOffset: '1px',
    },
  },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '12px',
    height: '12px',
    minWidth: '12px',
    marginRight: '6px',
    flexShrink: 0,
    lineHeight: 0,
    '& > svg': {
      width: '12px',
      height: '12px',
      fontSize: '12px',
    },
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export interface PillProps {
  kind: PillKind;
  value: string;
  icon?: ReactNode;
  className?: string;
}

export default function Pill(props: PillProps): ReactNode {
  const styles = useStyles();
  const pillStyle = getPillStyle(props.kind, props.value);
  const shouldRenderIcon = props.kind !== 'status' && props.icon !== undefined && props.icon !== null;

  return (
    <span
      className={mergeClasses(styles.root, props.className)}
      style={{
        backgroundColor: pillStyle.bg,
        borderColor: pillStyle.border,
        color: pillStyle.text,
      }}
      title={props.value}
    >
      {shouldRenderIcon ? <span className={styles.iconWrap}>{props.icon}</span> : null}
      <span className={styles.label}>{props.value}</span>
    </span>
  );
}