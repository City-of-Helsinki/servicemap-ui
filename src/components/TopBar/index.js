import { connect } from 'react-redux';
import TopBar from './TopBar';
import { setMapType } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user, breadcrumb, settings,
  } = state;
  return {
    navigator,
    currentPage: user.page,
    breadcrumb,
    settings,
    theme: user.theme,
  };
};

export default connect(
  mapStateToProps,
  { changeTheme, setMapType },
)(TopBar);
