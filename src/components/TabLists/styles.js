export default theme => ({
  root: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
    backgroundColor: theme.palette.white.main,
    borderColor: theme.palette.white.contrastText,
    color: theme.palette.white.contrastText,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  resultList: {
    backgroundColor: 'white',
  },
  selected: {
    fontWeight: '700 !important',
    color: `${theme.palette.primary.main} !important`,
  },
  tab: {
    minWidth: 0,
    fontWeight: 'normal',
    flex: '1 1',
    [theme.breakpoints.only('sm')]: {
      letterSpacing: 'normal',
    },
    color: 'black',
    '&:focus': {
      boxShadow: 'none',
      zIndex: 0,
    },
  },
  tabFocus: {
    outline: `4px solid ${theme.palette.primary.highContrast} !important`,
    outlineOffset: -1,
    boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder.main} !important`,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  tabLabelContainer: {
    padding: theme.spacing(1),
    fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
    overflowWrap: 'anywhere',
  },
  mobileTabFont: {
    fontSize: '0.719rem',
  },
  addressBar: {
    padding: theme.spacing(3),
    paddingTop: 0,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    textAlign: 'left',
  },
  addressBarInput: {
    height: 47,
  },
});
