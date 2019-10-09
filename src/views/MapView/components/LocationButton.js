/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MyLocation } from '@material-ui/icons';

const LocationButton = ({ position, classes, handleClick }) => {
  const L = require('leaflet');
  const { useLeaflet } = require('react-leaflet');
  const { map } = useLeaflet();

  const createLeafletElement = () => {
    const TestButton = L.Control.extend({
      options: {
        position,
      },
      onAdd: () => {
        const buttonContainer = L.DomUtil.create('button', classes.showLocationButton);

        const button = renderToStaticMarkup(
          <MyLocation className={classes.showLocationIcon} />,
        );

        buttonContainer.innerHTML = button;

        buttonContainer.onclick = ((ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          handleClick();
        });

        return buttonContainer;
      },
    });
    map.addControl(new TestButton());
  };

  useEffect(() => {
    createLeafletElement();
  }, []);

  return null;
};

export default LocationButton;
