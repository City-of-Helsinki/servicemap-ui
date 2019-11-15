import config from '../../../config';

export default theme => ({
  root: {
    color: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing.unitTriple,
  },
  mobileRoot: {
    paddingLeft: 0,
    paddingRight: 0,
    top: config.topBarHeight,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    zIndex: 51,
  },
  wrapper: {
    flex: 1,
    border: '1px solid #ACACAC',
    borderRadius: theme.spacing.unitHalf,
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    borderRadius: theme.spacing.unitHalf,
  },
  infoText: {
    paddingBottom: theme.spacing.unitHalf,
  },
  input: {
    flex: '1 1 auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  inputFocused: {
    paddingLeft: 0,
    paddingRight: theme.spacing.unit,
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit,
  },
  iconButtonSearch: {
    flex: '0 0 auto',
    borderRadius: 0,
    padding: theme.spacing.unit,
    textTransform: 'none',
  },
  iconButtonSearchLabel: {
    flexDirection: 'column',
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  sticky: {
    position: 'sticky',
    zIndex: 51,
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.unitDouble,
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
    position: 'absolute',
    right: theme.spacing.unitTriple,
    left: theme.spacing.unitTriple,
    zIndex: 10000,
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: 0,
    borderBottomLeftRadius: theme.spacing.unitHalf,
    borderBottomRightRadius: theme.spacing.unitHalf,
    maxHeight: `calc(80vh - ${config.topBarHeight}px)`,
  },
  suggestionAreaMobile: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 56,
    bottom: 0,
    zIndex: 51,
    backgroundColor: '#fff',
    overflow: 'auto',
    borderRadius: 0,
    borderBottomLeftRadius: theme.spacing.unitHalf,
    borderBottomRightRadius: theme.spacing.unitHalf,
    maxHeight: `calc(80vh - ${config.topBarHeight}px)`,
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
    padding: theme.spacing.unit,
    color: '#757575',
    marginLeft: theme.spacing.unit,
  },
});
