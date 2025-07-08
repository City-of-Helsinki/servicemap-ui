import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

// Custom map controls should be wrapped with this component

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

function CustomControls({ position, children = null }) {
  // This converts children into array, even if children prop is single object or array of objects
  const controls = [children].flat().filter((item) => item);

  useEffect(() => {
    if (controls.length) {
      // This prevents control button click propagation
      const div = global.L.DomUtil.get(`controlsContainer${position}`);
      global.L.DomEvent.disableClickPropagation(div);
    }
  }, []);

  if (!controls.length) return null;
  const positionClass = position && POSITION_CLASSES[position];

  const renderControl = (element) => (
    <div key={element.key} className="leaflet-control">
      {element}
    </div>
  );

  return (
    <StyledControlsContainer
      className={`${positionClass}`}
      id={`controlsContainer${position}`}
    >
      {controls.map((component) => renderControl(component))}
    </StyledControlsContainer>
  );
}

const StyledControlsContainer = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

CustomControls.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(Object.keys(POSITION_CLASSES)).isRequired,
};

export default CustomControls;
