import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import Districts from './Districts';
import styles from '../../styles';
import { getDistrictsByType, getAddressDistrict, getHighlightedDistrict } from '../../../../redux/selectors/district';
import { getLocaleString } from '../../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const { theme, page } = state.user;
  const { districtAddressData } = state.districts;
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
    getLocaleText,
  };
};

export default injectIntl(withStyles(styles)(connect(mapStateToProps)(Districts)));
