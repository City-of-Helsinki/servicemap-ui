export default theme => ({
  root: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
  },
  noPadding: {
    padding: 0,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  searchbarPlain: {
    background: theme.palette.background.plain,
  },
  label: {
    paddingTop: theme.spacing.unitDouble,
    paddingBottom: theme.spacing.unitDouble,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    padding: 10,
  },
  noVerticalPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  searchInfo: {
    color: '#fff',
    background: theme.palette.background.plain,
    padding: `${theme.spacing.unit}px ${theme.spacing.unitTriple}px`,
  },
  infoText: {
    color: 'inherit',
  },
  infoSubText: {
    color: 'inherit',
    marginBottom: 4,
  },
  infoContainer: {
    display: 'flex',
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  list: {
    margin: `${theme.spacing.unit}px 0`,
    padding: `0 0 0 ${theme.spacing.unitDouble}px`,
  },
  settingItem: {
    display: 'flex',
    width: '50%',
    marginBottom: theme.spacing.unit,
  },
  settingItemText: {
    color: 'inherit',
    alignSelf: 'center',
  },
  suggestionButtonContainer: {
    display: 'flex',
    margin: `${theme.spacing.unitDouble}px ${theme.spacing.unitTriple}px`,
  },
  bold: {
    fontWeight: 'bold',
  },
  srOnly: {
    position: 'fixed',
    left: -100,
  },
});
