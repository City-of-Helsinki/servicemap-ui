import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchHearingMaps } from '../../redux/actions/selectedUnitHearingMaps';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';

import UnitView from './UnitView';

export default withRouter(connect(
  () => ({}),
  {
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
    fetchHearingMaps,
  },
)(UnitView));
