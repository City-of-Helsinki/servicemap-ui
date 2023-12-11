import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { getIcon } from '../../../../components';
import { selectThemeMode } from '../../../../redux/selectors/user';


const CoordinateMarker = ({ position }) => {
  const { Marker } = global.rL;
  const { divIcon } = global.L;
  const useContrast = useSelector(selectThemeMode) === 'dark';

  if (!position) return null;

  const icon = getIcon(useContrast ? 'coordinateMarkerContrast' : 'coordinateMarker', {});
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
