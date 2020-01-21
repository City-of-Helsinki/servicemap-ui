import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import { getLocaleString } from '../../redux/selectors/locale';

import UnitView from './UnitView';
import styles from './styles/styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const stateUnit = state.selectedUnit.unit.data;
  const unitFetching = state.selectedUnit.unit.isFetching;
  const { accessibilitySentences, events, reservations } = state.selectedUnit;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  const { user } = state;

  return {
    accessibilitySentences: accessibilitySentences.data,
    stateUnit,
    unitFetching,
    eventsData: events,
    getLocaleText,
    map,
    navigator,
    reservationsData: reservations,
    userLocation: user.position.coordinates,
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
