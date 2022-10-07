import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const ColorIndicatorComponent = ({
  gradientColor,
  left,
  middle,
  right,
}) => (
  <StyledColorIndicatorContainer className="ColorIndicatorContainer">
    <StyledColorGradiant
      style={{
        background: `linear-gradient(to right, rgba(0,0,0,0), ${gradientColor})`,
      }}
    />
    <StyledTextContent>
      <StyledSpan>{left}</StyledSpan>
      <StyledSpan>{middle}</StyledSpan>
      <StyledSpan>{right}</StyledSpan>
    </StyledTextContent>
  </StyledColorIndicatorContainer>
);

ColorIndicatorComponent.propTypes = {
  gradientColor: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  middle: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
};

export default ColorIndicatorComponent;

const StyledColorIndicatorContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledColorGradiant = styled('div')`
  flex: 1 0 auto;
  height: 22px;
`;

const StyledSpan = styled('span')`
  margin: 8px;
  margin-bottom: 0;
`;

const StyledTextContent = styled('div')`
  display: flex;
  flex-direction: row;

`;
