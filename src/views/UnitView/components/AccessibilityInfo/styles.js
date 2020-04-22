export default theme => ({
  adjustLeft: {
    marginLeft: -theme.spacing.unitTriple,
  },
  divider: {
    marginLeft: -theme.spacing.unitTriple,
    marginRight: -theme.spacing.unitTriple,
  },
  list: {
    paddingLeft: theme.spacing.unit * 3,
    listStyleType: 'disc',
  },
  listIcon: {
    alignSelf: 'flex-start',
    margin: 0,
    color: theme.palette.primary.main,
    marginTop: '-3px',
  },
  listItem: {
    paddingLeft: theme.spacing.unit,
  },
  descriptionItem: {
    marginLeft: theme.spacing.unitDouble,
  },
  listTitle: {
    fontWeight: 'bold',
  },
  noInfoColor: {
    color: theme.palette.primary.main,
  },
  noShortcomingsColor: {
    color: theme.palette.primary.main,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
});
