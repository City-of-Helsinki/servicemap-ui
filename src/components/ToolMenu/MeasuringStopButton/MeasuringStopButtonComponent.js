import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SMButton from '../../ServiceMapButton';


const MeasuringStopButtonComponent = ({
  classes,
  onClick,
}) => {
  const buttonRef = useRef();
  useEffect(() => {
    // When Measuring is activated focus should move to measuring close button
    if (buttonRef?.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <SMButton
      passingRef={buttonRef}
      id="MeasuringStopButton"
      className={classes.measuringButton}
      color="primary"
      role="button"
      messageID="tool.measuring.stop"
      onClick={onClick}
    />
  );
};


MeasuringStopButtonComponent.propTypes = {
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
    smIcon: PropTypes.string,
    measuringButton: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MeasuringStopButtonComponent;
