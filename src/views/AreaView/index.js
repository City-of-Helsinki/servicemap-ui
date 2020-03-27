import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AreaView from './AreaView';
import styles from './styles';
import {
  setSelectedDistrict,
  setHighlightedDistrict,
  setDistrictData,
  setDistrictAddressData,
} from '../../redux/actions/district';
import { getDistrictsByType, getAddressDistrict } from '../../redux/selectors/district';

const mapStateToProps = (state) => {
  const { districtData, selectedDistrict, districtAddressData } = state.districts;
  const { navigator } = state;
  const map = state.mapRef;
  const selectedDistrictData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  return {
    districtData,
    selectedDistrictData,
    selectedDistrict,
    districtAddressData,
    addressDistrict,
    navigator,
    map,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    setSelectedDistrict,
    setHighlightedDistrict,
    setDistrictData,
    setDistrictAddressData,
  },
)(AreaView)));
