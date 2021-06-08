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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: theme.zIndex.appBar,
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
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
  toolbarBlack: {
    minHeight: 30,
    height: 30,
    backgroundColor: '#141823',
    padding: 0,
    paddingLeft: 18,
    paddingRight: 18,
  },
  toolbarBlackMobile: {
    paddingLeft: 14,
    paddingRight: 14,

  },
  toolbarBlackContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    width: 450,
    color: '#fff',
  },
  topButtonFocused: {
    boxShadow: '0 0 0 2px #fff !important',
  },
  bold: {
    fontWeight: 'bold',
  },
  greyText: {
    color: '#CCCBCB',
  },
  settingsButtonsContainer: {
    paddingLeft: 50,
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
    maxHeight: 58,
    flex: '0 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
    height: 70,
    backgroundColor: '#fff',
    zIndex: theme.zIndex.infront,
  },
  toolbarWhiteMobile: {
    paddingLeft: 28,
    minHeight: 60,
    height: 60,
    backgroundColor: '#fff',
    paddingRight: 0,
    zIndex: theme.zIndex.infront,
  },
  toolbarButtonPressed: {
    width: 66,
    textTransform: 'none',
    backgroundColor: '#353638',
    color: '#fff',
    marginLeft: 4,
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#353638',
    },
  },
  toolbarButton: {
    width: 66,
    textTransform: 'none',
    color: '#000',
    marginLeft: 4,
    borderRadius: 0,
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
    marginLeft: 'auto',
  },
});

export default styles;
