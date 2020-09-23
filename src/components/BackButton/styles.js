
export default theme => ({
  container: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 3),
    zIndex: 0,
  },
  flexRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  containerButton: {
    color: 'inherit',
    marginLeft: theme.spacing(-1),
    padding: theme.spacing(1),
  },
  containerText: {
    color: 'inherit',
    fontWeight: 'bold',
  },
});
