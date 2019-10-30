export default theme => ({
  container: {
    flex: 1,
    padding: 0,
  },
  iconButton: {
    flex: '1 0 auto',
    padding: theme.spacing.unit,
    color: theme.palette.primary.main,
  },
  iconButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    display: 'flex',
  },
  icon: {
    alignSelf: 'center',
    color: 'inherit',
    fontSize: 48,
    margin: theme.spacing.unit,
  },
  iconButtonDisabled: {
    color: 'inherit',
  },
  text: {
    textTransform: 'none',
  },
});
