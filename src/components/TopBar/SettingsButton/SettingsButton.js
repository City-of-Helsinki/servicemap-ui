import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, useMediaQuery,
} from '@material-ui/core';
import SettingsText from '../../SettingsText';

const SettingsButton = ({ 'aria-pressed': ariaPressed, classes, settingsOpen, type, onClick }) => {
  const minWidth = useMediaQuery('(min-width:900px)');
  const maxWidth = useMediaQuery('(max-width: 1100px)');
  const buttonClass = (type) => `
    ${classes.settingsButton} ${(settingsOpen === type && classes.settingsButtonPressed) || ''}
    ${(minWidth && maxWidth && classes.smallScreen) || ''}
  `;
  return (
    <Button
      aria-pressed={ariaPressed}
      id={`SettingsButton${type}`}
      classes={{ label: classes.buttonLabel }}
      className={buttonClass(type)}
      onClick={onClick}
    >
      <SettingsText type={type} />
    </Button>
  );
};

SettingsButton.propTypes = {
  'aria-pressed': PropTypes.bool,
  classes: PropTypes.shape({
    buttonLabel: PropTypes.string,
    settingsButton: PropTypes.string,
    settingsButtonPressed: PropTypes.string,
    smallScreen: PropTypes.string,
  }).isRequired,
  settingsOpen: PropTypes.oneOf(['citySettings', 'mapSettings', 'accessibilitySettings']).isRequired,
  type: PropTypes.oneOf(['citySettings', 'mapSettings', 'accessibilitySettings']).isRequired,
  onClick: PropTypes.func.isRequired
};

SettingsButton.defaultProps = {
  'aria-pressed': false,
};

export default SettingsButton;
