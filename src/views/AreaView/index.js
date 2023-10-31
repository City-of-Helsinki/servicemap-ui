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

export default connect(
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
)(AreaView);
