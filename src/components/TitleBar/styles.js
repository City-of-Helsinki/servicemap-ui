import config from '../../../config';

const { topBarHeightMobile } = config;

export default theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: 44,
    background: theme.palette.primary.main,
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.5)',
    color: '#fff',
    padding: theme.spacing(1),
  },
  multiLine: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    height: 72,
  },
  textBar: {
    paddingLeft: theme.spacing(3),
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.125rem',
    color: 'inherit',
    flex: '1 1 auto',
    textTransform: 'none',
    textAlign: 'left',
    '&:focus': {
      outlineStyle: 'none',
    },
    height: 'auto',
  },
  titleLarge: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  iconButton: {
    display: 'flex',
    color: 'inherit',
    flex: '0 1 auto',
    padding: 0,
    margin: 0,
    fontSize: '1.125rem',
    marginLeft: theme.spacing(-0.5),
  },
  icon: {
    display: 'flex',
    color: 'inherit',
    margin: theme.spacing(1),
    padding: 0,
  },
  buttonFocus: {
    outline: '2px solid transparent',
    boxShadow: `0 0 0 4px ${theme.palette.primary.highContrast}`,
  },
  colorLight: {
    color: '#000',
  },
  distance: {
    fontSize: '1rem',
    color: 'inherit',
    marginLeft: 'auto',
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 50,
    flex: '0 0 auto',
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.sticky,
  },
  mobileSticky: {
    position: 'sticky',
    top: topBarHeightMobile,
    zIndex: 100,
  },
});
