import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fetchReservations } from '../../../../redux/actions/selectedUnitReservations';
import { fetchUnitEvents } from '../../../../redux/actions/selectedUnitEvents';
import { fetchSelectedUnit } from '../../../../redux/actions/selectedUnit';

import ExtendedData from './ExtendedData';
import { getLocaleString } from '../../../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const { unit, events, reservations } = state.selectedUnit;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    currentUnit: unit.data,
    events,
    getLocaleText,
    reservations,
  };
};

export default connect(mapStateToProps, {
  fetchSelectedUnit,
  fetchUnitEvents,
  fetchReservations,
})(ExtendedData);
