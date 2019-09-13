import config from '../../../config';

const { topBarHeight } = config;

const styles = () => ({
  button: {
    textTransform: 'none',
    paddingRight: 16,
    paddingLeft: 16,
  },
  buttonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonSettings: {
    backgroundColor: '#4e67d2',
  },
  buttonSettingsIcon: {
    marginRight: 8,
  },
  buttonMap: {
    backgroundColor: '#4e67d2',
  },
  desktopNav: {
    position: 'relative',
    height: topBarHeight,
  },
  feedbackLink: {
    display: 'inline-block',
  },
  feedbackText: {
    margin: 0,
    color: 'white',
    textDecorationColor: 'white',
  },
  homeLogoContainer: {
    paddingTop: 8,
    alignSelf: 'center',
  },
  languages: {
    flex: '0 0 auto',
    display: 'flex',
  },
  logo: {
    marginLeft: 8,
  },
  logoContainer: {
    flex: '1 0 auto',
    display: 'flex',
  },
  logoHomeLink: {
    alignSelf: 'center',
  },
  noTextTransform: {
    textTransform: 'none',
  },
  mobileNav: {
    position: 'sticky',
    height: topBarHeight,
    top: 0,
    zIndex: 999999999,
    backgroundColor: '#2242C7',
  },
  toolbar: {
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  },
  topNavLeft: {
    display: 'flex',
    height: topBarHeight,
    justifyContent: 'space-between',
  },
  topNavLeftMobile: {
    display: 'flex',
    height: topBarHeight,
    justifyContent: 'flex-start',
    width: '60%',
    marginLeft: 8,
  },
  topNavRight: {
    flex: '1 1 auto',
  },
  topNavRightMobile: {
    display: 'flex',
    height: topBarHeight,
    justifyContent: 'flex-end',
    width: '40%',
  },
});

export default styles;
