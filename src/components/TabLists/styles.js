export default theme => ({
  root: {
    position: 'sticky',
    zIndex: 50,
    backgroundColor: '#fff',
    borderColor: theme.palette.primary.contrastText,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 6,
  },
  resultList: {
    backgroundColor: 'white',
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
  selected: {
    fontWeight: 'bold',
  },
  tabLabelContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing.unitDouble,
    marginBottom: theme.spacing.unitDouble,
  },
});
