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
  useEffect(() => {
    // This prevents control button click propagation
    const div = global.L.DomUtil.get('controlsContainer');
    global.L.DomEvent.disableClickPropagation(div);
  }, []);

  const positionClass = position && POSITION_CLASSES[position];

  const renderControl = element => (
    <div key={element.key} className="leaflet-control">
      {element}
    </div>
  );

  return (
    <div className={`${positionClass} ${classes.controlsContainer}`} id="controlsContainer">
      {Array.isArray(children)
        ? children.map(component => (
          renderControl(component)
        ))
        : (
          renderControl(children)
        )
      }
    </div>
  );
};

CustomControls.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default CustomControls;
