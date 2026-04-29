import { tokens } from '@fluentui/react-components';

export const mobileHeaderStyles = {
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
    flexWrap: 'nowrap',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXS,
      alignItems: 'stretch',
    },
  },
  tabScroller: {
    flex: '1 1 auto',
    minWidth: 0,
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  pageTabs: {
    display: 'inline-flex',
    flexWrap: 'nowrap',
    flex: '0 0 auto',
    minWidth: 'max-content',
    maxWidth: 'none',
    whiteSpace: 'nowrap',
    gap: tokens.spacingHorizontalXXS,
    '@media (max-width: 700px)': {
      '& [role="tab"]': {
        flex: '0 0 auto',
        minWidth: 'max-content',
        justifyContent: 'center',
        paddingLeft: tokens.spacingHorizontalXS,
        paddingRight: tokens.spacingHorizontalXS,
      },
    },
  },
  tabActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    flex: '0 0 auto',
    flexWrap: 'nowrap',
    position: 'relative',
    marginLeft: 'auto',
    '@media (max-width: 700px)': {
      gap: tokens.spacingHorizontalXXS,
    },
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
  warningBar: {
    minWidth: 0,
    alignItems: 'flex-start',
  },
  warningBody: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    textAlign: 'left',
  },
  warningTitle: {
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase300,
  },
  warningText: {
    lineHeight: tokens.lineHeightBase300,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
} as const;