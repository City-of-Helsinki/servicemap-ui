import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  fetchDistricts,
  fetchDistrictUnitList,
  setDistrictAddressData,
  setMapState,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedParkingAreas,
  setSelectedSubdistricts,
} from '../../redux/actions/district';
import AreaView from './AreaView';

export default injectIntl(connect(
  () => ({}),
  {
    setSelectedDistrictType,
    setSelectedSubdistricts,
    setSelectedDistrictServices,
    setDistrictAddressData,
    setMapState,
    fetchDistrictUnitList,
    fetchDistricts,
    setSelectedParkingAreas,
  },
)(AreaView));
