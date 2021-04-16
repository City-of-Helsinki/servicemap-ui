
export default theme => ({
  container: {
    zIndex: 0,
  },
  flexRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  containerButton: {
    color: 'inherit',
    padding: theme.spacing(1),
  },
  containerText: {
    color: 'inherit',
    fontSize: 14,
    paddingLeft: theme.spacing(1),
  },
});
