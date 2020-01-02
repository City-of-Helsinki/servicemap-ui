import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';
import TopBar from './TopBar';
import { changeTheme } from '../../redux/actions/user';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user, breadcrumb, settings,
  } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    navigator,
    currentPage: user.page,
    getLocaleText,
    breadcrumb,
    settings,
    theme: user.theme,
  };
};

export default withRouter(withStyles(styles)(connect(
  mapStateToProps,
  { changeTheme },
)(TopBar)));
