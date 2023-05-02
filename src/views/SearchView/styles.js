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
    margin: theme.spacing(1),
  },
  searchbarPlain: {
    background: theme.palette.primary.main,
    paddingBottom: theme.spacing(1),
  },
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
    background: theme.palette.primary.main,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
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
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0, 0, 0, 2),
  },
  settingItem: {
    display: 'flex',
    width: '50%',
    marginBottom: theme.spacing(1),
  },
  settingItemText: {
    color: 'inherit',
    alignSelf: 'center',
  },
  suggestionButtonContainer: {
    display: 'flex',
    margin: theme.spacing(2, 3),
  },
  bold: {
    fontWeight: 'bold',
  },
  srOnly: {
    position: 'fixed',
    left: -100,
  },
});
