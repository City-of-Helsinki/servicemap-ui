import {
  Autocomplete, Checkbox, Container, ListItem, NoSsr, TextField, Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config';
import {
  setMobility, toggleCity, toggleColorblind, toggleHearingAid, toggleVisuallyImpaired,
} from '../../redux/actions/settings';
import { keyboardHandler } from '../../utils';
import SMAccordion from '../SMAccordion';


const SettingsNew = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  const [settingsVisible, setSettingVisible] = useState(true);
  const [openSettings, setOpenSettings] = useState(null);
  const highlightedOption = useRef(null);

  const senses = ['colorblind', 'hearingAid', 'visuallyImpaired'];

  // Format settings from redux to easier structure
  const settingsValues = {
    mobility: settings.mobility,
    senses: Object.keys(settings)
      .filter(key => senses.includes(key) && settings[key] === true),
    cities: Object.keys(settings.cities)
      .filter(city => settings.cities[city] === true),
  };

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
    if (!id) return;
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
      if (id === 'colorblind') dispatch(toggleColorblind());
      if (id === 'hearingAid') dispatch(toggleHearingAid());
      if (id === 'visuallyImpaired') dispatch(toggleVisuallyImpaired());
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
        return val?.title;
      }
      const list = options.filter(option => settingsValues[category].includes(option.id));
      return list.map(item => item.title);
    };

    return (
      <StyledAutocomplete
        open={openSettings === label}
        size="small"
        disablePortal
        multiple={!isSingleOption}
        openText={intl.formatMessage({ id: 'settings.open' })}
        closeText={intl.formatMessage({ id: 'settings.close' })}
        options={options}
        clearIcon={null}
        value={getValue()}
        isOptionEqualToValue={option => settingsValues[category].includes(option.id)}
        disableCloseOnSelect={!isSingleOption}
        getOptionLabel={option => option.title || option}
        onKeyDown={keyboardHandler(e => handleKeyboardSelect(label, category, e), ['space', 'enter', 'up', 'down'])}
        onHighlightChange={(e, option) => {
          highlightedOption.current = option;
        }}
        onBlur={() => setOpenSettings(null)}
        ChipProps={{ clickable: true, onDelete: null }}
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
    <NoSsr>
      <Container
        disableGutters
        sx={{ pb: 2, bgcolor: 'primary.main' }}
      >
        <StyledAccordion
          defaultOpen
          disableUnmount
          onOpen={(e, open) => setSettingVisible(!open)}
          titleContent={settingsVisible
            ? <Typography><FormattedMessage id="general.closeSettings" /></Typography>
            : <Typography><FormattedMessage id="general.openSettings" /></Typography>
          }
          collapseContent={(
            <>
              {renderSettingsElement(senseSettingList, intl.formatMessage({ id: 'settings.choose.senses' }), 'senses')}
              {renderSettingsElement(mobilitySettingList, intl.formatMessage({ id: 'settings.choose.mobility' }), 'mobility', true)}
              {renderSettingsElement(citySettingsList, intl.formatMessage({ id: 'settings.choose.cities' }), 'cities')}
            </>
          )}
        />
      </Container>
    </NoSsr>
  );
};


const StyledAccordion = styled(SMAccordion)(({ theme }) => ({
  height: 32,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.highContrast,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(4),
  '& svg': {
    color: theme.palette.primary.highContrast,
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),

  '& .MuiInputLabel-root': {
    color: theme.palette.white.main,
  },
  '&.Mui-focused .MuiInputLabel-root': {
    color: theme.palette.white.main,
  },

  '& .MuiAutocomplete-input': {
    color: theme.palette.white.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.dark,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.main,
  },
  '&.Mui-focused .MuiOutlinedInput-root': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.white.main,
  },

  '& .MuiAutocomplete-popupIndicator, .MuiChip-deleteIcon': {
    color: theme.palette.white.main,
  },
  '& .MuiAutocomplete-tag': {
    color: theme.palette.white.main,
    backgroundColor: 'rgb(47, 60, 187)',
  },
}));

export default SettingsNew;
