import { connect } from 'react-redux';
import { fetchReservations } from '../../../../redux/actions/selectedUnitReservations';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';
import { fetchSelectedUnit } from '../../../../redux/actions/selectedUnit';

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
