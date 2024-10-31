import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography, ButtonBase,
} from '@mui/material';
import { Cancel, Home } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { visuallyHidden } from '@mui/utils';
import styled from '@emotion/styled';
import { setOrder, setDirection } from '../../redux/actions/sort';
import { selectMapRef } from '../../redux/selectors/general';
import { getLocale, selectCustomPosition, selectUserPosition } from '../../redux/selectors/user';
import { keyboardHandler } from '../../utils';
import useMobileStatus from '../../utils/isMobile';
import useLocaleText from '../../utils/useLocaleText';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { getAddressText } from '../../utils/address';
import { focusToPosition } from '../../views/MapView/utils/mapActions';

const AddressSearchBar = ({ title = null, handleAddressChange }) => {
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const isMobile = useMobileStatus();
  const locale = useSelector(getLocale);
  const map = useSelector(selectMapRef);
  const customPosition = useSelector(selectCustomPosition);
  const position = useSelector(selectUserPosition);

  const defaultAddress = position.addressData || customPosition.addressData;

  const [addressResults, setAddressResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cleared, setCleared] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');

  const suggestionCount = 5;
  const inputRef = useRef();

  const fetchAddressResults = async (text) => {
    const smAPI = new ServiceMapAPI();
    const fetchOptions = {
      page_size: suggestionCount,
      type: 'address',
      address_limit: suggestionCount,
      language: locale,
    };
    setIsFetching(true);
    const results = smAPI.search(text, fetchOptions);
    setIsFetching(false);
    return results;
  };

  const handleAddressSelect = (address) => {
    if (!addressResults.length) return;
    if (inputRef.current) {
      inputRef.current.focus();
    }
    inputRef.current.value = getAddressText(address, getLocaleText);
    setAddressResults([]);
    setCurrentLocation(getAddressText(address, getLocaleText));
    dispatch(setDirection('asc'));
    dispatch(setOrder('distance'));
    handleAddressChange(address);
    focusToPosition(map, address.location?.coordinates);
  };

  const handleSearchBarKeyPress = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (resultIndex === null || resultIndex === addressResults.length - 1) {
        setResultIndex(0);
      } else {
        setResultIndex(resultIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (resultIndex === 0) {
        setResultIndex(addressResults.length - 1);
      } else {
        setResultIndex(resultIndex - 1);
      }
    }
  };

  const clearSuggestions = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setAddressResults([]);
    }, 200);
  };

  const handleSubmit = (e) => {
    if (resultIndex !== null) {
      handleAddressSelect(addressResults[resultIndex]);
    } else {
      handleAddressSelect(addressResults[0]);
    }
    clearSuggestions(e);
  };

  useEffect(() => {
    // Reset cleared text
    if (cleared) {
      setCleared(false);
    }
    if (isFetching) {
      return;
    }
    // Fetch address suggestions
    if (debouncedInputValue.length && debouncedInputValue.length > 1) {
      if (currentLocation) {
        setCurrentLocation(null);
      }
      fetchAddressResults(debouncedInputValue)
        .then(data => {
          setAddressResults(data);
        });
    } else if (addressResults.length) {
      setAddressResults([]);
    }
  }, [debouncedInputValue, isFetching]);

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    if (defaultAddress) {
      const addressText = getAddressText(defaultAddress, getLocaleText);
      inputRef.current.value = addressText;
      setCurrentLocation(addressText);
    } else {
      inputRef.current.value = '';
      setCurrentLocation(null);
    }
  }, [defaultAddress]);

  const showSuggestions = inputRef.current?.value.length > 1 && addressResults?.length;
  // Add info text for location selection
  const locationInfoText = currentLocation ? intl.formatMessage({ id: 'address.search.location' }, { location: currentLocation }) : '';
  // Figure out which info text to use
  let infoText = showSuggestions && addressResults.length ? <FormattedMessage id="search.suggestions.suggestions" values={{ count: addressResults.length }} /> : locationInfoText;
  if (cleared) {
    infoText = <FormattedMessage id="address.search.cleared" />;
  } else {
    infoText = (
      <>
        {infoText}
        {
          addressResults.length ? (<FormattedMessage id="address.search.suggestion" />) : null
        }
      </>
    );
  }

  return (
    <StyledContainer>
      <form action="" onSubmit={e => handleSubmit(e)}>
        <label htmlFor="address-search-bar">
          <Typography color="inherit">{title}</Typography>
        </label>
        <StyledFlexContainer>
          <StyledInputBase
            id="address-search-bar"
            data-sm="AddressSearchBar"
            autoComplete="off"
            inputRef={inputRef}
            inputProps={{
              role: 'combobox',
              'aria-haspopup': !!showSuggestions,
              'aria-owns': showSuggestions ? 'address-results' : null,
              'aria-activedescendant': showSuggestions && resultIndex !== null ? `address-suggestion${resultIndex}` : null,
            }}
            type="text"
            onBlur={isMobile ? () => {} : e => clearSuggestions(e)}
            onFocus={() => setResultIndex(null)}
            defaultValue={getAddressText(defaultAddress, getLocaleText)}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
            endAdornment={currentLocation ? (
              <StyledIconButton
                aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                onClick={() => {
                  setCleared(true);
                  setCurrentLocation(null);
                  handleAddressChange(null);
                  inputRef.current.value = '';
                }}
              >
                <StyledClear />
              </StyledIconButton>
            ) : null}
          />
          <StyledSearchButton
          // aria-label={intl.formatMessage({ id: 'search' })}
            onClick={e => handleSubmit(e)}
            variant="contained"
          >
            <Typography>{intl.formatMessage({ id: 'search.addText' })}</Typography>
            <Home />
          </StyledSearchButton>

          <Typography aria-live="polite" id="resultLength" style={visuallyHidden}>{infoText}</Typography>
        </StyledFlexContainer>
        {showSuggestions ? (
          <Paper>
            <List role="listbox" id="address-results">
              {addressResults.map((address, i) => (
                <ListItem
                  tabIndex={-1}
                  id={`address-suggestion${i}`}
                  data-sm="AddressSuggestion"
                  role="option"
                  selected={i === resultIndex}
                  key={getAddressText(address, getLocaleText)}
                  button
                  onClick={() => handleAddressSelect(address)}
                  onKeyDown={keyboardHandler(() => handleAddressSelect(address), ['space', 'enter'])}
                >
                  <Typography>
                    {getAddressText(address, getLocaleText)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : null}
      </form>
    </StyledContainer>
  );
};

const StyledContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  textAlign: 'left',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  flexGrow: 1,
}));

const StyledClear = styled(Cancel)(() => ({
  fontSize: '0.875rem',
}));

const StyledFlexContainer = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  border: '1px solid #ACACAC',
  borderRadius: '4px',
  height: 42,
  boxSizing: 'border-box',
  marginTop: theme.spacing(0.5),
}));

const StyledSearchButton = styled(ButtonBase)(({ theme }) => ({
  height: '100%',
  width: 87,
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderBottomRightRadius: '4px',
  borderTopRightRadius: '4px',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: 'rgb(30, 32, 39)',
    transition: '0.5s',
  },
  '& svg': {
    paddingLeft: theme.spacing(0.5),
    fontSize: 18,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  padding: theme.spacing(1),
}));

AddressSearchBar.propTypes = {
  handleAddressChange: PropTypes.func.isRequired,
  title: PropTypes.objectOf(PropTypes.any),
};

export default AddressSearchBar;
