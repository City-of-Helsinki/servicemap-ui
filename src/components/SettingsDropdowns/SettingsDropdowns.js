import PropTypes from 'prop-types';
import {
  Checkbox, ListItem, TextField, Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config';
import { keyboardHandler } from '../../utils';
import SMAutocomplete from '../SMAutocomplete';
import constants from '../SettingsComponent/constants';
import {
  setMapType, setMobility, toggleCity, toggleColorblind, toggleHearingAid, toggleVisuallyImpaired,
} from '../../redux/actions/settings';

const SettingsDropdowns = ({ variant }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  // Format settings from redux to easier structure
  const settingsValues = constants.convertToSettingsValues(settings);
  const [openSettings, setOpenSettings] = useState(null);
  const highlightedOption = useRef(null);
  const theme = useSelector(state => state.user.theme);

  // Configure rendered settings items
  const senseSettingList = [
    { id: 'colorblind', title: intl.formatMessage({ id: 'settings.sense.colorblind' }) },
    { id: 'hearingAid', title: intl.formatMessage({ id: 'settings.sense.hearingAid' }) },
    { id: 'visuallyImpaired', title: intl.formatMessage({ id: 'settings.sense.visuallyImpaired' }) },
  ];
  const mobilitySettingList = [
    { id: 'none', title: intl.formatMessage({ id: 'settings.mobility.none' }) },
    { id: 'wheelchair', title: intl.formatMessage({ id: 'settings.mobility.wheelchair' }) },
    { id: 'reduced_mobility', title: intl.formatMessage({ id: 'settings.mobility.reduced_mobility' }) },
    { id: 'rollator', title: intl.formatMessage({ id: 'settings.mobility.rollator' }) },
    { id: 'stroller', title: intl.formatMessage({ id: 'settings.mobility.stroller' }) },
  ];
  const citySettingsList = config.cities.map(city => (
    { id: city, title: intl.formatMessage({ id: `settings.city.${city}` }) }
  ));

  const toggleSettingsBox = (id) => {
    if (openSettings === id) setOpenSettings(null);
    else setOpenSettings(id);
  };

  const handleOptionSelecting = (id, category) => {
    if (!id) {
      return;
    }
    if (category === 'mobility') {
      dispatch(setMobility(id));
      setOpenSettings(null);
    }
    if (category === 'cities') {
      const settingObj = settings.cities;
      settingObj[id] = !settingObj[id];
      dispatch(toggleCity(settingObj));
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
          dispatch(setMapType('servicemap'));
        }
      }
      if (id === 'visuallyImpaired') {
        dispatch(toggleVisuallyImpaired());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType('servicemap'));
        }
      }
    }
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
        const val = options.find(option => settingsValues.mobility === option.id);
        return val?.title || null;
      }
      const list = options.filter(option => settingsValues[category].includes(option.id));
      return list.map(item => item.title);
    };

    const ownSettingsVariant = variant === 'ownSettings';
    return (
      <StyledAutocomplete
        open={openSettings === label}
        id={`${category}-setting-dropdown`}
        size="small"
        disablePortal
        ownsettings={+ownSettingsVariant}
        colormode={theme}
        multiple={!isSingleOption}
        openText={intl.formatMessage({ id: 'settings.open' })}
        closeText={intl.formatMessage({ id: 'settings.close' })}
        options={options}
        clearIcon={null}
        value={getValue()}
        isOptionEqualToValue={option => (
          category === 'mobility'
            ? settingsValues[category] === option.id
            : settingsValues[category].includes(option.id)
        )}
        disableCloseOnSelect={!isSingleOption}
        getOptionLabel={option => option.title || option}
        onKeyDown={keyboardHandler(e => handleKeyboardSelect(label, category, e), ['space', 'enter', 'up', 'down'])}
        onHighlightChange={(e, option) => {
          highlightedOption.current = option;
        }}
        onBlur={() => setOpenSettings(null)}
        ChipProps={{
          clickable: true, onDelete: null, variant: ownSettingsVariant ? 'outlined' : 'filled',
        }}
        renderOption={(props, option) => (isSingleOption
          ? ( // Single option options box
            <ListItem {...props} onClick={() => handleOptionSelecting(option.id, category)} id={`${category}-${option.id}`}>
              <Typography>{option.title}</Typography>
            </ListItem>
          )
          : ( // Checkbox options box
            <ListItem {...props} onClick={() => handleOptionSelecting(option.id, category)} id={`${category}-${option.id}`}>
              <Checkbox
                sx={{ mr: 1 }}
                checked={settingsValues[category].includes(option.id)}
              />
              <Typography>{option.title}</Typography>
            </ListItem>
          ))
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
      {renderSettingsElement(senseSettingList, intl.formatMessage({ id: 'settings.choose.senses' }), 'senses')}
      {renderSettingsElement(mobilitySettingList, intl.formatMessage({ id: 'settings.choose.mobility' }), 'mobility', true)}
      {renderSettingsElement(citySettingsList, intl.formatMessage({ id: 'settings.choose.cities' }), 'cities')}
    </>
  );
};


const StyledAutocomplete = styled(SMAutocomplete)(({ theme, ownsettings, colormode }) => {
  const whiteChip = {
    color: theme.palette.white.contrastText,
    backgroundColor: theme.palette.white.main,
  };
  const styles = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '& .MuiAutocomplete-tag': colormode === 'dark'
      ? whiteChip
      : {
        color: theme.palette.white.main, backgroundColor: 'rgb(47, 60, 187)',
      },
  };
  if (!ownsettings) {
    return { ...styles, paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) };
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

SettingsDropdowns.defaultProps = {
  variant: 'default',
};

export default SettingsDropdowns;
