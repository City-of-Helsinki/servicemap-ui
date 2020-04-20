export default theme => ({
  containerInner: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
  },
  content: {
    alignSelf: 'center',
    flex: '1 1 auto',
  },
  divisionTitle: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing.unitDouble,
  },
  emergencyContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 5,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: theme.spacing.unitDouble,
  },
  listItem: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit,
  },
  li: {
    listStyleType: 'none',
  },
});
