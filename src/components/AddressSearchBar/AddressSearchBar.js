import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography, Divider,
} from '@material-ui/core';
import { Clear, Search } from '@material-ui/icons';
import config from '../../../config';
import { keyboardHandler, uppercaseFirst } from '../../utils';
import useMobileStatus from '../../utils/isMobile';

const AddressSearchBar = ({
  defaultAddress,
  handleAddressChange,
  title,
  locale,
  containerClassName,
  inputClassName,
  setOrder,
  setDirection,
  getLocaleText,
  classes,
  intl,
}) => {
  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

  const isMobile = useMobileStatus();

  const [addressResults, setAddressResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cleared, setCleared] = useState(false);

  const suggestionCount = 5;
  const inputRef = useRef();

  const handleAddressSelect = (address) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    inputRef.current.value = formAddressString(address);
    setAddressResults([]);
    setCurrentLocation(formAddressString(address));
    setDirection('asc');
    setOrder('distance');
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
    setAddressResults([]);
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
      fetch(`${config.serviceMapAPI.root}/search/?input=${text}&language=${locale}&page=1&page_size=${suggestionCount}&type=address`)
        .then(res => res.json())
        .then(data => setAddressResults(data.results))
        .catch((res) => {
          console.warn('error:', res);
        });
    }
  };

  useEffect(() => {
    inputRef.current.value = formAddressString(defaultAddress);
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
        <InputBase
          inputRef={inputRef}
          inputProps={{
            role: 'combobox',
            'aria-haspopup': !!showSuggestions,
            'aria-label': `${intl.formatMessage({ id: 'search.searchField' })} ${intl.formatMessage({ id: 'address.search' })}`,
            'aria-owns': showSuggestions ? 'address-results' : null,
            'aria-activedescendant': showSuggestions ? `address-suggestion${resultIndex}` : null,
          }}
          type="text"
          onBlur={isMobile ? () => {} : e => clearSuggestions(e)}
          onFocus={() => setResultIndex(null)}
          className={`${classes.searchBar} ${inputClassName}`}
          defaultValue={formAddressString(defaultAddress)}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
          endAdornment={(
            <>
              <Search aria-hidden className={classes.searchIcon} />
              <Divider aria-hidden className={classes.divider} />
              <IconButton
                aria-label={intl.formatMessage({ id: 'search.cancelText' })}
                onClick={() => {
                  setCleared(true);
                  handleAddressChange(null);
                  inputRef.current.value = '';
                }}
                className={classes.IconButton}
              >
                <Clear className={classes.clearButton} />
              </IconButton>
            </>
          )}
        />
        <Typography aria-live="polite" id="resultLength" variant="srOnly">{infoText}</Typography>
        {showSuggestions ? (
          <Paper>
            <List role="listbox" id="address-results">
              {addressResults.map((address, i) => (
                <ListItem
                  id={`address-suggestion${i}`}
                  role="option"
                  selected={i === resultIndex}
                  key={formAddressString(address)}
                  button
                  onClick={() => handleAddressSelect(address)}
                  onKeyDown={keyboardHandler(() => handleAddressSelect(address), ['space', 'enter'])}
                >
                  <Typography>
                    {formAddressString(address)}
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

AddressSearchBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  defaultAddress: PropTypes.objectOf(PropTypes.any),
  handleAddressChange: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  setDirection: PropTypes.func.isRequired,
  title: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  getLocaleText: PropTypes.func.isRequired,
};

AddressSearchBar.defaultProps = {
  containerClassName: '',
  inputClassName: '',
  defaultAddress: null,
  title: null,
};

export default AddressSearchBar;
