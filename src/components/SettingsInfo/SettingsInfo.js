import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Divider, ButtonBase, NoSsr,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Container from '../Container';
import {
  ColorblindIcon,
  HearingIcon,
  VisualImpairmentIcon,
  getIcon,
} from '../SMIcon';
import SMIcon from '../SMIcon/SMIcon';
import constants from './constants';
import SettingsInfoItem from './SettingsInfoItem';
import isClient from '../../utils';
import config from '../../../config';

const SettingsInfo = ({
  classes,
  intl,
  settings,
  toggleSettings,
  onlyCities,
  title,
  altTitle,
  settingsPage,
  noDivider,
}) => {
  // Don't render on server since settings can't be utilized server side
  if (!isClient()) {
    return null;
  }

  const {
    colorblind, hearingAid, mobility, visuallyImpaired,
  } = settings;

  const accessibilitySettings = onlyCities ? [] : [
    ...colorblind ? [{ text: intl.formatMessage({ id: 'settings.sense.colorblind' }), icon: <ColorblindIcon /> }] : [],
    ...hearingAid ? [{ text: intl.formatMessage({ id: 'settings.sense.hearingAid' }), icon: <HearingIcon /> }] : [],
    ...visuallyImpaired ? [{ text: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }), icon: <VisualImpairmentIcon /> }] : [],
    ...mobility ? [{ text: intl.formatMessage({ id: `settings.mobility.${mobility}` }), icon: getIcon(mobility) }] : [],
  ];

  let citySettings = [];
  config.cities.forEach((city) => {
    citySettings.push(...settings.cities[city] ? [{ text: `${intl.formatMessage({ id: `settings.city.${city}` })}`, icon: <SMIcon icon={`icon-icon-coat-of-arms-${city}`} /> }] : []);
  });

  if (!onlyCities && citySettings.length === config.cities.length) {
    citySettings = [];
  }

  let totalItems = 0;

  const titleText = accessibilitySettings.length === 0
    && citySettings.length === 0
    ? altTitle || 'settings.info.title.noSettings' : title || 'settings.info.title';

  return (
    <NoSsr>
      <Typography component="h3" variant="srOnly">
        <FormattedMessage id="settings.info.heading" />
      </Typography>
      {!noDivider && (
        <Divider aria-hidden="true" />
      )}
      <Container className={classes.container}>
        <ButtonBase
          id="SettingsLink"
          aria-labelledby="SettingsInfo-srTitle"
          role="link"
          onClick={() => {
            toggleSettings(settingsPage || 'search');
            setTimeout(() => {
              const settings = document.getElementsByClassName('TitleText')[0];
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

          {!onlyCities && accessibilitySettings.length ? accessibilitySettings.map((access) => {
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
    </NoSsr>
  );
};

SettingsInfo.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleSettings: PropTypes.func.isRequired,
  onlyCities: PropTypes.bool,
  title: PropTypes.string,
  altTitle: PropTypes.string,
  settingsPage: PropTypes.string,
  noDivider: PropTypes.bool,
};

SettingsInfo.defaultProps = {
  onlyCities: false,
  title: null,
  altTitle: null,
  settingsPage: null,
  noDivider: false,
};


export default SettingsInfo;
