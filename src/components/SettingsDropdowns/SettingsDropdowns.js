/* eslint-disable react/jsx-props-no-spreading */
import styled from '@emotion/styled';
import { Checkbox, ListItem, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Select } from 'hds-react';
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
import { getLocale } from '../../redux/selectors/user';
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
  const locale = useSelector(getLocale);
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
      value: 'colorblind',
      label: intl.formatMessage({ id: 'settings.sense.colorblind' }),
    },
    {
      value: 'hearingAid',
      label: intl.formatMessage({ id: 'settings.sense.hearingAid' }),
    },
    {
      value: 'visuallyImpaired',
      label: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }),
    },
  ];
  const mobilitySettingList = [
    {
      value: 'none',
      label: intl.formatMessage({ id: 'settings.mobility.none' }),
    },
    {
      value: 'wheelchair',
      label: intl.formatMessage({ id: 'settings.mobility.wheelchair' }),
    },
    {
      value: 'reduced_mobility',
      label: intl.formatMessage({ id: 'settings.mobility.reduced_mobility' }),
    },
    {
      value: 'rollator',
      label: intl.formatMessage({ id: 'settings.mobility.rollator' }),
    },
    {
      value: 'stroller',
      label: intl.formatMessage({ id: 'settings.mobility.stroller' }),
    },
  ];
  const citySettingsList = config.cities.map((city) => ({
    value: city,
    label: intl.formatMessage({ id: `settings.city.${city}` }),
  }));
  const organizationSettingsList = config.organizations?.map(
    (organization) => ({
      value: organization.id,
      label: getLocaleText(organization.name),
    })
  );

  const toggleSettingsBox = (value) => {
    if (openSettings === value) setOpenSettings(null);
    else setOpenSettings(value);
  };

  const handleOptionSelecting = (value, category) => {
    console.log(value);

    if (!value) {
      return;
    }

    setResetText('');

    if (category === 'mobility') {
      dispatch(setMobility(value));
      setOpenSettings(null);
    }
    if (category === 'cities') {
      const settingObj = settings.cities;
      settingObj[value] = !settingObj[value];
      dispatch(toggleCity(settingObj));
    }

    if (category === 'organizations') {
      const settingObj = settings.organizations;
      settingObj[value] = !settingObj[value];
      dispatch(toggleOrganization(settingObj));
    }

    if (category === 'senses') {
      if (value === 'hearingAid') {
        dispatch(toggleHearingAid());
      }
      // settingsValues.senses contains all previous sense settings. So now if it does not include
      // "value" then it was turned on just now.
      const settingTurnedOn = !settingsValues.senses.includes(value);
      if (value === 'colorblind') {
        dispatch(toggleColorblind());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
      if (value === 'visuallyImpaired') {
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

  const handleKeyboardSelect = (value, category, event) => {
    if (openSettings !== value) setOpenSettings(value);
    else if (event?.which === 13 || event?.which === 32) {
      const highlightedItemId = highlightedOption?.current?.value;
      handleOptionSelecting(highlightedItemId, category);
    }
  };

  // New handler for HDS Select that works with arrays
  const handleHDSSelectChange = (selectedOptions, category) => {
    console.log('oppions: ', selectedOptions, 'katgori: ', category);

    if (!selectedOptions) return;

    setResetText('');

    if (category === 'mobility') {
      // For single-select mobility, selectedOptions is a single object
      dispatch(setMobility(selectedOptions[0].value));
    } else {
      // For multi-select categories, compare current vs new selections
      handleMultiSelectChange(selectedOptions, category);
    }
  };

  const handleMultiSelectChange = (newSelections, category) => {
    const currentSelections = settingsValues[category] || [];

    // Find what was added or removed
    const newIds = newSelections.map((option) => option.value);

    // Find the difference (what changed)
    const added = newIds.filter((value) => !currentSelections.includes(value));
    const removed = currentSelections.filter(
      (value) => !newIds.includes(value)
    );

    // Handle additions
    added.forEach((value) => {
      handleSingleOptionChange(value, category, true);
    });

    // Handle removals
    removed.forEach((value) => {
      handleSingleOptionChange(value, category, false);
    });
  };

  // Refactored version of handleOptionSelecting for individual changes
  const handleSingleOptionChange = (value, category, isAdding = true) => {
    console.log(value, category, isAdding);

    if (category === 'cities') {
      const settingObj = { ...settings.cities };
      settingObj[value] = isAdding;
      dispatch(toggleCity(settingObj));
    }

    if (category === 'organizations') {
      const settingObj = { ...settings.organizations };
      settingObj[value] = isAdding;
      dispatch(toggleOrganization(settingObj));
    }

    if (category === 'senses') {
      // For senses, we need to check the current state and toggle accordingly
      const currentlySelected = settingsValues.senses.includes(value);

      if (value === 'hearingAid' && currentlySelected !== isAdding) {
        dispatch(toggleHearingAid());
      }

      if (value === 'colorblind' && currentlySelected !== isAdding) {
        dispatch(toggleColorblind());
        if (isAdding) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }

      if (value === 'visuallyImpaired' && currentlySelected !== isAdding) {
        dispatch(toggleVisuallyImpaired());
        if (isAdding) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }
    }
  };

  const renderSettingsElement = (options, label, category, isSingleOption) => {
    const getValueP = () => {
      if (category === 'mobility') {
        const val = options.find(
          (option) => settingsValues.mobility === option.value
        );
        return val?.label || null;
      }
      const list = options.filter((option) =>
        settingsValues[category].includes(option.value)
      );
      return list.map((item) => item.label);
    };

    const getValue = () => {
      if (category === 'mobility') {
        const option = options.find(
          (option) => settingsValues.mobility === option.value
        );
        return option ? [option] : [];
        // return options.find((option) => settingsValues.mobility === option.value);
      }
      return options.filter((option) =>
        settingsValues[category].includes(option.value)
      );
    };

    const StyledSelectWrapper = styled.div`
      ${({ ownsettings, theme }) =>
        ownsettings &&
        `
    /* Target the main dropdown container */
    .hds-select > div {
      border: 2px solid var(--color-bus) !important;
      border-radius: 5px !important;
    }
    
    /* Target the dropdown menu */
    .hds-select [role="listbox"] {
      border: 2px solid var(--color-bus) !important;
      border-radius: 5px !important;
    }
    
    /* Target specific child divs - inspect DOM to find exact selectors */
    .hds-select__dropdown {
      border: 2px solid pink !important;
    }
  `}
    `;

    const SimpleWrapper = styled.div`
      /* This styles the wrapper itself */
      //  padding: 10px;

      /* This styles child elements inside the wrapper */
      div {
      }

      /* Target DIRECT child divs only */
      > div > div {
        color: white;
        border-radius: 6px;
        line-height: 1.5;
      }

      /* Additional styling when ownSettingsVariant is true */
      ${({ ownsettings }) =>
        !ownsettings &&
        `
     > div > label {
        color: white;
      }
  `}
    `;

    const hdsTheme = ownSettingsVariant
      ? {}
      : {
          // Focus outline
          '--focus-outline-color': 'white',
          '--dropdown-background-default': 'var(--color-bus)',
          '--dropdown-color-default': 'var(--color-white)',
          '--dropdown-icon-color': 'var(--color-white)',
          '--menu-divider-color': 'var(--color-white)',
          '--dropdown-border-color-default': 'var(--color-white)',
          '--menu-item-background-color-selected': 'gray',
          '--text-input-background-default': 'var(--color-black)',
        };

    return (
      <SimpleWrapper ownsettings={ownSettingsVariant}>
        <Select
          multiSelect={!isSingleOption}
          texts={{
            label: label,

            language: locale,
          }}
          clearable={false}
          noTags
          options={options}
          value={getValue()}
          theme={hdsTheme}
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            textAlign: 'left',
            // borderRadius: '5px',
          }}
          onChange={(selectedOptions) => {
            console.log('HDS Select onChange:', selectedOptions);
            handleHDSSelectChange(selectedOptions, category);
          }}
          onClose={(selectedOptions) => {
            console.log('HDS Select onClose:', selectedOptions);
            // Optional: Handle close event if needed
          }}
        />
      </SimpleWrapper>
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
