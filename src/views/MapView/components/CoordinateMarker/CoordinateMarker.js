import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { getIcon } from '../../../../components';


const CoordinateMarker = ({ position }) => {
  const { Marker } = global.rL;
  const { divIcon } = global.L;
  const theme = useSelector(state => state.user.theme);

  if (!position) return null;

  const icon = getIcon(theme === 'dark' ? 'coordinateMarkerContrast' : 'coordinateMarker', {});
  const coordIcon = divIcon({
    html: renderToStaticMarkup(icon),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker
      className="addressMarker"
      position={position}
      icon={coordIcon}
      keyboard={false}
    />
  );
};

CoordinateMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.string),
};

CoordinateMarker.defaultProps = {
  position: null,
};

export default CoordinateMarker;
