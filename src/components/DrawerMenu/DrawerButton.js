import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, ButtonBase, withStyles,
} from '@material-ui/core';
import styles from './styles';


const DrawerButton = ({
  active, classes, disabled, disableRipple, icon, isOpen, text, onClick, subText,
}) => (
  <ButtonBase
    disableRipple={disableRipple}
    key={text}
    tabIndex={isOpen ? 0 : -1}
    role="link"
    aria-hidden={!isOpen}
    aria-label={`${text}${disabled ? ` ${subText}` : ''}`}
    onClick={onClick}
    className={`${classes.drawerButton} ${active ? classes.drawerButtonActive : ''}`}
    focusVisibleClassName={classes.itemFocus}
  >
    <div className={`${classes.drawerIcon} ${active ? classes.drawerIconActive : ''} ${disabled ? classes.disabled : ''}`}>
      {icon}
    </div>
    <span aria-hidden className={classes.buttonLabel}>
      <Typography className={`${classes.drawerButtonText} ${disabled ? classes.disabled : ''}`} variant="body1">{text}</Typography>
      {disabled && <Typography className={classes.drawerButtonText} variant="caption">{subText}</Typography>}
    </span>
  </ButtonBase>
);

DrawerButton.propTypes = {
  active: PropTypes.bool,
  classes: PropTypes.shape({
    buttonLabel: PropTypes.string,
    drawerButton: PropTypes.string,
    drawerButtonActive: PropTypes.string,
    drawerButtonText: PropTypes.string,
    drawerIcon: PropTypes.string,
    drawerIconActive: PropTypes.string,
    disabled: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
  disableRipple: PropTypes.bool,
  icon: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  subText: PropTypes.string,
};

DrawerButton.defaultProps = {
  active: false,
  disabled: false,
  disableRipple: true,
  icon: null,
  subText: null,
};

export default withStyles(styles)(DrawerButton);
