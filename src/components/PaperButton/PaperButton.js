import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import Container from '../Container';

const PaperButton = ({
  classes, disabled, text, onClick, icon, link, subtitle,
}) => {
  const clonedIcon = icon ? React.cloneElement(icon, { className: classes.icon }) : null;
  const role = link ? 'link' : 'button';
  return (
    <Container paper className={`${classes.container} ${disabled ? classes.disabled : ''}`}>
      <Button
        classes={{
          label: classes.iconButtonLabel,
        }}
        className={classes.iconButton}
        onClick={onClick}
        role={role}
        disabled={disabled}
      >
        <div className={`${classes.iconContainer} ${disabled ? classes.iconDisabled : ''}`}>
          {clonedIcon}
        </div>
        <div>
          <Typography variant="body2" className={classes.text}>
            {text}
          </Typography>
          {
            subtitle
            && (
              <Typography variant="caption" className={classes.text}>
                {subtitle}
              </Typography>
            )
          }
        </div>
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
  subtitle: PropTypes.node,
};

PaperButton.defaultProps = {
  disabled: false,
  icon: null,
  link: false,
  onClick: null,
  subtitle: null,
};


export default PaperButton;
