import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AreaView from './AreaView';
import styles from './styles';
import {
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setHighlightedDistrict,
  setSelectedDistrictServices,
  setDistrictData,
  setDistrictAddressData,
  addSubdistrictUnits,
} from '../../redux/actions/district';
import { getDistrictsByType, getAddressDistrict, getSubdistrictServices } from '../../redux/selectors/district';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const {
    districtData,
    selectedDistrictType,
    districtAddressData,
    subdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
  } = state.districts;
  const map = state.mapRef;
  const filteredSubdistrictUnits = getSubdistrictServices(state);
  const selectedDistrictData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    districtData,
    selectedDistrictData,
    selectedDistrictType,
    districtAddressData,
    addressDistrict,
    subdistrictUnits,
    filteredSubdistrictUnits,
    selectedSubdistricts,
    selectedDistrictServices,
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
    setHighlightedDistrict,
    setDistrictData,
    setDistrictAddressData,
    addSubdistrictUnits,
  },
)(AreaView)));
