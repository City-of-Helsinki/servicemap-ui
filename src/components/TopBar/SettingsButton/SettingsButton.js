import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, useMediaQuery,
} from '@mui/material';
import SettingsText from '../../SettingsText';

const SettingsButton = ({
  classes, settingsOpen, type, onClick,
}) => {
  const minWidth = useMediaQuery('(min-width:900px)');
  const maxWidth = useMediaQuery('(max-width: 1100px)');

  const isSelected = settingsOpen === type;

  const buttonClass = `
    ${classes.settingsButton} ${(isSelected && classes.settingsButtonPressed) || ''}
    ${(minWidth && maxWidth && classes.smallScreen) || ''}
  `;
  return (
    <Button
      aria-current={isSelected ? 'page' : false}
      aria-haspopup="dialog"
      id={`SettingsButton${type}`}
      classes={{ label: classes.buttonLabel }}
      className={buttonClass}
      onClick={onClick}
      role="button"
    >
      <SettingsText type={type} />
    </Button>
  );
};

SettingsButton.propTypes = {
  classes: PropTypes.shape({
    buttonLabel: PropTypes.string,
    settingsButton: PropTypes.string,
    settingsButtonPressed: PropTypes.string,
    smallScreen: PropTypes.string,
  }).isRequired,
  settingsOpen: PropTypes.oneOf(['citySettings', 'mapSettings', 'accessibilitySettings']),
  type: PropTypes.oneOf(['citySettings', 'mapSettings', 'accessibilitySettings']).isRequired,
  onClick: PropTypes.func.isRequired,
};

SettingsButton.defaultProps = {
  settingsOpen: null,
};

export default SettingsButton;
