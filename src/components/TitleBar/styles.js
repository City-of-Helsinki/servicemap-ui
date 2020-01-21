export default theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    color: '#fff',
    background: theme.palette.background.main,
    boxShadow: '0 2px 0 0 rgba(0,0,0,0.5)',
    minHeight: 60,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  large: {
    paddingBottom: 20,
  },
  textBar: {
    paddingLeft: 16,
  },
  backTextContainer: {
    flexBasis: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 6,
  },
  backText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: 'inherit',
    flex: '1 1 auto',
    textAlign: 'left',
    marginLeft: 10,
  },
  iconButton: {
    display: 'flex',
    color: 'inherit',
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },
  colorLight: {
    color: '#000',
  },
  distance: {
    fontSize: 16,
    color: 'inherit',
    marginLeft: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingTop: 4,
    marginRight: theme.spacing.unitDouble,
  },
});
