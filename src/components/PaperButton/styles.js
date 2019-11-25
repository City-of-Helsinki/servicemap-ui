export default theme => ({
  container: {
    flex: 1,
    padding: 0,
  },
  iconButton: {
    flex: '1 0 auto',
    padding: theme.spacing.unit,
    color: theme.palette.primary.main,
    justifyContent: 'left',
    textAlign: 'left',
    border: 'rgba(25,100,230,0.50) solid 0.5px',
  },
  iconContainer: {
    display: 'flex',
  },
  icon: {
    color: 'inherit',
    margin: theme.spacing.unit,
  },
  iconButtonDisabled: {
    color: 'inherit',
  },
  text: {
    textTransform: 'none',
    lineHeight: '18px',
  },
});
