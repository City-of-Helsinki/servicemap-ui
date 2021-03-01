import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { getLocale, getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';
import TopBar from './TopBar';
import { setMapType, toggleSettings } from '../../redux/actions/settings';
import { changeTheme } from '../../redux/actions/user';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user, breadcrumb, settings,
  } = state;
  // TODO: replace this with useLocaleText when the component is converted to function component
  const getLocaleText = textObject => getLocaleString(state, textObject);
  /* TODO: create custom hook for getAddressNavigatorParams to prevent
  re-rendering on every state change */
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);
  return {
    getAddressNavigatorParams,
    navigator,
    currentPage: user.page,
    getLocaleText,
    breadcrumb,
    settings,
    theme: user.theme,
    locale: getLocale(state),
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
  { changeTheme, setMapType, toggleSettings },
)(TopBar))));
