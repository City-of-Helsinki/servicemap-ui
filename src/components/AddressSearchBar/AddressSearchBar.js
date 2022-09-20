import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography, Divider,
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { setOrder, setDirection } from '../../redux/actions/sort';
import { keyboardHandler } from '../../utils';
import useMobileStatus from '../../utils/isMobile';
import useLocaleText from '../../utils/useLocaleText';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { getAddressText } from '../../utils/address';

const AddressSearchBar = ({
  defaultAddress,
  handleAddressChange,
  title,
  containerClassName,
  inputClassName,
  intl,
}) => {
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const locale = useSelector(state => state.user.locale);

  const isMobile = useMobileStatus();

  const [addressResults, setAddressResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cleared, setCleared] = useState(false);

  const suggestionCount = 5;
  const inputRef = useRef();

  const fetchAddressResults = (text) => {
    const smAPI = new ServiceMapAPI();
    const fetchOptions = {
      page_size: suggestionCount,
      type: 'address',
      address_limit: suggestionCount,
    };
    return smAPI.search(text, fetchOptions);
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

  const handleInputChange = (text) => {
    // Reset cleared text
    if (cleared) {
      setCleared(false);
    }
    // Fetch address suggestions
    if (text.length && text.length > 1) {
      if (currentLocation) {
        setCurrentLocation(null);
      }
      fetchAddressResults(text)
        .then(data => setAddressResults(data));
    }
  };

  useEffect(() => {
    inputRef.current.value = getAddressText(defaultAddress, getLocaleText);
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
    <div className={containerClassName}>
      <Typography color="inherit">{title}</Typography>
      <form action="" onSubmit={e => handleSubmit(e)}>
        <StyledInputBase
          id="addressSearchbar"
          autoComplete="off"
          inputRef={inputRef}
          inputProps={{
            role: 'combobox',
            'aria-haspopup': !!showSuggestions,
            'aria-label': `${intl.formatMessage({ id: 'search.searchField' })} ${intl.formatMessage({ id: 'address.search' })}`,
            'aria-owns': showSuggestions ? 'address-results' : null,
            'aria-activedescendant': showSuggestions && resultIndex !== null ? `address-suggestion${resultIndex}` : null,
          }}
          type="text"
          onBlur={isMobile ? () => {} : e => clearSuggestions(e)}
          onFocus={() => setResultIndex(null)}
          className={inputClassName}
          defaultValue={getAddressText(defaultAddress, getLocaleText)}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
          endAdornment={(
            <>
              <StyledSearch aria-hidden />
              <StyledDivider aria-hidden />
              <StyledIconButton
                aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                onClick={() => {
                  setCleared(true);
                  handleAddressChange(null);
                  inputRef.current.value = '';
                }}
              >
                <StyledClear />
              </StyledIconButton>
            </>
          )}
        />
        <Typography aria-live="polite" id="resultLength" style={visuallyHidden}>{infoText}</Typography>
        {showSuggestions ? (
          <Paper>
            <List role="listbox" id="address-results">
              {addressResults.map((address, i) => (
                <ListItem
                  tabIndex={-1}
                  id={`address-suggestion${i}`}
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
    </div>
  );
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  marginTop: theme.spacing(1),
  border: '1px solid #ACACAC',
  borderRadius: 4,
  width: '100%',
  height: '80%',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
}));

const StyledClear = styled(Clear)(() => ({
  fontSize: '1.375rem',
}));

const StyledSearch = styled(Search)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.54)',
  fontSize: '1.375rem',
  padding: theme.spacing(1),
}));

const StyledDivider = styled(Divider)(() => ({
  width: 1,
  height: 24,
  margin: 4,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  margiRight: theme.spacing(0.5),
  padding: theme.spacing(1),
}));

AddressSearchBar.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  defaultAddress: PropTypes.objectOf(PropTypes.any),
  handleAddressChange: PropTypes.func.isRequired,
  title: PropTypes.objectOf(PropTypes.any),
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};

AddressSearchBar.defaultProps = {
  containerClassName: '',
  inputClassName: '',
  defaultAddress: null,
  title: null,
};

export default AddressSearchBar;
