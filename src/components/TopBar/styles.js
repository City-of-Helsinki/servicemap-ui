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
  logo: {
    height: 29,
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
});

export default styles;
