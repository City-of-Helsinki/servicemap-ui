import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';
import TopBar from './TopBar';
import { setMapType, toggleSettings } from '../../redux/actions/settings';
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

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeTheme, setMapType, toggleSettings },
)(TopBar)));
