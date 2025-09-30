import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';

import {
  changeSelectedUnit,
  fetchSelectedUnit,
} from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { focusToPosition } from '../../views/MapView/utils/mapActions';

const UnitFetcher = ({
  children,
  fetchSelectedUnit,
  fetchReservations,
  unit = null,
  fetchAccessibilitySentences,
  map = null,
}) => {
  const params = useParams();

  const centerMap = useCallback(() => {
    const { location } = unit || {};
    if (location && location.coordinates && map) {
      focusToPosition(map, location.coordinates);
    }
  }, [unit, map]);

  useEffect(() => {
    if (params && params.unit) {
      const unitId = params.unit;
      fetchReservations(unitId);
      fetchUnitEvents(unitId);

      if (unit && unit.complete && unitId === `${unit.id}`) {
        fetchAccessibilitySentences(unitId);
        centerMap();
        return;
      }
      fetchSelectedUnit(unitId, () => {
        fetchAccessibilitySentences(unitId);
        centerMap();
      });
    }
  }, [
    params,
    fetchSelectedUnit,
    fetchReservations,
    unit,
    fetchAccessibilitySentences,
    centerMap,
  ]);

  return children;
};

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

export default connect(mapStateToProps, {
  changeSelectedUnit,
  fetchSelectedUnit,
  fetchUnitEvents,
  fetchAccessibilitySentences,
  fetchReservations,
})(UnitFetcher);

// Typechecking
UnitFetcher.propTypes = {
  children: PropTypes.node.isRequired,
  unit: PropTypes.objectOf(PropTypes.any),
  fetchAccessibilitySentences: PropTypes.func.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchSelectedUnit: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
};
