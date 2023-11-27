import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchHearingMaps } from '../../redux/actions/selectedUnitHearingMaps';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';
import styles from './styles/styles';

import UnitView from './UnitView';

export default withRouter(injectIntl(withStyles(styles)(connect(
  () => ({}),
  {
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
    fetchHearingMaps,
  },
)(UnitView))));
