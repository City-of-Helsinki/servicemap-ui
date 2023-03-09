/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Autocomplete, FormControl, ListItem, TextField, Typography,
} from '@mui/material';
import { Tune } from '@mui/icons-material';
import { styled } from '@mui/styles';
import { useAcccessibilitySettings } from '../../utils/settings';

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
  const [openSettings, setOpenSettings] = useState(null);
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

  let selectedOptionId = `${order}-${direction}`;
  const handleOptionSelecting = (optionId) => {
    selectedOptionId = optionId;
    const array = optionId.split('-');
    const direction = array[1];
    const order = array[0];

    if (isValidDirection(direction) && isValidOrder(order)) {
      setDirection(direction);
      setOrder(order);
    }
    setOpenSettings(false);
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
                  onClick={() => setOpenSettings(!openSettings)}
                  {...rest}
                  inputProps={{
                    ...inputProps,
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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingLeft: 0,
  paddingRight: theme.spacing(1),
  paddingTop: 0,
  paddingBottom: 0,
  width: '100%',

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
  '& .MuiInput-root:before': {
    borderBottom: 'unset',
  },
  '& :hover .MuiInput-root:before': {
    borderBottom: 'unset',
  },
}));

export default ResultOrderer;
