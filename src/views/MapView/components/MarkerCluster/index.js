import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import MarkerCluster from './MarkerCluster';
import { getLocaleString } from '../../../../redux/selectors/locale';
import { generatePath } from '../../../../utils/path';
import { formatDistanceObject } from '../../../../utils';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../../redux/selectors/unit';
import styles from '../../styles';


const mapStateToProps = (state) => {
  const { navigator, user, settings } = state;
  const { locale, page, theme } = user;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getPath = (id, data) => generatePath(id, locale, data);
  const distanceCoordinates = getCurrentlyUsedPosition(state);
  const getDistance = (unit, intl) => (
    formatDistanceObject(intl, calculateDistance(unit, distanceCoordinates))
  );

  return {
    currentPage: page,
    getDistance,
    getLocaleText,
    getPath,
    navigator,
    settings,
    theme,
  };
};


export default withStyles(styles)(connect(mapStateToProps)(MarkerCluster));
