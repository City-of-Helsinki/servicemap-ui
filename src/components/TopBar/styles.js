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
    marginLeft: 16,
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
    width: 300,
    color: '#fff',
  },
  greyText: {
    color: '#CCCBCB',
  },
  settingsButton: {
    textTransform: 'none',
    alignItems: 'flex-start',
    marginLeft: '3%',
    marginRight: '3%',
    borderRadius: 0,
  },
  settingsButtonPressed: {
    textTransform: 'none',
    alignItems: 'flex-start',
    marginLeft: '3%',
    marginRight: '3%',
    marginBottom: -2,
    borderBottom: '2px solid',
    borderRadius: 0,
  },
  toolbarWhite: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
  },
  toolbarWhiteMobile: {
    minHeight: 60,
    height: 60,
    backgroundColor: '#fff',
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
  settingsButtonContainer: {
    width: '70%',
    display: 'flex',
  },
  aligner: {
    height: topBarHeight,
  },
  alignerMobile: {
    height: topBarHeightMobile,
  },
});

export default styles;
