import styled from '@emotion/styled';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SMRadio } from '../../../components';
import CustomInput from './CustomInput';

/**
 * EmbedController that renders radio controls
 */
function EmbedController({
  titleComponent,
  titleID,
  description = null,
  checkboxControls = null,
  checkboxLabelledBy = null,
  inputAriaLabel = null,
  inputButtonOnClick = null,
  inputButtonText = null,
  inputDisabled = null,
  inputOnChange = null,
  inputPreText = null,
  inputValue = null,
  radioAriaLabel = null,
  radioControls = null,
  radioName = null,
  radioOnChange = null,
  radioValue = null,
}) {
  const renderCheckboxes = () => {
    if (!checkboxControls || !checkboxLabelledBy) {
      return null;
    }
    return (
      <FormGroup row role="group" aria-labelledby={checkboxLabelledBy}>
        <List>
          {checkboxControls.map((item) => (
            <StyledListItem key={item.key}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={!!item.value}
                    value={item.key}
                    onChange={() => item.onChange(!item.value)}
                  />
                }
                label={
                  <>
                    {item.icon}
                    {item.labelId ? (
                      <FormattedMessage id={item.labelId} />
                    ) : (
                      item.label
                    )}
                  </>
                }
              />
            </StyledListItem>
          ))}
        </List>
      </FormGroup>
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
    <StyledPaper>
      {titleID && (
        <Typography
          id={titleID}
          align="left"
          variant="h5"
          component={titleComponent}
        >
          <FormattedMessage id={titleID} />
        </Typography>
      )}
      {description && <Typography align="left">{description}</Typography>}
      {renderRadio()}
      {renderInput()}
      {renderCheckboxes()}
    </StyledPaper>
  );
}

const StyledListItem = styled(ListItem)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
}));
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  display: 'inline-block',
  margin: `${theme.spacing(3)} 0`,
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  textAlign: 'left',
  '& label': {
    margin: `${theme.spacing(1)} 0`,
  },
  '& fieldset': {
    margin: '0 -12px',
  },
}));

EmbedController.propTypes = {
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    .isRequired,
  titleID: PropTypes.string.isRequired,
  description: PropTypes.node,
  checkboxControls: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
      onChange: PropTypes.func.isRequired,
      icon: PropTypes.node,
      labelId: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  checkboxLabelledBy: PropTypes.string,
  inputAriaLabel: PropTypes.string,
  inputButtonOnClick: PropTypes.func,
  inputButtonText: PropTypes.node,
  inputDisabled: PropTypes.bool,
  inputOnChange: PropTypes.func,
  inputPreText: PropTypes.string,
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radioAriaLabel: PropTypes.string,
  radioControls: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  radioName: PropTypes.string,
  radioOnChange: PropTypes.func,
  radioValue: PropTypes.string,
};

export default EmbedController;
