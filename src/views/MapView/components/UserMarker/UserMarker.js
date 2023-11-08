/* eslint-disable global-require */
import { css } from '@emotion/css';
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { getIcon } from '../../../../components';

const UserMarker = ({ position, onClick }) => {
  const { Marker } = require('react-leaflet');
  const { divIcon } = require('leaflet');
  const userMarkerClass = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const icon = divIcon({
    className: userMarkerClass,
    html: renderToStaticMarkup(
      getIcon('locationMarker'),
    ),
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
};

UserMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserMarker;
