import React from 'react';
import PropTypes from 'prop-types';
import {
  List, ListItem, Typography, InputBase, IconButton, Paper,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Cancel } from '@material-ui/icons';

const renderAreaTab = ({ classes }) => (
  <>
    <List>
      {data.map(item => renderCategoryItem(item))}
    </List>

    <div className={classes.addressArea}>
      <Typography className={classes.addressTitle}><FormattedMessage id="area.searchbar.infoText.address" /></Typography>
      <InputBase
        className={classes.searchBar}
        value={searchBarValue}
        onChange={e => handleInputChange(e.target.value)}
        endAdornment={(
          <IconButton
            onClick={() => {
              setSelectedAddress(null);
              setSearchBarValue('');
            }}
          >
            <Cancel className={classes.cancelButton} />
          </IconButton>
        )}
      />
      {searchBarValue.length > 1 && addressResults && addressResults.length ? (
        <Paper>
          <List>
            {addressResults && addressResults.map(address => (
              <ListItem
                key={`${address.street.name.fi} ${address.number} ${address.number_end} ${address.letter}`}
                button
                onClick={(e) => {
                  setSearchBarValue(e.target.innerHTML);
                  setAddressResults([]);
                  setSelectedAddress(address);
                }}
              >
                {`${address.street.name.fi} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}`}
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}
    </div>
  </>
);

export default renderAreaTab;
