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
  fetchDistrictUnitList,
  fetchAllDistricts,
  setMapState,
} from '../../redux/actions/district';
import { getDistrictsByType, getAddressDistrict } from '../../redux/selectors/district';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const {
    districtData,
    districtAddressData,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitsFetching,
    mapState,
  } = state.districts;
  const map = state.mapRef;
  const selectedDistrictData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    districtData,
    selectedDistrictData,
    districtAddressData,
    addressDistrict,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
    unitsFetching,
    mapState,
    getLocaleText,
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
    fetchAllDistricts,
  },
)(AreaView)));
