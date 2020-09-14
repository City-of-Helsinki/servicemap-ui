import config from '../../../config';

export default theme => ({
  bottomContent: {
    display: 'flex',
    padding: theme.spacing(1, 3),
  },
  container: {
    overflow: 'auto',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
    minHeight: `calc(100vh - ${config.topBarHeight}px)`,
    zIndex: theme.zIndex.infront,
  },
  containerMobile: {
    top: config.topBarHeightMobile,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    position: 'fixed',
    zIndex: theme.zIndex.infront,
  },
  infoText: {
    paddingBottom: theme.spacing(0.5),
  },
  input: {
    flex: '1 1 auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  inputFocused: {
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  iconButtonSearch: {
    flex: '0 0 auto',
    borderRadius: 0,
    padding: theme.spacing(0.5),
    textTransform: 'none',
    '& svg': {
      fontSize: 28,
    },
  },
  iconButtonSearchLabel: {
    flexDirection: 'column',
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing(1),
  },
  sticky: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(2),
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  subtitleText: {
    lineHeight: '32px',
  },
  closeButton: {
    margin: 0,
    width: 'fit-content',
    height: 42,
    marginTop: 12,
    marginBottom: theme.spacing(2),
  },
  expandSearchTop: {
    display: 'flex',
    flexDirection: 'row-reverse',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
});
