import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import Container from '../Container';

const PaperButton = ({
  classes, text, onClick, icon,
}) => {
  const clonedIcon = icon ? React.cloneElement(icon, { className: classes.icon }) : null;
  return (
    <Container paper className={classes.container}>
      <Button
        classes={{ label: classes.iconButtonLabel }}
        className={classes.iconButton}
        onClick={onClick}
      >
        {clonedIcon}
        <Typography variant="body2" className={classes.text}>
          {text}
        </Typography>
      </Button>
    </Container>
  );
};

PaperButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

PaperButton.defaultProps = {
  icon: null,
  onClick: null,
};


export default PaperButton;
