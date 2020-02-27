import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Divider, ButtonBase,
} from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import Container from '../Container';
import {
  ColorblindIcon,
  HearingIcon,
  VisualImpairmentIcon,
  getIcon,
  HelsinkiIcon,
  VantaaIcon,
  EspooIcon,
  KauniainenIcon,
} from '../SMIcon';
import constants from './constants';
import SettingsInfoItem from './SettingsInfoItem';
import isClient from '../../utils';

const SettingsInfo = ({
  classes,
  intl,
  settings,
  toggleSettings,
}) => {
  // Don't render on server since settings can't be utilized server side
  if (!isClient()) {
    return null;
  }

  const {
    colorblind, hearingAid, mobility, visuallyImpaired, helsinki, espoo, vantaa, kauniainen,
  } = settings;

  const accessibilitySettings = [
    ...colorblind ? [{ text: intl.formatMessage({ id: 'settings.sense.colorblind' }), icon: <ColorblindIcon /> }] : [],
    ...hearingAid ? [{ text: intl.formatMessage({ id: 'settings.sense.hearing' }), icon: <HearingIcon /> }] : [],
    ...visuallyImpaired ? [{ text: intl.formatMessage({ id: 'settings.sense.visual' }), icon: <VisualImpairmentIcon /> }] : [],
    ...mobility ? [{ text: intl.formatMessage({ id: `settings.mobility.${mobility}` }), icon: getIcon(mobility) }] : [],
  ];

  let citySettings = [
    ...helsinki ? [{ text: `${intl.formatMessage({ id: 'settings.city.helsinki' })}`, icon: <HelsinkiIcon /> }] : [],
    ...espoo ? [{ text: `${intl.formatMessage({ id: 'settings.city.espoo' })}`, icon: <EspooIcon /> }] : [],
    ...vantaa ? [{ text: `${intl.formatMessage({ id: 'settings.city.vantaa' })}`, icon: <VantaaIcon /> }] : [],
    ...kauniainen ? [{ text: `${intl.formatMessage({ id: 'settings.city.kauniainen' })}`, icon: <KauniainenIcon /> }] : [],
  ];

  if (citySettings.length === 4) {
    citySettings = [];
  }

  let totalItems = 0;

  const titleText = accessibilitySettings.length === 0
    && citySettings.length === 0
    ? 'settings.info.title.noSettings' : 'settings.info.title';

  return (
    <>
      <Typography component="h3" variant="srOnly">
        <FormattedMessage id="settings.info.heading" />
      </Typography>
      <Divider aria-hidden="true" />
      <Container className={classes.container}>
        <ButtonBase
          id="SettingsLink"
          aria-labelledby="SettingsInfo-srTitle"
          role="link"
          onClick={() => {
            toggleSettings('search');
            setTimeout(() => {
              const settings = document.getElementsByClassName('SettingsTitle')[0];
              if (settings) {
                // Focus on settings title
                settings.firstChild.focus();
              }
            }, 1);
          }}
          className={classes.settingsLink}
        >
          <Typography
            aria-hidden
            align="left"
            className={classes.title}
            variant="body2"
          >
            <FormattedMessage id={titleText} />
          </Typography>
        </ButtonBase>
        <Typography aria-hidden id="SettingsInfo-srTitle" variant="srOnly">
          <FormattedMessage id={titleText} />
          <FormattedMessage id="settings.aria.open" />
        </Typography>
        <div className={classes.infoItemContainer}>
          {citySettings.length ? citySettings.map((city) => {
            totalItems += 1;
            return (
              <SettingsInfoItem
                classes={classes}
                icon={city.icon}
                key={city.text}
                text={city.text}
                divider={totalItems % constants.columns !== 0}
              />
            );
          }) : null}

          {accessibilitySettings.length ? accessibilitySettings.map((access) => {
            totalItems += 1;
            return (
              <SettingsInfoItem
                classes={classes}
                icon={access.icon}
                key={access.text}
                text={access.text}
                divider={totalItems % constants.columns !== 0}
              />
            );
          }) : null}
        </div>
      </Container>
    </>
  );
};

SettingsInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
};

SettingsInfo.defaultProps = {
};


export default SettingsInfo;
