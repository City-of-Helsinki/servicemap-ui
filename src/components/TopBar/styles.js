import config from '../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const styles = () => ({
  aligner: {
    height: topBarHeight,
  },
  alignerMobile: {
    height: topBarHeightMobile,
  },
  appBar: {
    zIndex: 100,
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    height: 29,
  },
  toolbarBlack: {
    minHeight: 28,
    height: 28,
    backgroundColor: '#141823',
    padding: 0,
    paddingLeft: 19,
  },
  toolbarBlackContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    width: 450,
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  greyText: {
    color: '#CCCBCB',
  },
  settingsButtonsContainer: {
    paddingLeft: 50,
    width: '70%',
    display: 'flex',
  },
  settingsButton: {
    textTransform: 'none',
    alignItems: 'flex-start',
    marginRight: '4%',
    borderRadius: 0,
  },
  settingsButtonPressed: {
    textTransform: 'none',
    alignItems: 'flex-start',
    marginRight: '4%',
    marginBottom: -2,
    borderBottom: '2px solid',
    borderRadius: 0,
  },
  settingsButtonText: {
    color: 'inherit',
    lineHeight: 1,
  },
  // toolbarBlack: {
  //   minHeight: 28,
  //   height: 28,
  //   backgroundColor: '#141823',
  //   padding: 0,
  //   paddingLeft: 19,
  // },
  // toolbarBlackContainer: {
  //   justifyContent: 'space-around',
  //   display: 'flex',
  //   width: 400,
  //   color: '#fff',
  // },
  toolbarWhite: {
    paddingLeft: 28,
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  toolbarWhiteMobile: {
    paddingLeft: 28,
    minHeight: 60,
    height: 60,
    backgroundColor: '#fff',
    paddingRight: 0,
    zIndex: 100,
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
