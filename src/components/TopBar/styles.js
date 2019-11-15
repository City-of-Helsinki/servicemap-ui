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
  mobileNav: {
    position: 'sticky',
    height: topBarHeight,
    top: 0,
    zIndex: 100,
    backgroundColor: '#2242C7',
  },
  toolbarButtonPressed: {
    textTransform: 'none',
    backgroundColor: '#353638',
    color: '#fff',
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#353638',
    },
  },
  toolbarButton: {
    textTransform: 'none',
    color: '#000',
    marginLeft: 4,
    marginRight: 4,
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
});

export default styles;
