import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { getHighlightedDistrict, getFilteredSubdistrictUnits } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { setMapRef } from '../../redux/actions/map';
import { findUserLocation } from '../../redux/actions/user';
import MapView from './MapView';
import styles from './styles';
import { getServiceUnits } from '../../redux/selectors/service';
import { getProcessedData } from '../../redux/selectors/results';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const {
    address, navigator, settings, user, measuringMode, districts,
  } = state;
  const unitList = getProcessedData(state);
  const serviceUnitsLoading = state.service.isFetching;
  const searchUnitsLoading = state.searchResults.isFetching;
  const serviceUnits = getServiceUnits(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const {
    customPosition, locale, page, position,
  } = user;
  const { adminDistricts, units, toRender } = address;
  const districtUnits = getFilteredSubdistrictUnits(state);
  const districtUnitsFetching = districts.unitsFetching;
  const { districtsFetching } = districts;

  const userLocation = customPosition.coordinates || position.coordinates;
  return {
    addressUnits: units,
    addressToRender: toRender,
    adminDistricts,
    highlightedDistrict,
    highlightedUnit,
    unitList,
    serviceUnits,
    districtUnits,
    districtViewFetching: !!(districtUnitsFetching?.length || districtsFetching?.length),
    unitsLoading: serviceUnitsLoading || searchUnitsLoading,
    currentPage: page,
    userLocation,
    hideUserMarker: customPosition.hideMarker,
    settings,
    navigator,
    locale,
    measuringMode,
  };
};

export default withStyles(styles)(withRouter(injectIntl(connect(
  mapStateToProps,
  { setMapRef, findUserLocation },
)(MapView))));
