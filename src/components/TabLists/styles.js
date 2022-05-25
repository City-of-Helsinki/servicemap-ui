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
    color: 'black !important',
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
    color: 'black',
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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    fontSize: 'clamp(13px, 1.8vw, 14px)',
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
