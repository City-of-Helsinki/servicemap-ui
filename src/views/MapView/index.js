import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { getHighlightedDistrict } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { setMapRef } from '../../redux/actions/map';
import { findUserLocation } from '../../redux/actions/user';
import MapView from './MapView';
import styles from './styles';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const {
    navigator, settings, user, measuringMode, districts,
  } = state;
  const serviceUnitsLoading = state.service.isFetching;
  const searchUnitsLoading = state.units.isFetching;
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const {
    customPosition, locale, page, position,
  } = user;
  const districtUnitsFetching = districts.unitFetch.isFetching;
  const { districtsFetching } = districts;

  const userLocation = customPosition.coordinates || position.coordinates;
  return {
    highlightedDistrict,
    highlightedUnit,
    districtViewFetching: !!(districtUnitsFetching || districtsFetching?.length),
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
