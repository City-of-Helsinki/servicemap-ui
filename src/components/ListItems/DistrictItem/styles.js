export default theme => ({
  simpleItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  simpleTitle: {
    marginBottom: theme.spacing(0.5),
  },
  itemTextContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  areaIcon: {
    fontSize: 20,
    marginLeft: 0,
    marginRight: theme.spacing(2),
  },
  divider: {
    listStyleType: 'none',
  },
  padding: {
    paddingLeft: theme.spacing(3),
  },
});
