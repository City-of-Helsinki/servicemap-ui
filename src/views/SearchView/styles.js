export default theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  label: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
  srTitle: {
    position: 'fixed',
    top: -10,
  },
  srLink: {
    position: 'fixed',
    bottom: 0,
  },
});
