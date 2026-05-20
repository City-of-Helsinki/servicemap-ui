import { css } from '@emotion/css';
import PropTypes from 'prop-types';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker } from 'react-leaflet';

import { getIcon } from '../../../../components';

const { divIcon } =
  typeof window !== 'undefined' ? (await import('leaflet')).default : {};

function UserMarker({ position, onClick }) {
  const userMarkerClass = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const icon = divIcon({
    // MarkerIcon for browser tests
    className: `${userMarkerClass} MarkerIcon`,
    'data-sm': 'MarkerIcon',
    html: renderToStaticMarkup(getIcon('locationMarker')),
  });

  return (
    <Marker
      id="userMarker"
      onClick={onClick}
      position={position}
      icon={icon}
      keyboard={false}
    />
  );
}

UserMarker.propTypes = {
  position: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserMarker;
