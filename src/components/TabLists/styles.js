export default theme => ({
  root: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
    backgroundColor: theme.palette.white.main,
    borderColor: theme.palette.white.contrastText,
    color: theme.palette.white.contrastText,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  indicator: {
    backgroundColor: theme.palette.detail.main,
    height: 6,
  },
  resultList: {
    backgroundColor: 'white',
  },
  selected: {
    fontWeight: '700 !important',
  },
  tab: {
    minWidth: 0,
    fontWeight: 'normal',
    flex: '1 1',
    opacity: 1,
    borderBottom: '6px solid #DEDEDE',
    [theme.breakpoints.only('sm')]: {
      letterSpacing: 'normal',
    },
  },
  tabFocus: {
    outline: `4px solid ${theme.palette.primary.highContrast}`,
    outlineOffset: -1,
    boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder}`,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  tabLabelContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
    fontSize: 'clamp(13px, 1.8vw, 14px)',
  },
  mobileTabFont: {
    fontSize: 11.5,
  },
});
