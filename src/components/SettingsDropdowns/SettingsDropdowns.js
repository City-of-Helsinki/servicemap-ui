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


const SettingsDropdowns = ({ variant }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  // Format settings from redux to easier structure
  const settingsValues = constants.convertToSettingsValues(settings);
  const [openSettings, setOpenSettings] = useState(null);
  const highlightedOption = useRef(null);

  // Configure rendered settings items
  const senseSettingList = constants.convertSettingsList(constants.senseSettingList, intl);
  const mobilitySettingList = constants.convertSettingsList(constants.mobilitySettingList, intl);
  const citySettingsList = config.cities.map(city => (
    { id: city, title: intl.formatMessage({ id: `settings.city.${city}` }) }
  ));

  const toggleSettingsBox = (id) => {
    if (openSettings === id) setOpenSettings(null);
    else setOpenSettings(id);
  };

  const handleOptionSelecting = (id, category) => {
    constants.handleOptionSelecting(id, category, dispatch, settings.cities, settingsValues);
    if (category === 'mobility') {
      setOpenSettings(null);
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
        size="small"
        disablePortal
        ownsettings={+ownSettingsVariant}
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
            <ListItem {...props} onClick={() => handleOptionSelecting(option.id, category)}>
              <Typography>{option.title}</Typography>
            </ListItem>
          )
          : ( // Checkbox options box
            <ListItem {...props} onClick={() => handleOptionSelecting(option.id, category)}>
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
            onClick={() => toggleSettingsBox(label)}
            {...rest}
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


const StyledAutocomplete = styled(SMAutocomplete)(({ theme, ownsettings }) => {
  const styles = {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.dark,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.white.main,
    },

    '& .MuiAutocomplete-popupIndicator, .MuiChip-deleteIcon': {
      color: theme.palette.white.contrastText,
    },
    '& .MuiAutocomplete-tag': {
      color: theme.palette.white.contrastText,
      backgroundColor: theme.palette.white.main,
    },
  };
  return { ...styles, ...ownSettingsStyles };
});

SettingsDropdowns.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  variant: PropTypes.oneOf(['default', 'ownSettings']),
};

SettingsDropdowns.defaultProps = {
  variant: 'default',
};

export default SettingsDropdowns;
