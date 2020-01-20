
export default theme => ({
  container: {
    marginTop: theme.spacing.unit,
    padding: `0 ${theme.spacing.unitTriple}px`,
    zIndex: 0,
  },
  flexRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  containerButton: {
    color: 'inherit',
    marginLeft: -theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  containerText: {
    color: 'inherit',
    fontWeight: 'bold',
  },
});
