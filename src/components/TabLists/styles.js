export default theme => ({
  root: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
    backgroundColor: theme.palette.white.main,
    borderColor: theme.palette.white.contrastText,
    color: theme.palette.white.contrastText,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    [theme.breakpoints.only('xs')]: {
      backgroundColor: '#2242C7',
      color: theme.palette.primary.highContrast,
    },
  },
  indicator: {
    backgroundColor: theme.palette.detail.main,
    height: 12,
    [theme.breakpoints.only('xs')]: {
      height: 4,
      backgroundColor: theme.palette.white.main,
    },
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
    opacity: 1,
    [theme.breakpoints.only('sm')]: {
      letterSpacing: 'normal',
    },
    [theme.breakpoints.up('sm')]: {
      flex: '1 1',
      borderBottom: '12px solid #DEDEDE',
    },
  },
  tabFocus: {
    outline: `4px solid ${theme.palette.primary.highContrast} !important`,
    outlineOffset: -1,
    boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder.main} !important`,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  tabLabelContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 30,
    paddingBottom: 5,
    fontSize: 'clamp(13px, 1.8vw, 14.42px)',
  },
  tabSmallFont: {
    fontSize: '12.36px',
    textTransform: 'none',
  },
  mobileTabFont: {
    fontSize: 11.5,
  },
  addressBar: {
    padding: theme.spacing(3),
    paddingTop: 0,
    backgroundColor: theme.palette.background.plain,
    color: '#fff',
    textAlign: 'left',
  },
  addressBarInput: {
    height: 47,
  },
});
