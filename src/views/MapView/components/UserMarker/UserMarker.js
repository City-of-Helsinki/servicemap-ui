/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { getIcon } from '../../../../components/SMIcon';

const UserMarker = ({ position, classes, onClick }) => {
  const { Marker } = require('react-leaflet');
  const { divIcon } = require('leaflet');

  const icon = divIcon({
    className: classes.userMarker,
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserMarker;
