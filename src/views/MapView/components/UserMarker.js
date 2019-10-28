/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { Room } from '@material-ui/icons/';
import { userIconSize } from '../config/mapConfig';

const UserMarker = ({ position, classes, onClick }) => {
  const { Marker } = require('react-leaflet');
  const { divIcon } = require('leaflet');

  const icon = divIcon({
    className: classes.userMarker,
    iconSize: [userIconSize, userIconSize],
    iconAnchor: [userIconSize / 2, userIconSize * 0.92],
    html: renderToStaticMarkup(
      <>
        <span className={classes.userMarkerBackground} />
        <Room className={classes.userMarkerBorder} />
        <Room className={classes.userMarkerForeground} />
      </>,
    ),
  });

  return (
    <Marker
      onClick={onClick}
      position={position}
      icon={icon}
    />
  );
};

UserMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default UserMarker;
