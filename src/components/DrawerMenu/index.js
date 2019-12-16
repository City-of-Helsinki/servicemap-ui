import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import DrawerMenu from './DrawerMenu';
import { findUserLocation } from '../../redux/actions/user';
import styles from './styles';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    currentPage: user.page,
    userLocation: user.position,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { findUserLocation },
)(DrawerMenu)));
