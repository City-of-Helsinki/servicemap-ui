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
      label: intl.formatMessage({ id: 'settings.sense.colorblind' }),
    },
    {
      id: 'hearingAid',
      label: intl.formatMessage({ id: 'settings.sense.hearingAid' }),
    },
    {
      id: 'visuallyImpaired',
      label: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }),
    },
  ];
  const mobilitySettingList = [
    { id: 'none', label: intl.formatMessage({ id: 'settings.mobility.none' }) },
    {
      id: 'wheelchair',
      label: intl.formatMessage({ id: 'settings.mobility.wheelchair' }),
    },
    {
      id: 'reduced_mobility',
      label: intl.formatMessage({ id: 'settings.mobility.reduced_mobility' }),
    },
    {
      id: 'rollator',
      label: intl.formatMessage({ id: 'settings.mobility.rollator' }),
    },
    {
      id: 'stroller',
      label: intl.formatMessage({ id: 'settings.mobility.stroller' }),
    },
  ];
  const citySettingsList = config.cities.map((city) => ({
    id: city,
    label: intl.formatMessage({ id: `settings.city.${city}` }),
  }));
  const organizationSettingsList = config.organizations?.map(
    (organization) => ({
      id: organization.id,
      label: getLocaleText(organization.name),
    })
  );

  const toggleSettingsBox = (id) => {
    if (openSettings === id) setOpenSettings(null);
    else setOpenSettings(id);
  };

  const handleOptionSelecting = (id, category) => {
    console.log(id);

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

  // New handler for HDS Select that works with arrays
  const handleHDSSelectChange = (selectedOptions, category) => {
    console.log('what: ', selectedOptions);

    if (!selectedOptions) return;

    setResetText('');

    if (category === 'mobility') {
      // For single-select mobility, selectedOptions is a single object
      dispatch(setMobility(selectedOptions.id));
    } else {
      // For multi-select categories, compare current vs new selections
      handleMultiSelectChange(selectedOptions, category);
    }
  };

  const handleMultiSelectChange = (newSelections, category) => {
    const currentSelections = settingsValues[category] || [];

    // Find what was added or removed
    const newIds = newSelections.map((option) => option.id);

    // Find the difference (what changed)
    const added = newIds.filter((id) => !currentSelections.includes(id));
    const removed = currentSelections.filter((id) => !newIds.includes(id));

    // Handle additions
    added.forEach((id) => {
      handleSingleOptionChange(id, category, true);
    });

    // Handle removals
    removed.forEach((id) => {
      handleSingleOptionChange(id, category, false);
    });
  };

  // Refactored version of handleOptionSelecting for individual changes
  const handleSingleOptionChange = (id, category, isAdding = true) => {
    if (category === 'cities') {
      const settingObj = { ...settings.cities };
      settingObj[id] = isAdding;
      dispatch(toggleCity(settingObj));
    }

    if (category === 'organizations') {
      const settingObj = { ...settings.organizations };
      settingObj[id] = isAdding;
      dispatch(toggleOrganization(settingObj));
    }

    if (category === 'senses') {
      // For senses, we need to check the current state and toggle accordingly
      const currentlySelected = settingsValues.senses.includes(id);

      if (id === 'hearingAid' && currentlySelected !== isAdding) {
        dispatch(toggleHearingAid());
      }

      if (id === 'colorblind' && currentlySelected !== isAdding) {
        dispatch(toggleColorblind());
        if (isAdding) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType(SettingsUtility.defaultMapType));
        }
      }

      if (id === 'visuallyImpaired' && currentlySelected !== isAdding) {
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
          (option) => settingsValues.mobility === option.id
        );
        return val?.label || null;
      }
      const list = options.filter((option) =>
        settingsValues[category].includes(option.id)
      );
      return list.map((item) => item.label);
    };

    const getValue = () => {
      if (category === 'mobility') {
    return options.find(
      (option) => settingsValues.mobility === option.id
    );
      }
      return options.filter((option) =>
        settingsValues[category].includes(option.id)
      );
    };

    return (
      
        <Select
          multiselect={!isSingleOption}
          label={label}
          assistive={'Assistive text'}
          language={'en'}
          clearable={false}
          noTags
          options={options}
          value={getValue()} // This should return an array for HDS Select
          style={{
            paddingLeft: 12,
            paddingRight: 12,
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
