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

  link: {
    color: '#0000EE',
  },
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  marginVertical: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  title: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  subtitle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  paragraph: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    whiteSpace: 'pre-line',
  },
  divider: {
    marginRight: 0,
  },
  image: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    display: 'flex',
  },
  fullListContent: {
    height: '100%',
    overflow: 'auto',
  },
  topBar: {
    backgroundColor: theme.palette.primary.main,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
});
