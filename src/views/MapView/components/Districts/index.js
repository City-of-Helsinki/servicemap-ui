import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import Districts from './Districts';
import styles from '../../styles';
import { getDistrictsByType, getAddressDistrict, getHighlightedDistrict } from '../../../../redux/selectors/district';
import { setSelectedSubdistricts, setSelectedDistrictServices } from '../../../../redux/actions/district';
import { getLocaleString } from '../../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { navigator, measuringMode } = state;
  const { theme, page } = state.user;
  const { districtAddressData, selectedSubdistricts } = state.districts;
  const districtData = getDistrictsByType(state);
  const addressDistrict = getAddressDistrict(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    theme,
    navigator,
    currentPage: page,
    districtData,
    highlightedDistrict,
    addressDistrict,
    selectedAddress: districtAddressData.address,
    selectedSubdistricts,
    measuringMode,
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { setSelectedSubdistricts, setSelectedDistrictServices },
)(Districts)));
