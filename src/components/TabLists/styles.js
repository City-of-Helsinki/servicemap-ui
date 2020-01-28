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
    borderBottom: '6px solid #DEDEDE',
    [theme.breakpoints.only('sm')]: {
      letterSpacing: 'normal',
    },
  },
  tabLabelContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
    fontSize: 14,
  },
});
