import React from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';


const BlueButton = ({
  children, classes, className, onClick, srText, style,
}) => (
  <Button
    className={`${classes.button} ${className}`}
    role="link"
    variant="contained"
    color="primary"
    onClick={onClick}
    aria-label={srText}
    style={style}
  >
    {children}
  </Button>
);

const styles = () => ({
  button: {
    marginLeft: '15%',
    marginRight: '15%',
    width: '70%',
    marginTop: 24,
    marginBottom: 24,
  },
});

BlueButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  srText: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node.isRequired,
};

BlueButton.defaultProps = {
  className: '',
  srText: null,
  style: null,
};

export default withStyles(styles)(BlueButton);
