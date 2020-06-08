import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import {
  InputBase, IconButton, Paper, List, ListItem, Typography,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import config from '../../../../../config';

const AddressSearchBar = ({
  defaultValue, setSelectedAddress, formAddressString, locale, classes, intl,
}) => {
  const [addressResults, setAddressResults] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);
  const [searchBarValue, setSearchBarValue] = useState(defaultValue);

  const suggestionCount = 5;

  const handleAddressSelect = (address) => {
    setSearchBarValue(formAddressString(address));
    setAddressResults([]);
    setSelectedAddress(address);
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

  const showSuggestions = searchBarValue.length > 1 && addressResults && addressResults.length;
  return (
    <>
      <InputBase
        inputProps={{
          role: 'combobox',
          'aria-haspopup': !!showSuggestions,
          'aria-label': intl.formatMessage({ id: 'search.searchField' }),
        }}
        type="search"
        className={classes.searchBar}
        value={searchBarValue}
        classes={{ focused: classes.fieldFocus }}
        onChange={e => handleInputChange(e.target.value)}
        onKeyDown={e => showSuggestions && handleSearchBarKeyPress(e)}
        endAdornment={(
          searchBarValue.length ? (
            <IconButton
              aria-label={intl.formatMessage({ id: 'search.cancelText' })}
              onClick={() => {
                setSelectedAddress(null);
                setSearchBarValue('');
              }}
            >
              <Cancel className={classes.cancelButton} />
            </IconButton>
          ) : null
        )}
      />
      {showSuggestions ? (
        <Paper>
          <Typography aria-live="polite" id="resultLength" variant="srOnly"><FormattedMessage id="search.infoText" values={{ count: addressResults.length }} /></Typography>
          <List>
            {addressResults.map((address, i) => (
              <ListItem
                selected={i === resultIndex}
                key={formAddressString(address)}
                button
                onClick={() => handleAddressSelect(address)}
              >
                {formAddressString(address)}
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}
    </>
  );
};

AddressSearchBar.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  defaultValue: PropTypes.string.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  formAddressString: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

AddressSearchBar.defaultProps = {
};

export default AddressSearchBar;
