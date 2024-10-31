import styled from '@emotion/styled';
import {
  Button, Divider, InputBase, Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

/**
 * CustomInput component
 */
const CustomInput = ({
  ariaLabel, buttonClick, buttonText, disabled, initialValue, onChange, preText,
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const inputOnChange = (e) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e, e.target.value);
    }
  };

  return (
    <StyledPaper elevation={1}>
      <StyledInput
        disabled={disabled}
        inputProps={{
          'aria-label': ariaLabel,
        }}
        onChange={inputOnChange}
        value={value}
      />
      {
        preText && (
          <StyledPreIconButton aria-hidden>
            {preText}
          </StyledPreIconButton>
        )
      }
      {
        buttonClick && buttonText && (
          <>
            <StyledDivider />
            <StyledIconButton
              aria-label={buttonText}
              color="primary"
              onClick={(e) => { buttonClick(e, value); }}
              variant="contained"
            >
              {buttonText}
            </StyledIconButton>
          </>
        )
      }
    </StyledPaper>
  );
};

CustomInput.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  initialValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  buttonClick: PropTypes.func,
  preText: PropTypes.string,
  onChange: PropTypes.func,
  buttonText: PropTypes.node,
};

CustomInput.defaultProps = {
  ariaLabel: null,
  disabled: null,
  initialValue: null,
  buttonClick: null,
  preText: null,
  onChange: null,
  buttonText: null,
};

const StyledPaper = styled(Paper)(() => ({
  padding: '2px 4px',
  display: 'inline-flex',
  alignItems: 'center',
}));
const StyledInput = styled(InputBase)(() => ({
  marginLeft: 8,
  flex: 1,
}));
const StyledPreIconButton = styled('pre')(() => ({
  padding: 10,
}));
const StyledIconButton = styled(Button)(() => ({
  padding: 10,
}));
const StyledDivider = styled(Divider)(() => ({
  width: 1,
  height: 28,
  margin: 4,
}));

export default CustomInput;
