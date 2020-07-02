import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography, Divider,
} from '@material-ui/core';
import { Clear, Search } from '@material-ui/icons';
import config from '../../../config';
import { uppercaseFirst } from '../../utils';

const AddressSearchBar = ({
  defaultAddress,
  handleAddressChange,
  title,
  locale,
  containerClassName,
  inputClassName,
  getLocaleText,
  classes,
  intl,
}) => {
  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

  const [addressResults, setAddressResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [searchBarValue, setSearchBarValue] = useState(formAddressString(defaultAddress));

  const suggestionCount = 5;

  const handleAddressSelect = (address) => {
    setSearchBarValue(formAddressString(address));
    setAddressResults([]);
    handleAddressChange(address);
  };

  const handleSearchBarKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddressSelect(addressResults[resultIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (resultIndex === addressResults.length - 1) {
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

  const handleInputChange = (text) => {
    setSearchBarValue(text);
    // Fetch address suggestions
    if (text.length && text.length > 1) {
      fetch(`${config.serviceMapAPI.root}/search/?input=${text}&language=${locale}&page=1&page_size=${suggestionCount}&type=address`)
        .then(res => res.json())
        .then(data => setAddressResults(data.results))
        .catch((res) => {
          console.warn('error:', res);
        });
    }
  };

  useEffect(() => {
    setSearchBarValue(formAddressString(defaultAddress));
  }, [defaultAddress]);

  // change searchbar value if resultIndex changes to
  useEffect(() => {
    const address = addressResults && addressResults[resultIndex];
    if (address) {
      setSearchBarValue(formAddressString(address));
    }
  }, [resultIndex]);

  const showSuggestions = searchBarValue.length > 1 && addressResults && addressResults.length;
  return (
    <div className={containerClassName}>
      <Typography color="inherit">{title}</Typography>
      <InputBase
        inputProps={{
          role: 'combobox',
          'aria-haspopup': !!showSuggestions,
          'aria-label': `${intl.formatMessage({ id: 'search.searchField' })} ${intl.formatMessage({ id: 'address.search' })}`,
        }}
        type="search"
        className={`${classes.searchBar} ${inputClassName}`}
        value={searchBarValue}
        onChange={e => handleInputChange(e.target.value)}
        onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
        endAdornment={(
          <>
            <Search aria-hidden className={classes.searchIcon} />
            <Divider aria-hidden className={classes.divider} />
            <IconButton
              aria-label={intl.formatMessage({ id: 'search.cancelText' })}
              onClick={() => {
                handleAddressChange(null);
                setSearchBarValue('');
              }}
              className={classes.IconButton}
            >
              <Clear className={classes.clearButton} />
            </IconButton>
          </>
        )}
      />
      <Typography aria-live="polite" id="resultLength" variant="srOnly"><FormattedMessage id="search.suggestions.suggestions" values={{ count: addressResults.length }} /></Typography>
      {showSuggestions ? (
        <Paper>
          <List>
            {addressResults.map((address, i) => (
              <ListItem
                selected={i === resultIndex}
                key={formAddressString(address)}
                button
                onClick={() => handleAddressSelect(address)}
              >
                <Typography>
                  {formAddressString(address)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}
    </div>
  );
};

AddressSearchBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  defaultAddress: PropTypes.objectOf(PropTypes.any),
  handleAddressChange: PropTypes.func.isRequired,
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
