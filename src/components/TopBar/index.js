import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import styles from './styles';
import TopBar from './TopBar';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, user } = state;
  return {
    navigator,
    currentPage: user.page,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
)(TopBar))));
