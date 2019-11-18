import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../redux/selectors/locale';
import { findUserLocation } from '../../redux/actions/user';
import styles from './styles';
import TopBar from './TopBar';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, user } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    navigator,
    currentPage: user.page,
    userLocation: user.position,
    getLocaleText,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
  { findUserLocation },
)(TopBar))));
