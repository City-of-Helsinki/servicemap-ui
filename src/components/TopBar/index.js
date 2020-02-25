import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';
import TopBar from './TopBar';
import { setMapType } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user, breadcrumb, settings,
  } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);
  return {
    getAddressNavigatorParams,
    navigator,
    currentPage: user.page,
    getLocaleText,
    breadcrumb,
    settings,
    theme: user.theme,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
  { changeTheme, setMapType },
)(TopBar))));
