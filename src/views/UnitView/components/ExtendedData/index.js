import { connect } from 'react-redux';

import { fetchSelectedUnit } from '../../../../redux/actions/selectedUnit';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';
import { fetchReservations } from '../../../../redux/actions/selectedUnitReservations';
import ExtendedData from './ExtendedData';

const mapStateToProps = (state) => {
  const { unit, events, reservations } = state.selectedUnit;
  return {
    currentUnit: unit.data,
    events,
    reservations,
  };
};

export default connect(mapStateToProps, {
  fetchSelectedUnit,
  fetchUnitEvents,
  fetchReservations,
})(ExtendedData);
