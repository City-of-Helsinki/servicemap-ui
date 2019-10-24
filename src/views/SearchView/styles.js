export default theme => ({
  root: {
    display: 'inline-block',
    height: 'auto',
    position: 'relative',
    width: '100%',
  },
  noPadding: {
    padding: 0,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  label: {
    paddingTop: theme.spacing.unitDouble,
    paddingBottom: theme.spacing.unitDouble,
  },
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
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
    backgroundColor: theme.palette.primary.main,
    padding: 12,
    paddingLeft: theme.spacing.unitDouble,
  },
  infoText: {
    color: 'inherit',
    marginBottom: 12,
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
  suggestionButton: {
    margin: 0,
    width: 'fit-content',
    height: 42,
    borderColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    marginTop: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  srOnly: {
    position: 'fixed',
    left: -100,
  },
});
