export default theme => ({
  background: {
    background: theme.palette.background.main,
  },
  root: {
    color: theme.palette.primary.highContrast,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unitTriple,
    paddingTop: theme.spacing.unitHalf,
    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.5)',
    flex: '0 0 auto',
  },
  mobileActiveRoot: {
    color: theme.palette.primary.highContrast,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px`,
    paddingTop: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    overflow: 'auto',
  },
  wrapper: {
    flex: '0 1 auto',
    borderRadius: 4,
  },
  mobileWrapper: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    backgroundColor: '#fff',
    border: '1px solid #ACACAC',
    borderTopLeftRadius: theme.spacing.unitHalf,
    borderTopRightRadius: theme.spacing.unitHalf,
  },
  containerInactive: {
    borderRadius: theme.spacing.unitHalf,
  },
  containerSticky: {
    position: 'sticky',
    top: 35,
    zIndex: theme.zIndex.infront,
  },
  infoText: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing.unit}px ${theme.spacing.unitHalf}px`,
  },
  infoTextSticky: {
    backgroundColor: theme.palette.primary.main,
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.sticky,
    paddingTop: `${theme.spacing.unitDouble}px`,
  },
  input: {
    flex: '1 1 auto',
    paddingLeft: theme.spacing.unitHalf,
    paddingRight: theme.spacing.unitHalf,
    marginLeft: theme.spacing.unitHalf,
    marginRight: theme.spacing.unitHalf,
  },
  inputFocused: {
    paddingLeft: 0,
    paddingRight: theme.spacing.unit,
  },
  fieldFocus: {
    outline: '2px solid transparent',
    boxShadow: `inset 0 0 0 4px ${theme.palette.focusBorder}`,
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    margin: theme.spacing.unitHalf,
  },
  iconButtonSearch: {
    flex: '0 0 auto',
    borderRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    boxShadow: 'none',
    padding: `${theme.spacing.unitHalf}px 0`,
    textTransform: 'none',
    '& svg': {
      fontSize: 28,
    },
  },
  searchButtonFocus: {
    boxShadow: '0 0 0 3px #fff !important',
  },
  iconButtonSearchLabel: {
    flexDirection: 'column',
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  inputContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing.unitHalf,
  },
  sticky: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
  },
  bottomMargin: {
    marginBottom: 4,
  },
  headerText: {
    fontWeight: 'bold',
    margin: `${theme.spacing.unitTriple}px ${theme.spacing.unitHalf}px ${theme.spacing.unit}px ${theme.spacing.unitHalf}px`,
  },
  headerBackground: {
    background: theme.palette.background.front,
  },
  suggestionSubtitle: {
    display: 'flex',
    backgroundColor: 'rgba(155,155,155,0.47)',
    paddingLeft: '18px',
  },
  subtitleText: {
    lineHeight: '32px',
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
    height: '100%',
    overflow: 'auto',
  },
  expandHeightMobile: {
    top: 0,
    height: '100%',
    overflow: 'auto',
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
  mobileBackdrop: {
    zIndex: theme.zIndex.forward,
    opacity: 0.2,
    position: 'absolute',
    top: 'auto',
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
  },
  cancelButton: {
    '& svg': {
      fontSize: 14,
    },
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
    padding: theme.spacing.unit,
    color: '#757575',
    marginLeft: theme.spacing.unit,
  },
});
