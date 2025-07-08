import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';

function ColorIndicatorComponent({ gradientColor, left, middle, right }) {
  return (
    <StyledColorIndicatorContainer className="ColorIndicatorContainer">
      <StyledColorGradiant
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0), ${gradientColor})`,
        }}
      />
      <StyledTextContent component="p" variant="caption">
        <StyledSpan>{left}</StyledSpan>
        <StyledSpan>{middle}</StyledSpan>
        <StyledSpan>{right}</StyledSpan>
      </StyledTextContent>
    </StyledColorIndicatorContainer>
  );
}

ColorIndicatorComponent.propTypes = {
  gradientColor: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  middle: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
};

export default ColorIndicatorComponent;

const StyledColorIndicatorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(1),
}));

const StyledColorGradiant = styled('div')`
  flex: 1 0 auto;
  height: 22px;
`;

const StyledSpan = styled('span')`
  margin: 8px;
  margin-bottom: 0;
`;

const StyledTextContent = styled(Typography)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #000;
  font-weight: normal;
`;
