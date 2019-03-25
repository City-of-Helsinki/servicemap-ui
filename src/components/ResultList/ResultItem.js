/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, ListItemText, Typography, ListItemSecondaryAction, withStyles, Divider,
} from '@material-ui/core';
import { uppercaseFirst } from '../../utils';

const styles = {
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  title: {
    textOverflow: 'ellipsis',
    fontSize: 18,
    margin: 0,
  },
  secondaryContent: {
    marginRight: 8,
    textAlign: 'right',
  },
  subtitle: {
    margin: 0,
  },
  smallFont: {
    fontSize: 14,
    margin: 0,
  },
};

const ResultItem = ({
  data, classes, onClick, icon,
}) => {
  const { name, contract_type } = data;

  // Accessibility text
  // TODO: Change to check data once accessibility messages functionality has been added
  // TODO: Change texts to use translations once data is accessible
  const accessibilityProblems = null;
  let accessText = 'Ei esteettömyystietoja';
  if (accessibilityProblems !== null && typeof accessibilityProblems !== 'undefined') {
    switch (accessibilityProblems) {
      case 0:
        accessText = 'Esteetön';
        break;
      default:
        accessText = `${accessibilityProblems} esteettömyyspuutteita`;
    }
  }

  // Distance text
  // TODO: Change to check data for distance once location info is available
  const distance = '100m';

  return (
    <>
      <ListItem
        button
        component="a"
        onClick={onClick}
        classes={{
          focusVisible: classes.cssFocused,
        }}
      >
        {
          icon
          && (
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          )
        }
        <ListItemText>
          <Typography variant="h4" className={classes.title}>{name && name.fi}</Typography>
          <Typography variant="body2" className={[classes.subtitle, classes.smallFont]}>{contract_type && contract_type.description && uppercaseFirst(contract_type.description.fi)}</Typography>
        </ListItemText>
        <ListItemSecondaryAction className={classes.secondaryContent}>
          {
            distance
            && <Typography variant="body2" className={classes.smallFont}>{distance}</Typography>
          }
          <Typography variant="body2" className={classes.smallFont}>{accessText}</Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <li>
        <Divider variant={icon && 'inset'} />
      </li>
    </>
  );
};

export default withStyles(styles)(ResultItem);

// Typechecking
ResultItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  onClick: PropTypes.func,
};

ResultItem.defaultProps = {
  classes: {},
  data: {},
  icon: null,
  onClick: () => {},
};
