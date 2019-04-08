export default theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    overflowY: 'auto',
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
  borderBottom: {
    borderBottom: '1px solid rgba(0,0,0,0.2)',
  },
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unit * 2,
  },
  title: {
    display: 'flex',
    margin: theme.spacing.unit * 2,
  },
  titleIcon: {
    display: 'flex',
    marginRight: theme.spacing.unit * 2,
  },
  subtitle: {
    marginTop: theme.spacing.unit * 1.75,
    marginBottom: theme.spacing.unit * 1.75,
  },
  divider: {
    marginLeft: theme.spacing.unit * 9,
  },
  image: {
    width: '100%',
  },
});
