/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MyLocation } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import styles from '../styles';

const LocationButton = ({
  position, classes, handleClick, disabled, theme,
}) => {
  const L = require('leaflet');
  const { useLeaflet } = require('react-leaflet');
  const { map } = useLeaflet();

  const [button, setButton] = useState();

  const LocationControlButton = L.Control.extend({
    options: { position },
    onAdd: () => {
      const buttonContainer = L.DomUtil.create(
        'button',
        `${classes.showLocationButton} ${disabled ? classes.locationDisabled : ''}`,
      );
      buttonContainer.innerHTML = renderToStaticMarkup(
        <MyLocation className={classes.showLocationIcon} />,
      );
      buttonContainer.onclick = ((ev) => {
        ev.stopPropagation();
        if (handleClick) {
          handleClick();
        }
      });
      return buttonContainer;
    },
  });

  const createLeafletElement = () => {
    if (button) {
      // Remove old button before updating to new one
      map.removeControl(button);
    }
    const locationControl = new LocationControlButton();
    setButton(locationControl);

    map.addControl(locationControl);
  };

  useEffect(() => {
    createLeafletElement();
  }, [disabled]);

  return null;
};

export default withStyles(styles)(LocationButton);
