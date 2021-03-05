import { ButtonBase, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SettingsText from '../../../SettingsText';
import { getIcon } from '../../../SMIcon';

const DrawerSettings = ({ classes, onClick }) => {
  const icon = getIcon('accessibility');
  const settings = ['citySettings', 'mapSettings', 'accessibilitySettings'];
  return (
    <div className={`${classes.container}`}>
      <div className={`${classes.drawerIcon}`}>
        {icon}
      </div>
      <span className={classes.buttonLabel}>
        <Typography component="p" variant="body1"><FormattedMessage id="home.buttons.settings" /></Typography>
        <Typography component="p" variant="srOnly"><FormattedMessage id="settings.drawer.aria.title" /></Typography>
        {
          settings.map(s => (
            <div key={s} className={classes.textContainer}>
              <SettingsText type={s} variant="small" />
            </div>
          ))
        }
        <ButtonBase
          role="link"
          className={classes.link}
          onClick={onClick}
        >
          <Typography component="p" variant="body2"><FormattedMessage id="settings.change" /></Typography>
        </ButtonBase>
      </span>
    </div>

  );
};

DrawerSettings.propTypes = {
  classes: PropTypes.shape({
    buttonLabel: PropTypes.string,
    container: PropTypes.string,
    drawerIcon: PropTypes.string,
    drawerIconActive: PropTypes.string,
    link: PropTypes.string,
    textContainer: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DrawerSettings;
