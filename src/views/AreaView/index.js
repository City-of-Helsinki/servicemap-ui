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
import { getDistrictsByType } from '../../redux/selectors/district';
import AreaView from './AreaView';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const {
    districtData,
    districtAddressData,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitFetch,
    mapState,
  } = state.districts;
  const map = state.mapRef;
  const selectedDistrictData = getDistrictsByType(state);
  return {
    districtData,
    selectedDistrictData,
    districtAddressData,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitsFetching: unitFetch.nodesFetching,
    mapState,
    navigator,
    map,
  };
};

export default injectIntl(connect(
  mapStateToProps,
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
