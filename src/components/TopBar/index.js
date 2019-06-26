import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import TopBar from './TopBar';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

// TODO: move this to own file
const topBarHeight = 64;

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
    height: 64,
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

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
)(TopBar))));
