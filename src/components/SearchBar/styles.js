
export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    margin: theme.spacing.unit,
    padding: theme.spacing.unitHalf,
    transition: theme.transitions.create(['margin', 'padding'], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
    border: '1px solid gray',
  },
  wrapperFocused: {
    margin: 0,
    // Margin is replaced with padding so height doesn't get affected
    padding: theme.spacing.unit * 1.5,
    transition: theme.transitions.create(['margin', 'padding'], {
      duration: theme.transitions.duration.complex,
    }),
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
  },
  input: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  sticky: {
    position: 'sticky',
    zIndex: 50,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  suggestionSubtitle: {
    display: 'flex',
    backgroundColor: 'rgba(155,155,155,0.47)',
    paddingLeft: '18px',
  },
  subtitleText: {
    lineHeight: '32px',
  },
  suggestionArea: {
    zIndex: 51,
    position: 'absolute',
    minHeight: 'calc(100vh - 64px - 76px)',
    width: '100%',
    backgroundColor: '#fff',
  },
  suggestionButton: {
    margin: 0,
    width: 'fit-content',
    height: 42,
    borderColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    marginLeft: theme.spacing.unit,
  },
  divider: {
    marginLeft: 56,
  },
  listIcon: {
    paddingRight: theme.spacing.unitDouble,
    paddingTop: 8,
    paddingBottom: 8,
    color: 'rgba(0,0,0,0.54)',
  },
  absolute: {
    // top: 76,
    position: 'absolute',
    zIndex: 99999999999,
  },
  mobileBackdrop: {
    zIndex: 1,
    opacity: 0.2,
    position: 'absolute',
    top: 'auto',
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
  },
});
