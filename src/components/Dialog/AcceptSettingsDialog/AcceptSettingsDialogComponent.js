import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import isClient from '../../../utils';
import SettingsUtility from '../../../utils/settings';
import SMButton from '../../ServiceMapButton';
import Dialog from '../index';

const AcceptSettingsDialogComponent = ({
  classes,
  activateSetting,
  resetAccessibilitySettings,
  setOpen,
  ...rest
}) => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const [selected, setSelected] = useState('none');

  if (!isClient()) {
    return null;
  }

  const search = new URLSearchParams(location.search);
  const mobility = search.get('mobility');
  const senses = search.get('senses')?.split(',') || [];

  const title = intl.formatMessage({ id: 'accept.settings.dialog.title' });

  const getSettingsLabel = () => {
    let text = '';

    try {
      if (SettingsUtility.isValidMobilitySetting(mobility)) {
        text += `${intl.formatMessage({ id: `settings.mobility.${mobility}` })}`;
        if (senses.length) {
          text += ', ';
        }
      }

      senses.forEach((s, i) => {
        if (SettingsUtility.isValidAccessibilitySenseImpairment(s)) {
          text += `${intl.formatMessage({ id: `settings.sense.${s}` })}.`;
        }
        text += (i + 1) < senses.length ? ', ' : '';
      });
    } catch (e) {
      console.warn(`Unable to get settings label: ${e.message}`);
    }

    return text;
  };

  const resetA11ySearchParams = () => {
    search.delete('mobility');
    search.delete('senses');
    history.replace({
      search: search.toString(),
    });
  };

  // Activate settings
  const activateSettings = () => {
    if (selected === 'use') {
      resetAccessibilitySettings();

      activateSetting('mobility', mobility);
      senses.forEach((s) => {
        activateSetting(s);
      });
    }

    resetA11ySearchParams();
    setOpen(false);
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

  return (
    <Dialog
      open
      onClose={() => resetA11ySearchParams()}
      setOpen={setOpen}
      {...rest}
      title={title}
      content={(
        <div>
          <Typography variant="body2"><FormattedMessage id="accept.settings.dialog.description" /></Typography>
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
      actions={(
        <SMButton color="primary" role="button" onClick={activateSettings}>
          {intl.formatMessage({ id: 'general.open' })}
        </SMButton>
      )
      }
    />
  );
};

AcceptSettingsDialogComponent.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  activateSetting: PropTypes.func.isRequired,
  resetAccessibilitySettings: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AcceptSettingsDialogComponent;
