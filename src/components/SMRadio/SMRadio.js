import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material';

const SMRadio = ({
  controls, initialValue = null, name, label = null, onChange, ...rest
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <FormControl component="fieldset">
      {
        label
        && (
          <FormLabel component="legend">{label}</FormLabel>
        )
      }
      <RadioGroup
        name={name}
        value={value}
        onChange={(event, value) => {
          setValue(value);
          if (onChange) {
            onChange(event, value);
          }
        }}
        {...rest}
      >
        {
          controls.map(control => (
            <FormControlLabel
              control={<Radio />}
              disabled={!!control.disabled}
              key={control.value}
              value={control.value}
              label={control.label}
            />

          ))
        }
      </RadioGroup>
    </FormControl>
  );
};

SMRadio.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  controls: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  initialValue: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SMRadio;
