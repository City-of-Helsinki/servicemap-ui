import {
  ButtonBase,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Tooltip,
} from '@mui/material';
import { FileCopy, Share } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import isClient from '../../../utils';
import SettingsUtility, { useAcccessibilitySettings } from '../../../utils/settings';
import Dialog from '../index';
import { useSelectedUnit } from '../../../utils/unitHelper';
import useLocaleText from '../../../utils/useLocaleText';

const CopyTooltip = ({
  children,
  ...rest
}) => (
  <Tooltip
    arrow
    PopperProps={{
      disablePortal: true,
    }}
    disableFocusListener
    disableHoverListener
    disableTouchListener
    placement="top"
    {...rest}
  >
    {children}
  </Tooltip>
);

CopyTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

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
  const [copyTooltipOpen1, setCopyTooltipOpen1] = useState(false);
  const [copyTooltipOpen2, setCopyTooltipOpen2] = useState(false);
  const [showAriaAlert, setShowAriaAlert] = useState(false);
  let timeout = null;
  let timeoutAriaAlert = null;


  useEffect(() => () => {
    clearTimeout(timeout);
    clearTimeout(timeoutAriaAlert);
  }, []);

  if (!isClient()) {
    return null;
  }

  const tooltipFadeTime = 2000;

  const delayedTooltipClose = (stateSetter) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      stateSetter(false);
    }, tooltipFadeTime);
  };

  const actionButtonText = intl.formatMessage({ id: 'link.settings.dialog.buttons.action' });
  const title = intl.formatMessage({ id: 'link.settings.dialog.title' });
  const unitName = (unit && unit.name) ? getLocaleText(unit.name) : '';
  const tooltip = intl.formatMessage({ id: 'link.settings.dialog.tooltip' });
  const tooltipAria = intl.formatMessage({ id: `link.settings.dialog.tooltip.aria${(selected !== 'none' && '.a11y') || ''}` });
  const radioAria = intl.formatMessage({ id: 'link.settings.dialog.radio.label' });

  const getLinkUrl = () => {
    const url = new URL(window.location.href);
    if (a11ySettings.length && selected !== 'none') {
      const mobility = a11ySettings.filter(v => SettingsUtility.isValidMobilitySetting(v));
      const senses = a11ySettings
        .filter(v => SettingsUtility.isValidAccessibilitySenseImpairment(v));

      if (mobility.length) {
        url.searchParams.append('mobility', mobility[0]);
      }

      if (senses.length) {
        url.searchParams.append('senses', senses.join(','));
      }
    }
    return url.toString();
  };
  const url = getLinkUrl();

  const getSettingsLabel = () => {
    let text = '';

    try {
      a11ySettings.forEach((v, i) => {
        if (SettingsUtility.isValidMobilitySetting(v)) {
          text += `${intl.formatMessage({ id: `settings.mobility.${v}` })}`;
        } else if (SettingsUtility.isValidAccessibilitySenseImpairment(v)) {
          text += `${intl.formatMessage({ id: `settings.sense.${v}` })}`;
        }
        text += (i + 1) < a11ySettings.length ? ', ' : '';
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

  const copyToClipboard = (stateSetter) => {
    if (!stateSetter) {
      throw new Error('Invalid parameter stateSetter given to copyToClipboard');
    }
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(url).then(
      () => {
        stateSetter(true);
        delayedTooltipClose(stateSetter);
      },
      (e) => {
        console.warn(`Error while copying to clipboard: ${e.message}`);
      },
    );
  };

  const toggleAriaLive = () => {
    setShowAriaAlert(true);
    timeoutAriaAlert = setTimeout(() => {
      setShowAriaAlert(false);
    }, 2000);
  };

  return (
    <Dialog
      open
      setOpen={setOpen}
      {...rest}
      title={title}
      content={(
        <div className={classes.container}>
          <CopyTooltip
            open={copyTooltipOpen1}
            title={tooltip}
            aria-label={tooltipAria}
          >
            <ButtonBase
              className={classes.urlContainer}
              onClick={() => {
                toggleAriaLive();
                copyToClipboard(setCopyTooltipOpen1);
              }}
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
          </CopyTooltip>
          <Typography variant="subtitle1"><FormattedMessage id="link.settings.dialog.subtitle" /></Typography>
          <Typography variant="body2"><FormattedMessage id="link.settings.dialog.description" /></Typography>
          <div>
            <RadioGroup
              aria-label={radioAria}
              className={classes.radioGroup}
              name="setting"
              value={selected}
              onChange={(event, value) => {
                setSelected(value);
              }}
            >
              {
                items.map(item => item.label !== '' && (
                  <FormControlLabel
                    key={item.label}
                    control={(
                      <Radio
                        color="primary"
                      />
                      )}
                    label={item.label}
                    value={item.value}
                    classes={{
                      root: classes.radioGroupItem,
                    }}
                  />
                ))
              }
            </RadioGroup>
          </div>
          {
            showAriaAlert
            && (
              <Typography aria-live="polite" id="copy_link_aria_live" style={visuallyHidden}><FormattedMessage id="link.settings.dialog.tooltip" /></Typography>
            )
          }
        </div>
      )}
      actions={(
        <CopyTooltip
          open={copyTooltipOpen2}
          title={tooltip}
          aria-label={tooltipAria}
        >
          <ButtonBase
            className={classes.shareButton}
            onClick={() => {
              toggleAriaLive();
              copyToClipboard(setCopyTooltipOpen2);
            }}
          >
            {actionButtonText}
            <Share className={classes.shareIcon} />
          </ButtonBase>
        </CopyTooltip>
      )}
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
