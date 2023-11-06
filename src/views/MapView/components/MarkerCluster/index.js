import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import MarkerCluster from './MarkerCluster';
import { formatDistanceObject } from '../../../../utils';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../../redux/selectors/unit';
import styles from '../../styles';
import { getSelectedUnit, getSelectedUnitEvents } from '../../../../redux/selectors/selectedUnit';

const mapStateToProps = (state) => {
  const distanceCoordinates = getCurrentlyUsedPosition(state);
  // TODO: optimization: memoize getDistance (move from mapStateToProps to custom hook)
  const getDistance = (unit, intl) => (
    formatDistanceObject(intl, calculateDistance(unit, distanceCoordinates))
  );
  const highlightedUnit = getSelectedUnit(state);
  const highlightedUnitEvents = getSelectedUnitEvents(state);
  if (highlightedUnit) {
    highlightedUnit.events = highlightedUnitEvents.data;
  }

  return {
    getDistance,
    highlightedUnit,
    highlightedUnitEvents,
  };
};


export default withStyles(styles)(connect(mapStateToProps)(MarkerCluster));
