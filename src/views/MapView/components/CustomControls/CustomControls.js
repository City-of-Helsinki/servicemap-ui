import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Custom map controls shoudld be wrapped with this component

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

const CustomControls = ({ position, classes, children }) => {
  // This converts children into array, even if children prop is single object or array of objects
  const controls = [children].flat().filter(item => item);

  useEffect(() => {
    if (controls.length) {
    // This prevents control button click propagation
      const div = global.L.DomUtil.get(`controlsContainer${position}`);
      global.L.DomEvent.disableClickPropagation(div);
    }
  }, []);

  if (!controls.length) return null;
  const positionClass = position && POSITION_CLASSES[position];

  const renderControl = element => (
    <div key={element.key} className="leaflet-control">
      {element}
    </div>
  );

  return (
    <div className={`${positionClass} ${classes.controlsContainer}`} id={`controlsContainer${position}`}>
      {controls.map(component => (
        renderControl(component)
      ))}
    </div>
  );
};

CustomControls.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(Object.keys(POSITION_CLASSES)).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

CustomControls.defaultProps = {
  children: null,
};


export default CustomControls;
