import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Paper,
  withStyles,
  InputBase,
  Divider,
  Button,
  List,
  FormGroup,
  FormControlLabel,
  ListItem,
  Checkbox,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import SMRadio from '../../../components/SMRadio';
import styles from '../styles';


const customStyles = () => ({
  root: {
    padding: '2px 4px',
    display: 'inline-flex',
    alignItems: 'center',
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
  ariaLabel, buttonClick, buttonText, classes, disabled, initialValue, onChange, preText,
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
        inputProps={{
          'aria-label': ariaLabel,
        }}
        onChange={inputOnChange}
        value={value}
      />
      {
        preText && (
          <pre className={classes.iconButton} aria-hidden>
            {preText}
          </pre>
        )
      }
      {
        buttonClick && buttonText && (
          <>
            <Divider className={classes.divider} />
            <Button
              aria-label={buttonText}
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
  titleComponent,
  titleID,
  description,
  checkboxControls,
  checkboxLabelledBy,
  inputAriaLabel,
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
  const renderCheckboxes = () => {
    if (!checkboxControls || !checkboxLabelledBy) {
      return null;
    }
    return (
      <>
        <FormGroup row role="group" aria-labelledby={checkboxLabelledBy}>
          <List className={classes.list}>
            {
              checkboxControls.map(item => (
                <ListItem className={classes.checkbox} key={item.key}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        color="primary"
                        checked={!!item.value}
                        value={item.key}
                        onChange={() => item.onChange(!item.value)}
                      />
                    )}
                    label={(
                      <>
                        {item.icon}
                        {
                          item.labelId
                            ? (
                              <FormattedMessage id={item.labelId} />
                            )
                            : item.label
                        }
                      </>
                    )}
                  />
                </ListItem>
              ))
            }
          </List>
        </FormGroup>
      </>
    );
  };

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
          ariaLabel={inputAriaLabel}
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
          <Typography
            id={titleID}
            align="left"
            variant="h5"
            component={titleComponent}
          >
            <FormattedMessage id={titleID} />
          </Typography>
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
      {
        renderCheckboxes()
      }
    </Paper>
  );
};

EmbedController.propTypes = {
  classes: PropTypes.shape({
    checkbox: PropTypes.string,
    divider: PropTypes.string,
    root: PropTypes.string,
    formContainerPaper: PropTypes.string,
    input: PropTypes.string,
    iconButton: PropTypes.string,
    list: PropTypes.string,
  }).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  titleID: PropTypes.string.isRequired,
  description: PropTypes.node,
  checkboxControls: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    icon: PropTypes.node,
    labelId: PropTypes.string,
    label: PropTypes.string,
  })),
  checkboxLabelledBy: PropTypes.string,
  inputAriaLabel: PropTypes.string,
  inputButtonOnClick: PropTypes.func,
  inputButtonText: PropTypes.node,
  inputDisabled: PropTypes.bool,
  inputOnChange: PropTypes.func,
  inputPreText: PropTypes.string,
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radioAriaLabel: PropTypes.string,
  radioControls: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  radioName: PropTypes.string,
  radioOnChange: PropTypes.func,
  radioValue: PropTypes.string,
};

EmbedController.defaultProps = {
  checkboxControls: null,
  checkboxLabelledBy: null,
  description: null,
  inputAriaLabel: null,
  inputButtonOnClick: null,
  inputButtonText: null,
  inputDisabled: null,
  inputOnChange: null,
  inputPreText: null,
  inputValue: null,
  radioAriaLabel: null,
  radioControls: null,
  radioOnChange: null,
  radioName: null,
  radioValue: null,
};

export default withStyles(styles)(EmbedController);
