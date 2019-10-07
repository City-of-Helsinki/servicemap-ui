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
  srOnly: {
    position: 'fixed',
    left: -100,
  },
});
