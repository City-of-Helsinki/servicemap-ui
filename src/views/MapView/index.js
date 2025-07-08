import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setMapRef } from '../../redux/actions/map';
import { findUserLocation } from '../../redux/actions/user';
import { getHighlightedDistrict } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import MapView from './MapView';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const { user, measuringMode } = state;
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const { customPosition, position } = user;

  const userLocation = customPosition.coordinates || position.coordinates;
  return {
    highlightedDistrict,
    highlightedUnit,
    userLocation,
    hideUserMarker: customPosition.hideMarker,
    measuringMode,
  };
};

export default withRouter(
  connect(mapStateToProps, { setMapRef, findUserLocation })(MapView)
);
