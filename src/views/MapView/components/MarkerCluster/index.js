import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import MarkerCluster from './MarkerCluster';
import { formatDistanceObject } from '../../../../utils';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../../redux/selectors/unit';
import styles from '../../styles';
import { getSelectedUnit, getSelectedUnitEvents } from '../../../../redux/selectors/selectedUnit';


const mapStateToProps = (state) => {
  const { navigator, user, settings } = state;
  const { page, theme } = user;
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
    currentPage: page,
    getDistance,
    highlightedUnit,
    highlightedUnitEvents,
    navigator,
    settings,
    theme,
  };
};


export default withStyles(styles)(connect(mapStateToProps)(MarkerCluster));
