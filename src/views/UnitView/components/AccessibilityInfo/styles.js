export default theme => ({
  adjustLeft: {
    marginLeft: -theme.spacing.unitTriple,
  },
  colorLight: {
    color: theme.custom.body2light.color,
  },
  divider: {
    marginLeft: -theme.spacing.unitTriple,
    marginRight: -theme.spacing.unitTriple,
  },
  list: {
    paddingLeft: theme.spacing.unit * 3,
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
