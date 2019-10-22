
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
    position: 'fixed',
    // height: 'calc(100% - 64px - 76px)',
    height: '60%',
    width: '450px',
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: '4px 4px 14px 14px',
  },
  suggestionAreaMobile: {
    zIndex: 51,
    position: 'fixed',
    height: 'calc(100% - 76px)',
    width: '100%',
    backgroundColor: '#fff',
    overflow: 'auto',
  },
  expandTitle: {
    alignSelf: 'center',
    marginRight: 'auto',
    paddingLeft: theme.spacing.unitDouble,
    '&:focus': {
      boxShadow: 'none',
    },
  },
  expandHeight: {
    top: 64,
    height: 'calc(100% - 64px)',
  },
  expandHeightMobile: {
    top: 0,
    height: '100%',
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
  closeButton: {
    margin: 0,
    width: 'fit-content',
    height: 42,
    marginTop: 12,
    marginBottom: theme.spacing.unitDouble,
  },
  expandSearchTop: {
    display: 'flex',
    flexDirection: 'row-reverse',
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
  },
  backIcon: {
    paddingLeft: 0,
    paddingRight: theme.spacing.unitDouble,
  },
});
