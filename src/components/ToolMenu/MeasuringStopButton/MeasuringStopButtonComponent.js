import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import SMButton from '../../ServiceMapButton';

const MeasuringStopButtonComponent = ({
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
    <StyledButton
      passingRef={buttonRef}
      id="MeasuringStopButton"
      color="primary"
      role="button"
      messageID="tool.measuring.stop"
      onClick={onClick}
    />
  );
};
const StyledButton = styled(SMButton)(() => ({
  position: 'absolute',
  right: 0,
  top: 86,
  borderRadius: 4,
  border: '2px solid #fff',
}));

MeasuringStopButtonComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MeasuringStopButtonComponent;
