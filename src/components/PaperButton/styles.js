export default theme => ({
  container: {
    flex: 1,
    padding: 0,
  },
  iconButton: {
    flex: '1 0 auto',
    padding: theme.spacing.unit,
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
    color: theme.palette.primary.main,
    fontSize: 48,
    margin: theme.spacing.unit,
  },
  text: {
    textTransform: 'none',
  },
});
