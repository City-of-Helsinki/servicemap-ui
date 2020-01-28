import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import DrawerMenu from './DrawerMenu';
import { findUserLocation } from '../../redux/actions/user';
import styles from './styles';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { user } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    currentPage: user.page,
    userLocation: user.position,
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { findUserLocation },
)(DrawerMenu)));
