import config from '../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const styles = theme => ({
  smallScreen: {
    maxWidth: '200px !important',
  },
  aligner: {
    height: topBarHeight,
  },
  alignerMobile: {
    height: topBarHeightMobile,
  },
  appBar: {
    zIndex: theme.zIndex.appBar,
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoMobile: {
    height: 25,
  },
  logo: {
    height: 29,
  },
  mobileFont: {
    ...theme.typography.caption,
    lineHeight: '13px',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    color: 'inherit',
  },
  toolbarBlue: {
    minHeight: 32,
    height: 32,
    backgroundColor: theme.palette.primary.main,
    padding: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  toolbarBlueMobile: {
    paddingLeft: 14,
    paddingRight: 14,
  },
  topButtonFocused: {
    boxShadow: '0 0 0 2px !important',
  },
  bold: {
    fontWeight: 'bold',
  },
  greyText: {
    color: '#DEDFE1',
  },
  navContainer: {
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
  },
  navigationButtonsContainer: {
    paddingLeft: 88 + parseInt(theme.spacing(2.5), 10),
    display: 'flex',
    flex: '1 1 auto',
  },
  settingsButton: {
    textTransform: 'none',
    alignItems: 'flex-start',
    marginRight: '1%',
    borderRadius: 0,
    '& p': {
      textAlign: 'left',
    },
    maxWidth: 350,
    flex: '0 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexDirection: 'column',
    color: 'black',
  },
  settingsButtonPressed: {
    marginBottom: -2,
    borderBottom: '2px solid',
  },
  settingsButtonText: {
    color: 'inherit',
    lineHeight: 1,
  },
  toolbarWhite: {
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(3),
    height: 60,
    backgroundColor: '#fff',
    zIndex: theme.zIndex.infront,
  },
  toolbarWhiteMobile: {
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    paddingLeft: theme.spacing(1.5),
    height: 78,
    backgroundColor: '#fff',
  },
  largeButton: {
    height: 66,
  },
  iconTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    height: 14,
    marginRight: 4,
  },
  mobileButtonContainer: {
    display: 'flex',
    marginLeft: 'auto',
    width: 223,
    justifyContent: 'flex-end',
  },
  navigationButton: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
});

export default styles;
