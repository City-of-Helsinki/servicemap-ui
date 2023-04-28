/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormControl, ListItem, TextField, Typography,
} from '@mui/material';
import { Tune } from '@mui/icons-material';
import { styled } from '@mui/styles';
import { useAcccessibilitySettings } from '../../utils/settings';
import SMAutocomplete from '../SMAutocomplete';
import { keyboardHandler } from '../../utils';

const allowedDirections = [
  'asc',
  'desc',
];

const allowedOrders = [
  // 'match',
  'alphabetical',
  'accessibility',
  'distance',
];

const allowedInitialValues = [
  // 'match-desc',
  'alphabetical-desc',
  'alphabetical-asc',
  'accessibility-desc',
  'distance-asc',
];

const ResultOrderer = ({
  classes,
  initialOrder,
  direction,
  intl,
  order,
  disabled,
  setDirection,
  setOrder,
  userLocation,
}) => {
  const accessibiliySettingsLength = useAcccessibilitySettings().length;
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ direction, order });
  const highlightedOption = useRef(null);
  const isValidDirection = direction => direction && allowedDirections.indexOf(direction) > -1;

  const isValidOrder = order => order && allowedOrders.indexOf(order) > -1;

  useEffect(() => {
    if (initialOrder) {
      const parts = initialOrder.split('-');
      const direction = parts[1];
      const order = parts[0];

      if (isValidDirection(direction) && isValidOrder(order)) {
        setDirection(direction);
        setOrder(order);
      }
    }
  }, []);

  useEffect(() => {
    if (accessibiliySettingsLength) {
      setOrder('accessibility');
    }
  }, [accessibiliySettingsLength]);

  const selectedOptionId = `${selectedOption.order}-${selectedOption.direction}`;
  const handleOptionSelecting = (optionId) => {
    if (!optionId) {
      return;
    }
    const array = optionId.split('-');
    const direction = array[1];
    const order = array[0];

    if (isValidDirection(direction) && isValidOrder(order)) {
      setDirection(direction);
      setOrder(order);
      setSelectedOption({ direction, order });
    }
    setOpenSettings(false);
  };

  const handleKeyboardSelect = (event) => {
    if (!openSettings) {
      setOpenSettings(true);
    }
    if (event?.which === 13 || event?.which === 32) {
      handleOptionSelecting(highlightedOption?.current?.id);
    }
  };

  const options = [
    { id: 'alphabetical-desc', title: intl.formatMessage({ id: 'sorting.alphabetical.desc' }) },
    { id: 'alphabetical-asc', title: intl.formatMessage({ id: 'sorting.alphabetical.asc' }) },
    { id: 'accessibility-desc', title: intl.formatMessage({ id: 'sorting.accessibility.desc' }) },
  ];
  if (userLocation) {
    options.push({ id: 'distance-asc', title: intl.formatMessage({ id: 'sorting.distance.asc' }) });
  }


  const getValue = () => {
    const selectedOption = options.find(option => option.id === selectedOptionId);
    return selectedOption?.title;
  };

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <div style={{ display: 'flex', width: '100%', borderBottom: 'solid 1px white' }}>
          <StyledTune />
          <div style={{ display: 'flex', width: '100%' }}>
            <StyledAutocomplete
              open={openSettings}
              size="small"
              disablePortal
              disabled={disabled}
              multiple={false}
              openText={intl.formatMessage({ id: 'settings.open' })}
              closeText={intl.formatMessage({ id: 'settings.close' })}
              onKeyDown={keyboardHandler(e => handleKeyboardSelect(e), ['space', 'enter', 'up', 'down'])}
              onHighlightChange={(e, option) => {
                highlightedOption.current = option;
              }}
              options={options}
              clearIcon={null}
              value={getValue()}
              isOptionEqualToValue={option => selectedOptionId === option.id}
              disableCloseOnSelect={false}
              getOptionLabel={option => option.title || option}
              ChipProps={{ clickable: true, onDelete: null }}
              renderOption={(props, option) => (
                <ListItem {...props} onClick={() => handleOptionSelecting(option.id)}>
                  <Typography>{option.title}</Typography>
                </ListItem>
              )}
              renderInput={({ inputProps, ...rest }) => (
                <TextField
                  label={intl.formatMessage({ id: 'sorting.label' })}
                  variant="standard"
                  onClick={() => {
                    setOpenSettings(!openSettings);
                  }}
                  {...rest}
                  inputProps={{
                    ...inputProps,
                    id: 'result-sorter',
                    readOnly: true,
                    sx: { cursor: 'pointer' },
                  }}
                />
              )}
            />
          </div>
        </div>
      </FormControl>
    </form>
  );
};

ResultOrderer.propTypes = {
  initialOrder: PropTypes.oneOf(allowedInitialValues),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  direction: PropTypes.oneOf(allowedDirections).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  order: PropTypes.oneOf(allowedOrders).isRequired,
  setDirection: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

ResultOrderer.defaultProps = {
  initialOrder: null,
  disabled: false,
  userLocation: null,
};

const StyledTune = styled(Tune)(() => ({
  position: 'relative',
  padding: '13px',
}));

const StyledAutocomplete = styled(SMAutocomplete)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: theme.spacing(1),
  paddingTop: 0,
  paddingBottom: 0,
  width: '100%',

  '& .MuiInput-root:before': {
    borderBottom: 'unset',
  },
  '& :hover .MuiInput-root:before': {
    borderBottom: 'unset',
  },
  '&.Mui-focused .MuiInputBase-root': {
    outline: 'none',
    boxShadow: 'none',
  },
}));

export default ResultOrderer;
