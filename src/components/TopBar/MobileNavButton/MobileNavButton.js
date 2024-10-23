import { ButtonBase, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import React from 'react';

const MobileNavButton = ({
  icon, text, showBorder = false, ...rest
}) => (
  <StyledButtonBase
    sx={showBorder
      ? { border: '1px solid #CCCCCC', p: 1, mr: 1 }
      : {}}
    {...rest}
  >
    {icon}
    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
      {text}
    </Typography>
  </StyledButtonBase>
);


const StyledButtonBase = styled(ButtonBase)(() => ({
  width: 68,
  height: 54,
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
}));

export default MobileNavButton;

MobileNavButton.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
  showBorder: PropTypes.bool,
};
