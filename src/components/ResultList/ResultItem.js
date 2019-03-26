/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, ListItemText, Typography, ListItemSecondaryAction, withStyles, Divider,
} from '@material-ui/core';
import { uppercaseFirst } from '../../utils';

const styles = theme => ({
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
  itemTextContainer: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  topRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  marginLeft: {
    marginLeft: theme.spacing.unit,
  },
  rightColumn: {
    textAlign: 'right',
  },
  bottomColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});

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
        <div className={classes.itemTextContainer}>
          <div className={classes.topRow}>
            <Typography variant="h4" className={classes.title}>{name && name.fi}</Typography>
            {
              distance
              && (
                <div className={classes.rightColumn}>
                  <Typography variant="body2" className={`${classes.smallFont} ${classes.marginLeft}`}>{distance}</Typography>
                </div>
              )
            }
          </div>
          <div className={classes.bottomRow}>
            <Typography variant="body2" className={`${classes.subtitle} ${classes.smallFont}`}>
              {contract_type && contract_type.description && uppercaseFirst(contract_type.description.fi)}
            </Typography>
            <div className={`${classes.rightColumn} ${classes.bottomColumn}`}>
              <Typography variant="body2" className={`${classes.smallFont} ${classes.marginLeft}`}>{accessText}</Typography>

            </div>
          </div>
        </div>
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
