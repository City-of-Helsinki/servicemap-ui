import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@mui/styles';
import Districts from './Districts';
import styles from '../../styles';
import { getDistrictsByType, getAddressDistrict, getHighlightedDistrict } from '../../../../redux/selectors/district';
import { setSelectedSubdistricts, setSelectedDistrictServices } from '../../../../redux/actions/district';

const mapStateToProps = (state) => {
  const { navigator, measuringMode } = state;
  const { theme, page } = state.user;
  const { districtAddressData, selectedSubdistricts, unitFetch } = state.districts;
  const districtData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  return {
    theme,
    navigator,
    currentPage: page,
    districtData,
    unitsFetching: unitFetch.isFetching,
    highlightedDistrict,
    addressDistrict,
    selectedAddress: districtAddressData.address,
    selectedSubdistricts,
    measuringMode,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { setSelectedSubdistricts, setSelectedDistrictServices },
)(Districts)));
