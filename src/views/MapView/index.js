import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import getHighlightedDistrict from '../../redux/selectors/district';
import { getMapType } from '../../redux/selectors/map';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import { setMapRef } from '../../redux/actions/map';
import { setAddressLocation } from '../../redux/actions/address';
import MapView from './MapView';
import { getServiceUnits } from '../../redux/selectors/service';
import { getProcessedData } from '../../redux/selectors/results';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const { settings } = state;
  const unitList = getProcessedData(state);
  const unitsLoading = state.service.isFetching;
  const serviceUnits = getServiceUnits(state);
  const mapType = getMapType(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const currentPage = state.user.page;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  const { addressTitle, addressUnits } = state.address;
  return {
    mapType,
    highlightedDistrict,
    highlightedUnit,
    getLocaleText,
    unitList,
    serviceUnits,
    unitsLoading,
    currentPage,
    settings,
    navigator,
    addressTitle,
    addressUnits,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation },
)(MapView));
