import { connect } from 'react-redux';

import {
  getSelectedUnit,
  getSelectedUnitEvents,
} from '../../../../redux/selectors/selectedUnit';
import MarkerCluster from './MarkerCluster';

const mapStateToProps = (state) => {
  // TODO: optimization: memoize getDistance (move from mapStateToProps to custom hook)
  const highlightedUnit = getSelectedUnit(state);
  const highlightedUnitEvents = getSelectedUnitEvents(state);
  if (highlightedUnit) {
    highlightedUnit.events = highlightedUnitEvents.data;
  }

  return {
    highlightedUnit,
    highlightedUnitEvents,
  };
};

export default connect(mapStateToProps)(MarkerCluster);
