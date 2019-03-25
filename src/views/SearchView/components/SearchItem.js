/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, ListItemText, Typography, ListItemSecondaryAction, withStyles,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { uppercaseFirst } from '../../../utils';
import styles from '../styles';

const SearchItem = ({ onClick, data, classes }) => {
  const { name, contract_type } = data;

  const secondaryText = false;
  return (
    <ListItem
      button
      className={classes.borderBottom}
      component="a"
      onClick={onClick}
      classes={{
        focusVisible: classes.cssFocused,
      }}
    >
      <ListItemIcon>
        <Search />
      </ListItemIcon>
      <ListItemText>
        <Typography variant="h4" style={{ fontSize: '1.25rem', margin: 0 }}>{name && name.fi}</Typography>
        <Typography variant="body2" style={{ fontSize: '1rem', margin: 0 }}>{contract_type && contract_type.description && uppercaseFirst(contract_type.description.fi)}</Typography>
      </ListItemText>
      {
        secondaryText
        && (
        <ListItemSecondaryAction style={{ marginRight: 8 }}>
          <Typography variant="body2" style={{ fontSize: '1rem', margin: 0 }}>100m</Typography>
        </ListItemSecondaryAction>
        )
      }
    </ListItem>
  );
};

export default withStyles(styles)(SearchItem);

// Typechecking
SearchItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
};

SearchItem.defaultProps = {
  classes: {},
  data: {},
  onClick: () => {},
};
