import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  setAddressData,
  setAddressLocation,
  setAddressUnits,
  setAdminDistricts,
  setToRender,
} from '../../redux/actions/address';
import { setDistrictAddressData } from '../../redux/actions/district';
import AddressView from './AddressView';

export default withRouter(connect(
  () => ({}),
  {
    setAddressData,
    setAddressUnits,
    setAddressLocation,
    setAdminDistricts,
    setToRender,
    setDistrictAddressData,
  },
)(AddressView));
