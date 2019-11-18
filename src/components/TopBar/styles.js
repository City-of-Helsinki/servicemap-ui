import config from '../../../config';

const { topBarHeight, topBarHeightMobile } = config;

const styles = () => ({
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  // feedbackLink: {
  //   display: 'inline-block',
  // },
  // feedbackText: {
  //   margin: 0,
  //   color: 'white',
  //   textDecorationColor: 'white',
  // },
  homeLogoContainer: {
    paddingTop: 8,
    alignSelf: 'center',
  },
  logo: {
    marginLeft: 4,
    marginRight: 16,
  },
  toolbarBlack: {
    minHeight: 28,
    height: 28,
    backgroundColor: '#141823',
    padding: 0,
    paddingLeft: 8,
  },
  toolbarBlackContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    width: 450,
    color: '#fff',
  },
  greyText: {
    color: '#CCCBCB',
  },
  toolbarWhite: {
    height: 70,
    backgroundColor: '#fff',
  },
  toolbarWhiteMobile: {
    minHeight: 60,
    height: 60,
    backgroundColor: '#fff',
    paddingRight: 0,
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
  mobileButtonContainer: {
    marginLeft: 'auto',
  },
  aligner: {
    height: topBarHeight,
  },
  alignerMobile: {
    height: topBarHeightMobile,
  },
  drawerContainer: {
    top: topBarHeight,
    backgroundColor: '#353638',
    maxWidth: 350,
    padding: 2,
  },
  drawerContainerMobile: {
    top: topBarHeightMobile,
    backgroundColor: '#353638',
    maxWidth: 350,
    padding: 2,
  },
  drawerButton: {
    color: '#fff',
    height: 80,
    textTransform: 'none',
    justifyContent: 'left',
    textAlign: 'left',
    paddingLeft: 25,
    paddingRight: 25,
    borderBottom: '1px solid rgba(255, 255, 255, 0.24)',
    '&:active': {
      backgroundColor: '#000',
    },
    '&:focus': {
      outline: '2px solid transparent',
      boxShadow: '0 0 0 2px #fff',
      transition: 'all .4s ease-in-out',
    },
  },
  drawerButtonText: {
    lineHeight: '18px',
    color: 'inherit',
  },
  drawerIcon: {
    height: 40,
    width: 40,
    borderRadius: '50%',
    backgroundColor: '#6C6C6C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 25,
    flexShrink: 0,
  },
  disabled: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
});

export default styles;
