import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { renderMarkerConnector } from '../views/MapView/utils/unitMarkers';
import { getLocaleString } from '../redux/selectors/locale';
import { generatePath } from './path';
import { formatDistanceObject } from '.';
import { calculateDistance } from '../redux/selectors/unit';

const addUnitsToMap = (props) => {
  console.log(props);
  const renderUnits = renderMarkerConnector(
    getLocaleText,
    navigator,
    theme,
    getPath,
    getDistance,
  );

  console.log(leaflet, map, theme);

  renderUnits(leaflet, map, data, classes, markerCluster, embeded);
};

const mapStateToProps = (state, props) => {
  const { intl } = props;
  const { navigator, user } = state;
  const { theme, locale } = user;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getPath = (id, data) => generatePath(id, locale, data);
  const getDistance = unit => formatDistanceObject(intl, calculateDistance(state)(unit));
  return {
    getLocaleText,
    navigator,
    theme,
    getPath,
    getDistance,
  };
};

export default injectIntl(connect(
  mapStateToProps,
)(addUnitsToMap));
