export default theme => ({
  container: {
    flex: 1,
    padding: 0,
  },
  iconButton: {
    flex: '1 0 auto',
    color: theme.palette.primary.main,
    padding: theme.spacing.unit,
  },
  iconButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
  },
  icon: {
    alignSelf: 'center',
    fontSize: 48,
    margin: theme.spacing.unit,
  },
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
    marginRight: theme.spacing.unitDouble,
    marginTop: 24,
  },
});
