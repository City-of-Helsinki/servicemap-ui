import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

// ServiceMapButton
const SMButton = ({
  children, classes, className, onClick, srText, style, role, ...rest
}) => (
  <Button
    className={`${classes.button} ${className}`}
    role={role || 'link'}
    variant="contained"
    color="primary"
    onClick={onClick}
    aria-label={srText}
    style={style}
    {...rest}
  >
    {children}
  </Button>
);

SMButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  srText: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

SMButton.defaultProps = {
  className: '',
  srText: null,
  style: null,
  role: null,
};

export default SMButton;
