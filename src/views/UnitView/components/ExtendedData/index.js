import { connect } from 'react-redux';
import { fetchReservations } from '../../../../redux/actions/selectedUnitReservations';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';

import ExtendedData from './ExtendedData';

const mapStateToProps = (state) => {
  const { events, reservations } = state.selectedUnit;
  return {
    events,
    reservations,
  };
};

export default connect(mapStateToProps, {
  fetchUnitEvents,
  fetchReservations,
})(ExtendedData);
