import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchUnitEvents } from '../../redux/actions/event';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';

import UnitView from './UnitView';
import styles from './styles/styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const unit = getSelectedUnit(state);
  const unitFetching = state.selectedUnit.unit.isFetching;
  const { accessibilitySentences } = state.selectedUnit;
  const eventsData = state.event.data;
  const eventFetching = state.event.isFetching;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  const reservations = state.selectedUnit.reservations.data;
  const { user } = state;

  return {
    accessibilitySentences: accessibilitySentences.data,
    unit,
    unitFetching,
    eventsData,
    eventFetching,
    getLocaleText,
    map,
    navigator,
    reservations,
    userLocation: user.position,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    changeSelectedUnit,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
  },
)(UnitView))));
