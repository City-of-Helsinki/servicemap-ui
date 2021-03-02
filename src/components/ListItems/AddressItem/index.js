import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../../redux/selectors/locale';
import AddressItem from './AddressItem';
import styles from './styles';
import { getAddressNavigatorParamsConnector } from '../../../utils/address';

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator, user } = state;
  /* TODO: create custom hook for getAddressNavigatorParams to prevent
  re-rendering on every state change */
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);
  return {
    getAddressNavigatorParams,
    currentService: current,
    navigator,
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
)(AddressItem));
