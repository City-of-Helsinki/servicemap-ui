export default theme => ({
  listIcon: {
    alignSelf: 'flex-start',
    color: theme.palette.warning,
  },
  listItem: {
    paddingLeft: theme.spacing.unit,
  },
  list: {
    color: theme.custom.body2light.color,
    paddingLeft: theme.spacing.unit * 3,
  },
});
