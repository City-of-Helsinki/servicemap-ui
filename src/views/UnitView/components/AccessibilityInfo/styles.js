export default theme => ({
  adjustLeft: {
    marginLeft: theme.spacing(-3),
  },
  divider: {
    marginLeft: -32,
    marginRight: -32,
  },
  list: {
    paddingLeft: theme.spacing(3),
    listStyleType: 'disc',
  },
  listIcon: {
    alignSelf: 'flex-start',
    margin: 0,
    color: theme.palette.primary.main,
    marginTop: '-3px',
    marginRight: theme.spacing(2),
    minWidth: 0,
  },
  listItem: {
    paddingLeft: theme.spacing(1),
  },
  descriptionItem: {
    marginLeft: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  },
});
