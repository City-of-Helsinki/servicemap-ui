import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import Districts from './Districts';
import styles from '../../styles';
import { getDistrictsByType, getAddressDistrict, getHighlightedDistrict } from '../../../../redux/selectors/district';
import { setSelectedSubdistricts, setSelectedDistrictServices } from '../../../../redux/actions/district';

const mapStateToProps = (state) => {
  const { navigator, measuringMode } = state;
  const { theme, page } = state.user;
  const { districtAddressData, selectedSubdistricts, unitsFetching } = state.districts;
  const districtData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  return {
    theme,
    navigator,
    currentPage: page,
    districtData,
    unitsFetching: !!unitsFetching.length,
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
