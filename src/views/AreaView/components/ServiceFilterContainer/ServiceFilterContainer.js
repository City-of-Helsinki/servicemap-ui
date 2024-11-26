import React from 'react';
import { useTheme } from '@mui/styles';
import {
  IconButton, Typography,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import {
  StyledServiceFilterContainer,
  StyledServiceFilterText,
  StyledRowContainer,
  StyledServiceFilter,
  StyledServiceFilterButton,
} from '../styled/styled';
import { createServiceFilterStyles } from '../../serviceFilterStyles';

const ServiceFilterContainer = ({
  title,
  inputRef,
  keyboardHandler,
  handlefilterButtonClick,
  filterValue,
  setFilterValue,
  formatMessage,
}) => {
  const theme = useTheme();
  const {
    serviceFilterInputClass,
    serviceFilterButtonLabelClass,
    serviceFilterButtonFocusClass,
  } = createServiceFilterStyles(theme);

  return (
    <StyledServiceFilterContainer>
      {typeof title === 'string' && (
        <StyledServiceFilterText id="ServiceListTitle" variant="body2">
          {title}
        </StyledServiceFilterText>
      )}
      <StyledRowContainer>
        <StyledServiceFilter
          inputRef={inputRef}
          inputProps={{
            className: serviceFilterInputClass,
            'aria-labelledby': 'ServiceListTitle',
          }}
          type="text"
          onKeyPress={keyboardHandler(() => handlefilterButtonClick(), ['enter'])}
          endAdornment={
            filterValue ? (
              <IconButton
                aria-label={formatMessage({ id: 'search.cancelText' })}
                onClick={() => {
                  inputRef.current.value = '';
                  setFilterValue('');
                }}
              >
                <Clear />
              </IconButton>
            ) : null
          }
        />
        <StyledServiceFilterButton
          id="ServiceListFilterButton"
          aria-label={formatMessage({ id: 'area.statisticalDistrict.service.filter.button.aria' })}
          disableRipple
          disableFocusRipple
          classes={{
            label: serviceFilterButtonLabelClass,
            focusVisible: serviceFilterButtonFocusClass,
          }}
          onClick={handlefilterButtonClick}
          color="secondary"
          variant="contained"
        >
          <Typography variant="caption" color="inherit">
            <FormattedMessage id="area.statisticalDistrict.service.filter.button" />
          </Typography>
        </StyledServiceFilterButton>
      </StyledRowContainer>
    </StyledServiceFilterContainer>
  );
};

export default ServiceFilterContainer;
