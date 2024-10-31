import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import { focusToPosition } from '../../views/MapView/utils/mapActions';

class UnitFetcher extends React.Component {
  componentDidMount() {
    const {
      match, fetchSelectedUnit, fetchReservations, unit, fetchAccessibilitySentences,
    } = this.props;
    const { params } = match;

    if (params && params.unit) {
      const unitId = params.unit;
      fetchReservations(unitId);
      fetchUnitEvents(unitId);

      if (unit && (unit.complete && unitId === `${unit.id}`)) {
        fetchAccessibilitySentences(unitId);
        this.centerMap();
        return;
      }
      fetchSelectedUnit(unitId, () => {
        fetchAccessibilitySentences(unitId);
        this.centerMap();
      });
    }
  }

  centerMap = () => {
    const { map, unit } = this.props;
    const { location } = unit;
    if (location && location.coordinates && map) {
      focusToPosition(map, location.coordinates);
    }
  }

  render() {
    return null;
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const unit = getSelectedUnit(state);
  const { mapRef } = state;
  const map = mapRef;

  return {
    unit,
    map,
  };
};

export default withRouter(connect(
  mapStateToProps,
  {
    changeSelectedUnit,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
  },
)(UnitFetcher));

// Typechecking
UnitFetcher.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
};

UnitFetcher.defaultProps = {
  unit: null,
  map: null,
  match: {},
};
