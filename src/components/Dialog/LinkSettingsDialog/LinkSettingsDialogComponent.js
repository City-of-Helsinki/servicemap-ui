import {
  ButtonBase,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import isClient from '../../../utils';
import SettingsUtility, { useAcccessibilitySettings } from '../../../utils/settings';
import Dialog from '../index';
import { useSelectedUnit } from '../../../utils/unitHelper';
import useLocaleText from '../../../utils/useLocaleText';

const LinkSettingsDialogComponent = ({
  classes,
  activateSetting,
  resetAccessibilitySettings,
  setOpen,
  ...rest
}) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const unit = useSelectedUnit();
  const a11ySettings = useAcccessibilitySettings();
  const [selected, setSelected] = useState('none');
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  let timeout = null;

  useEffect(() => () => {
    clearTimeout(timeout);
  }, []);

  if (!isClient()) {
    return null;
  }

  const tooltipFadeTime = 2000;

  const delayedTooltipClose = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setCopyTooltipOpen(false);
    }, tooltipFadeTime);
  };

  const title = intl.formatMessage({ id: 'link.settings.dialog.title' });
  const unitName = (unit && unit.name) ? getLocaleText(unit.name) : '';
  const tooltip = intl.formatMessage({ id: 'link.settings.dialog.tooltip' });

  const getLinkUrl = () => {
    let url = window.location.href;
    if (a11ySettings.length && selected !== 'none') {
      url += '?';
      const mobility = a11ySettings.filter(v => SettingsUtility.isValidMobilitySetting(v));
      const senses = a11ySettings
        .filter(v => SettingsUtility.isValidAccessibilitySenseImpairment(v));

      if (mobility.length) {
        url += `mobility=${mobility[0]}`;
      }

      if (senses.length) {
        url += `${mobility && '&'}senses=`;
        senses.forEach((v, i) => {
          url += `${(i > 0 && ',') || ''}${v}`;
        });
      }
    }
    return url;
  };
  const url = getLinkUrl();

  const getSettingsLabel = () => {
    let text = '';

    try {
      a11ySettings.forEach((v) => {
        if (SettingsUtility.isValidMobilitySetting(v)) {
          text += `${intl.formatMessage({ id: `settings.mobility.${v}` })}.`;
        } else if (SettingsUtility.isValidAccessibilitySenseImpairment(v)) {
          text += ` ${intl.formatMessage({ id: `settings.sense.${v}` })}.`;
        }
      });
    } catch (e) {
      console.warn(`Unable to get settings label: ${e.message}`);
    }

    return text;
  };

  const items = [
    {
      value: 'use',
      checked: false,
      label: getSettingsLabel(),
    },
    {
      value: 'none',
      checked: false,
      label: intl.formatMessage({ id: 'accept.settings.dialog.none' }),
    },
  ];

  const copyToClipboard = () => {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(url);
    setCopyTooltipOpen(true);
    delayedTooltipClose();
  };

  return (
    <Dialog
      open
      setOpen={setOpen}
      {...rest}
      title={title}
      content={(
        <div>
          <Tooltip
            arrow
            onClose={() => setCopyTooltipOpen(false)}
            open={copyTooltipOpen}
            title={tooltip}
            aria-label={tooltip}
            PopperProps={{
              disablePortal: true,
            }}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            placement="top"
          >
            <ButtonBase
              className={classes.urlContainer}
              onClick={copyToClipboard}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div>
                <Typography variant="subtitle1">{unitName}</Typography>
                <Typography className={classes.linkText}>{url}</Typography>
              </div>
              <FileCopy className={classes.linkIcon} />
            </ButtonBase>
          </Tooltip>
          <Typography variant="subtitle1"><FormattedMessage id="link.settings.dialog.subtitle" /></Typography>
          <Typography variant="body2"><FormattedMessage id="link.settings.dialog.description" /></Typography>
          <div>
            <RadioGroup
              aria-label={intl.formatMessage({ id: 'download.format' })}
              className={classes.radioGroup}
              name="setting"
              value={selected}
              onChange={(event, value) => {
                setSelected(value);
              }}
            >
              {
                items.map(item => (
                  <FormControlLabel
                    key={item.label}
                    control={(
                      <Radio
                        color="primary"
                      />
                      )}
                    label={item.label}
                    value={item.value}
                  />
                ))
              }
            </RadioGroup>
          </div>
        </div>
      )}
      // actions={(
      //   <SMButton color="primary" role="button" onClick={activateSettings}>
      //     {intl.formatMessage({ id: 'general.open' })}
      //   </SMButton>
      // )
      // }
    />
  );
};

LinkSettingsDialogComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  activateSetting: PropTypes.func.isRequired,
  resetAccessibilitySettings: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default LinkSettingsDialogComponent;
