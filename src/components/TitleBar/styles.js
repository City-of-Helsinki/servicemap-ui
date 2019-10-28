export default theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    height: 'auto',
    padding: theme.spacing.unit,
  },
  title: {
    color: 'inherit',
    flex: '1 1 auto',
    textTransform: 'capitalize',
    textAlign: 'left',
    marginLeft: theme.spacing.unitDouble,
  },
  iconButton: {
    color: 'inherit',
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  colorPrimary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  colorLight: {
    color: '#000',
  },
  distance: {
    marginLeft: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingTop: 4,
    marginRight: theme.spacing.unitDouble,
    color: '#fff',
    fontWeight: 'bold',
  },
});
