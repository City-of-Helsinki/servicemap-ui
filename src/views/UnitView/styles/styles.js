export default theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
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
  title: {
    float: 'left',
    marginLeft: '15px',
    marginTop: '12px',
    marginBottom: '12px',
    fontWeight: 700,
    fontSize: '1.030em',
    lineHeight: 1.5,
  },
  divider: {
    marginLeft: '72px',
  },
});
