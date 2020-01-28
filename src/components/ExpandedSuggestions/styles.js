import config from '../../../config';

export default theme => ({
  bottomContent: {
    display: 'flex',
    padding: `${theme.spacing.unit}px ${theme.spacing.unitTriple}px`,
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
    padding: theme.spacing.unitHalf,
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
    padding: theme.spacing.unit,
  },
  sticky: {
    position: 'sticky',
    zIndex: theme.zIndex.sticky,
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.unitDouble,
  },
  padding: {
    padding: theme.spacing.unitDouble,
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
    marginBottom: theme.spacing.unitDouble,
  },
  expandSearchTop: {
    display: 'flex',
    flexDirection: 'row-reverse',
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unitDouble,
    paddingRight: theme.spacing.unitDouble,
  },
});
