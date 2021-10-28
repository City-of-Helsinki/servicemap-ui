import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AreaView from './AreaView';
import styles from './styles';
import {
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  setDistrictAddressData,
  setSelectedParkingAreas,
  fetchDistrictUnitList,
  fetchDistricts,
  setMapState,
} from '../../redux/actions/district';
import { getDistrictsByType, getAddressDistrict } from '../../redux/selectors/district';

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
  const addressDistrict = getAddressDistrict(state);
  return {
    districtData,
    selectedDistrictData,
    districtAddressData,
    addressDistrict,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitsFetching: unitFetch.nodesFetching,
    mapState,
    navigator,
    map,
  };
};

export default injectIntl(withStyles(styles)(connect(
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
)(AreaView)));
