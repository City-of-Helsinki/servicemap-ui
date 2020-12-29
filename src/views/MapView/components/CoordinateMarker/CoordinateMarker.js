import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIcon } from '../../../../components/SMIcon';


const CoordinateMarker = () => {
  const { Marker } = global.rL;
  const { divIcon } = global.L;
  const location = useLocation();
  const theme = useSelector(state => state.user.theme);

  // Attempt to get coordinates from URL
  const usp = new URLSearchParams(location.search);
  const lat = usp.get('lat');
  const lng = usp.get('lon');
  if (!lat || !lng) {
    return null;
  }

  const icon = getIcon(theme === 'dark' ? 'coordinateMarkerContrast' : 'coordinateMarker', {});
  const coordIcon = divIcon({
    html: renderToStaticMarkup(icon),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
  const position = [lat, lng];

  return (
    <Marker
      className="addressMarker"
      position={position}
      icon={coordIcon}
      keyboard={false}
    />
  );
};

export default CoordinateMarker;
