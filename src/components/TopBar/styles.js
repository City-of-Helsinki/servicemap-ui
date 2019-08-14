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
  desktopNav: {
    position: 'relative',
    height: topBarHeight,
  },
  languages: {
    flex: '0 0 auto',
    display: 'flex',
  },
  logo: {
    marginLeft: 8,
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
