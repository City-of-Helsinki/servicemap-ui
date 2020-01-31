import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import setHighlightedDistrict from '../../redux/actions/district';
import { setAddressUnits, setAddressLocation } from '../../redux/actions/address';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';
import AddressView from './AddressView';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const highlightedDistrict = state.districts.highlitedDistrict;
  const { user, navigator } = state;
  const addressState = state.address;
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);
  return {
    map,
    getAddressNavigatorParams,
    getLocaleText,
    highlightedDistrict,
    navigator,
    addressState,
  };
};


export default withRouter(withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  {
    setHighlightedDistrict, setAddressUnits, setAddressLocation,
  },
)(AddressView))));
