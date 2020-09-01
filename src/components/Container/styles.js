export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    position: 'relative',
  },
  title: {
    textAlign: 'left',
  },
  margin: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  text: {
    textAlign: 'left',
  },
  noMargin: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});
