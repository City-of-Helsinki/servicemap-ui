import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography, Divider,
} from '@material-ui/core';
import { Clear, Search } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setOrder, setDirection } from '../../redux/actions/sort';
import config from '../../../config';
import { keyboardHandler, uppercaseFirst } from '../../utils';
import useLocaleText from '../../utils/useLocaleText';

const AddressSearchBar = ({
  defaultAddress,
  handleAddressChange,
  title,
  containerClassName,
  inputClassName,
  classes,
  intl,
}) => {
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const locale = useSelector(state => state.user.locale);

  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

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

  const handleBlur = () => {
    setTimeout(() => {
      const focused = document.activeElement.parentElement.parentElement;
      if (focused.id !== 'addressSearchbarWrapper') {
        setAddressResults([]);
      }
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addressResults.length) return;
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
    <div onBlur={e => handleBlur(e)} className={containerClassName}>
      <Typography color="inherit">{title}</Typography>
      <form id="addressSearchbarWrapper" action="" onSubmit={e => handleSubmit(e)}>
        <InputBase
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
          onFocus={() => setResultIndex(null)}
          className={`${classes.searchBar} ${inputClassName}`}
          defaultValue={formAddressString(defaultAddress)}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
          endAdornment={(
            <>
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
              <Divider aria-hidden className={classes.divider} />
              <IconButton
                aria-label={intl.formatMessage({ id: 'general.search' })}
                onClick={e => handleSubmit(e)}
                className={classes.IconButton}
              >
                <Search aria-hidden className={classes.searchIcon} />
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
                  tabIndex="-1"
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
