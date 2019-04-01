/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, withStyles, Divider,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

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
  data, classes, onClick, icon, listId,
}) => {
  const {
    id, name, object_type, street,
  } = data;

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
  const distance = '100';

  return (
    <>
      <ListItem
        button
        role="link"
        component="a"
        tabIndex={0}
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
            <Typography
              id={`${listId}-result-item-title-${id}`}
              variant="h4"
              className={classes.title}
              aria-labelledby={`${listId}-result-item-title-${id} ${listId}-result-item-type-${id} ${listId}-result-item-distance-${id} ${listId}-result-item-accessibility-${id}`}
            >
              {
                object_type === 'address'
                && street.name.fi
              }
              {
                object_type !== 'address'
                && name
                && name.fi
              }
              {}
            </Typography>

            {
              distance
              && (
                <div className={classes.rightColumn}>
                  <Typography variant="body2" className={`${classes.smallFont} ${classes.marginLeft}`} aria-hidden="true">
                    {distance}
                    m
                    <span id={`${listId}-result-item-distance-${id}`} className="sr-only" aria-hidden="true">{`${distance} metrin päässä`}</span>
                  </Typography>
                </div>
              )
            }

          </div>
          <div className={classes.bottomRow}>

            <div className={classes.bottomColumn}>
              <Typography
                id={`${listId}-result-item-type-${id}`}
                variant="h4"
                className={`${classes.subtitle} ${classes.smallFont}`}
                aria-hidden="true"
              >
                <FormattedMessage id={object_type} />
              </Typography>
            </div>

            <div className={`${classes.rightColumn} ${classes.bottomColumn}`}>
              <Typography
                id={`${listId}-result-item-accessibility-${id}`}
                variant="body2"
                className={`${classes.smallFont} ${classes.marginLeft}`}
                aria-hidden="true"
              >
                {accessText}
              </Typography>
            </div>

          </div>
        </div>
      </ListItem>
      <li>
        <Divider aria-hidden="true" variant={icon && 'inset'} />
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
  listId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

ResultItem.defaultProps = {
  classes: {},
  data: {},
  icon: null,
  onClick: () => {},
};
