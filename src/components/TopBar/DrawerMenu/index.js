import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DrawerMenu from './DrawerMenu';
import { findUserLocation } from '../../../redux/actions/user';

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    currentPage: user.page,
    userLocation: user.position,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { findUserLocation },
)(DrawerMenu));
