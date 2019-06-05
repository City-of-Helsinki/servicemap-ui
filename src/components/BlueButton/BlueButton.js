import React from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';


const BlueButton = ({
  onClick, srText, classes, children,
}) => (
  <Button
    className={classes.button}
    role="link"
    variant="contained"
    color="primary"
    onClick={onClick}
    aria-label={srText}
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
  onClick: PropTypes.func.isRequired,
  srText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node.isRequired,
};

BlueButton.defaultProps = {
  srText: null,
};

export default withStyles(styles)(BlueButton);
