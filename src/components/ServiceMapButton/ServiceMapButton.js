import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Typography } from '@material-ui/core';

// ServiceMapButton
const ServiceMapButton = ({
  classes, text, icon, className, onClick, srText, style, role, disabled, ...rest
}) => {
  const buttonIcon = icon ? React.cloneElement(icon, { className: classes.buttonIcon }) : null;
  return (
    <ButtonBase
      className={`${classes.button} ${disabled ? classes.disabled : ''} ${className}`}
      role={role || 'link'}
      onClick={onClick}
      aria-label={srText}
      style={style}
      disabled={disabled}
      {...rest}
    >
      {buttonIcon}
      <Typography className={classes.buttonText}>
        {text}
      </Typography>
    </ButtonBase>
  );
};

ServiceMapButton.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  srText: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  role: PropTypes.string,
  disabled: PropTypes.bool,
};

ServiceMapButton.defaultProps = {
  className: '',
  icon: null,
  srText: null,
  style: null,
  role: null,
  disabled: false,
};

export default ServiceMapButton;
