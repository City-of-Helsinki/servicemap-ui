import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Paper, withStyles, InputBase, Divider, Button,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import SMRadio from '../../../components/SMRadio';
import styles from '../styles';


const customStyles = () => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});

/**
 * CustomInput component
 */
const CustomInput = withStyles(customStyles)(({
  buttonClick, buttonText, classes, disabled, initialValue, onChange, preText,
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
    <Paper className={classes.root} elevation={1}>
      <InputBase
        className={classes.input}
        disabled={disabled}
        value={value}
        onChange={inputOnChange}
      />
      {
        preText && (
          <pre className={classes.iconButton} aria-label="Search">
            {preText}
          </pre>
        )
      }
      {
        buttonClick && buttonText && (
          <>
            <Divider className={classes.divider} />
            <Button
              aria-label="Directions"
              color="primary"
              className={classes.iconButton}
              onClick={(e) => { buttonClick(e, value); }}
              variant="contained"
            >
              {buttonText}
            </Button>
          </>
        )
      }
    </Paper>
  );
});

/**
 * EmbedController that renders radio controls
 */
const EmbedController = ({
  classes,
  titleID,
  description,
  inputButtonOnClick,
  inputButtonText,
  inputDisabled,
  inputOnChange,
  inputPreText,
  inputValue,
  radioAriaLabel,
  radioControls,
  radioName,
  radioOnChange,
  radioValue,
}) => {
  const renderRadio = () => {
    if (radioControls && radioOnChange) {
      return (
        <SMRadio
          aria-label={radioAriaLabel}
          name={radioName}
          initialValue={radioValue}
          controls={radioControls}
          onChange={radioOnChange}
        />
      );
    }
    return null;
  };

  const renderInput = () => {
    if (!inputOnChange && (!inputButtonOnClick || !inputButtonText)) {
      return null;
    }

    return (
      <div>
        <CustomInput
          disabled={inputDisabled}
          initialValue={inputValue}
          buttonClick={inputButtonOnClick}
          preText={inputPreText}
          onChange={inputOnChange}
          buttonText={inputButtonText}
        />

      </div>
    );
  };

  return (
    <Paper className={classes.formContainerPaper}>
      {
        titleID
        && (
          <Typography align="left" variant="h5"><FormattedMessage id={titleID} /></Typography>
        )
      }
      {
        description
        && (
          <Typography align="left">{description}</Typography>
        )
      }
      {
        renderRadio()
      }
      {
        renderInput()
      }
    </Paper>
  );
};

EmbedController.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
    root: PropTypes.string,
    formContainerPaper: PropTypes.string,
    input: PropTypes.string,
    iconButton: PropTypes.string,
  }).isRequired,
  titleID: PropTypes.string.isRequired,
  description: PropTypes.node,
  inputButtonOnClick: PropTypes.func,
  inputButtonText: PropTypes.node,
  inputDisabled: PropTypes.bool,
  inputOnChange: PropTypes.func,
  inputPreText: PropTypes.string,
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radioAriaLabel: PropTypes.string.isRequired,
  radioControls: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  radioName: PropTypes.string,
  radioOnChange: PropTypes.func.isRequired,
  radioValue: PropTypes.string.isRequired,
};

EmbedController.defaultProps = {
  description: null,
  inputButtonOnClick: null,
  inputButtonText: null,
  inputDisabled: null,
  inputOnChange: null,
  inputPreText: null,
  inputValue: null,
  radioName: null,
};

export default withStyles(styles)(EmbedController);
