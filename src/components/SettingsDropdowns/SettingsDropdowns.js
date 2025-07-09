/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled';
import { Checkbox, ListItem, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import config from '../../../config';
import { resetMobilityTreeSelections } from '../../redux/actions/mobilityTree';
import { resetServiceTreeSelections } from '../../redux/actions/serviceTree';
import {
  resetAccessibilitySettings,
  resetCitySettings,
  resetOrganizationSettings,
  setMapType,
  setMobility,
  toggleCity,
  toggleColorblind,
  toggleHearingAid,
  toggleOrganization,
  toggleVisuallyImpaired,
} from '../../redux/actions/settings';
import {
  changeTheme,
  resetCustomPosition,
  resetUserPosition,
} from '../../redux/actions/user';
import { selectSettings } from '../../redux/selectors/settings';
import { selectThemeMode } from '../../redux/selectors/user';
import { keyboardHandler } from '../../utils';
import SettingsUtility from '../../utils/settings';
import useLocaleText from '../../utils/useLocaleText';
import SMButton from '../ServiceMapButton';
import constants from '../SettingsComponent/constants';
import SMAutocomplete from '../SMAutocomplete';

function SettingsDropdowns({ variant = 'default' }) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const settings = useSelector(selectSettings);
  // Format settings from redux to easier structure
  const settingsValues = constants.convertToSettingsValues(settings);
  const [openSettings, setOpenSettings] = useState(null);
  const [resetText, setResetText] = useState('');

  const highlightedOption = useRef(null);
  const themeMode = useSelector(selectThemeMode);
  const ownSettingsVariant = variant === 'ownSettings';

  // Configure rendered settings items
  const senseSettingList = [
    {
      id: 'colorblind',
      title: intl.formatMessage({ id: 'settings.sense.colorblind' }),
    },
    {
      id: 'hearingAid',
      title: intl.formatMessage({ id: 'settings.sense.hearingAid' }),
    },
    {
      id: 'visuallyImpaired',
      title: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }),
    },
  ];
  const mobilitySettingList = [
    { id: 'none', title: intl.formatMessage({ id: 'settings.mobility.none' }) },
    {
      id: 'wheelchair',
      title: intl.formatMessage({ id: 'settings.mobility.wheelchair' }),
    },
    {
      id: 'reduced_mobility',
      title: intl.formatMessage({ id: 'settings.mobility.reduced_mobility' }),
    },
    {
      id: 'rollator',
      title: intl.formatMessage({ id: 'settings.mobility.rollator' }),
    },
    {
      id: 'stroller',
      title: intl.formatMessage({ id: 'settings.mobility.stroller' }),
    },
  ];
  const citySettingsList = config.cities.map((city) => ({
    id: city,
    title: intl.formatMessage({ id: `settings.city.${city}` }),
  }));
  const organizationSettingsList = config.organizations?.map(
    (organization) => ({
      id: organization.id,
      title: getLocaleText(organization.name),
    })
  );

  const toggleSettingsBox = (id) => {
    if (openSettings === id) setOpenSettings(null);
    else setOpenSettings(id);
  };

  const handleOptionSelecting = (id, category) => {
    if (!id) {
      return;
    }

    setResetText('');

    if (category === 'mobility') {
      dispatch(setMobility(id));
      setOpenSettings(null);
    }
    if (category === 'cities') {
      const settingObj = settings.cities;
      settingObj[id] = !settingObj[id];
      dispatch(toggleCity(settingObj));
    }

    if (category === 'organizations') {
      const settingObj = settings.organizations;
      settingObj[id] = !settingObj[id];
      dispatch(toggleOrganization(settingObj));
    }

    if (category === 'senses') {
      if (id === 'hearingAid') {
        dispatch(toggleHearingAid());
      }
      // settingsValues.senses contains all previous sense settings. So now if it does not include
      // "id" then it was turned on just now.
      const settingTurnedOn = !settingsValues.senses.includes(id);
      if (id === 'colorblind') {
        dispatch(toggleColorblind());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
      if (id === 'visuallyImpaired') {
        dispatch(toggleVisuallyImpaired());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
    }
  };

  const resetSettings = () => {
    dispatch(resetAccessibilitySettings());
    dispatch(resetCitySettings());
    dispatch(resetOrganizationSettings());
    dispatch(setMapType(SettingsUtility.defaultMapType));
    dispatch(resetServiceTreeSelections());
    dispatch(resetMobilityTreeSelections());
    dispatch(resetCustomPosition());
    dispatch(changeTheme('default'));
    dispatch(resetUserPosition());

    setResetText(intl.formatMessage({ id: 'settings.reset_button.ariaLive' }));
  };

  const handleKeyboardSelect = (id, category, event) => {
    if (openSettings !== id) setOpenSettings(id);
    else if (event?.which === 13 || event?.which === 32) {
      const highlightedItemId = highlightedOption?.current?.id;
      handleOptionSelecting(highlightedItemId, category);
    }
  };

  const renderSettingsElement = (options, label, category, isSingleOption) => {
    const getValue = () => {
      if (category === 'mobility') {
        const val = options.find(
          (option) => settingsValues.mobility === option.id
        );
        return val?.title || null;
      }
      const list = options.filter((option) =>
        settingsValues[category].includes(option.id)
      );
      return list.map((item) => item.title);
    };

    return (
      <StyledAutocomplete
        open={openSettings === label}
        data-sm={`${category}-setting-dropdown`}
        size="small"
        disablePortal
        disableClearable
        ownsettings={+ownSettingsVariant}
        colormode={themeMode}
        multiple={!isSingleOption}
        openText={intl.formatMessage({ id: 'settings.open' })}
        closeText={intl.formatMessage({ id: 'settings.close' })}
        options={options}
        value={getValue()}
        isOptionEqualToValue={(option) =>
          category === 'mobility'
            ? settingsValues[category] === option.id
            : settingsValues[category].includes(option.id)
        }
        disableCloseOnSelect={!isSingleOption}
        getOptionLabel={(option) => option.title || option}
        onKeyDown={keyboardHandler(
          (e) => handleKeyboardSelect(label, category, e),
          ['space', 'enter', 'up', 'down']
        )}
        onHighlightChange={(e, option) => {
          highlightedOption.current = option;
        }}
        onBlur={() => setOpenSettings(null)}
        ChipProps={{
          clickable: true,
          onDelete: null,
          variant: ownSettingsVariant ? 'outlined' : 'filled',
        }}
        slotProps={{
          // eslint-disable-next-line max-len
          popper: { sx: { pb: 1 } }, // This padding fixes the listBox position on small screens where the list is renderend to top of input
        }}
        renderOption={(props, option) =>
          isSingleOption ? (
            // Single option options box
            <ListItem
              {...props}
              onClick={() => handleOptionSelecting(option.id, category)}
              data-sm={`${category}-${option.id}`}
            >
              <Typography>{option.title}</Typography>
            </ListItem>
          ) : (
            // Checkbox options box
            <ListItem
              {...props}
              onClick={() => handleOptionSelecting(option.id, category)}
              data-sm={`${category}-${option.id}`}
            >
              <Checkbox
                sx={{ mr: 1 }}
                checked={settingsValues[category].includes(option.id)}
              />
              <Typography>{option.title}</Typography>
            </ListItem>
          )
        }
        renderInput={({ inputProps, ...rest }) => (
          <TextField
            label={label}
            onClick={(e) => {
              e?.stopPropagation();
              toggleSettingsBox(label);
            }}
            {...rest}
            sx={{
              fieldset: {
                border: 1,
                boxShadow: 0,
              },
            }}
            inputProps={{
              ...inputProps,
              readOnly: true,
              sx: { cursor: 'pointer' },
            }}
          />
        )}
      />
    );
  };

  return (
    <>
      {renderSettingsElement(
        senseSettingList,
        intl.formatMessage({ id: 'settings.choose.senses' }),
        'senses'
      )}
      {renderSettingsElement(
        mobilitySettingList,
        intl.formatMessage({ id: 'settings.choose.mobility' }),
        'mobility',
        true
      )}
      {renderSettingsElement(
        citySettingsList,
        intl.formatMessage({ id: 'settings.choose.cities' }),
        'cities'
      )}
      {renderSettingsElement(
        organizationSettingsList,
        intl.formatMessage({ id: 'settings.choose.organization' }),
        'organizations'
      )}
      <div>
        <Typography aria-live="polite" style={visuallyHidden}>
          {resetText}
        </Typography>
        <StyledButton
          data-sm="reset-settings-button"
          ownsettings={+ownSettingsVariant}
          color={ownSettingsVariant ? 'primary' : 'default'}
          role="button"
          aria-label={intl.formatMessage({ id: 'settings.reset_button.title' })}
          messageID="settings.reset_button.title"
          onClick={resetSettings}
        />
      </div>
    </>
  );
}

const StyledButton = styled(SMButton)(() => ({ marginRight: 0 }));

const StyledAutocomplete = styled(SMAutocomplete)(({
  theme,
  ownsettings,
  colormode,
}) => {
  const whiteChip = {
    color: theme.palette.white.contrastText,
    backgroundColor: theme.palette.white.main,
  };
  const styles = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '& .MuiAutocomplete-tag':
      colormode === 'dark'
        ? whiteChip
        : {
            color: theme.palette.white.main,
            backgroundColor: 'rgb(47, 60, 187)',
          },
  };
  if (!ownsettings) {
    return {
      ...styles,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    };
  }
  const ownSettingsStyles = {
    backgroundColor: theme.palette.white.main,
    '& .MuiInputLabel-root': {
      color: theme.palette.white.contrastText,
    },
    '&.Mui-focused .MuiInputLabel-root': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiAutocomplete-input': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.dark,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.dark,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiAutocomplete-tag': whiteChip,
  };
  return { ...styles, ...ownSettingsStyles };
});

SettingsDropdowns.propTypes = {
  variant: PropTypes.oneOf(['default', 'ownSettings']),
};

export default SettingsDropdowns;
