
export default theme => ({
  containerButton: {
    zIndex: 0,
    color: 'inherit',
    padding: theme.spacing(1),
  },
  containerText: {
    color: 'inherit',
    fontSize: '0.773rem',
    paddingLeft: theme.spacing(1),
  },
  topBackButtonContainer: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(-1),
  },
  topBackButton: {
    display: 'flex',
    zIndex: 0,
    color: 'inherit',
    padding: 0,
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
});
