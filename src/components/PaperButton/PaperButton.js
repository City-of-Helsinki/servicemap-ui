import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import Container from '../Container';

const PaperButton = ({
  classes, disabled, text, onClick, icon, link,
}) => {
  const clonedIcon = icon ? React.cloneElement(icon, { className: classes.icon }) : null;
  const role = link ? 'link' : 'button';
  return (
    <Container paper className={classes.container}>
      <Button
        classes={{
          label: classes.iconButtonLabel,
          disabled: classes.iconButtonDisabled,
        }}
        className={classes.iconButton}
        onClick={onClick}
        role={role}
        disabled={disabled}
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
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  link: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};

PaperButton.defaultProps = {
  disabled: false,
  icon: null,
  link: false,
  onClick: null,
};


export default PaperButton;
