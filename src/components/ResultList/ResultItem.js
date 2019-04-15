/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, withStyles, Divider,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

const styles = theme => ({
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  title: {
    textOverflow: 'ellipsis',
    margin: 0,
  },
  secondaryContent: {
    marginRight: 8,
    textAlign: 'right',
  },
  noMargin: {
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
  data, classes, onClick, icon, intl, listId,
}) => {
  const {
    id, name, object_type, street,
  } = data;

  // Accessibility text
  // TODO: Change to check data once accessibility messages functionality has been added
  // TODO: Change texts to use translations once data is accessible
  const accessibilityProblems = null;
  let accessText = intl.formatMessage({ id: 'unit.accessibility.noInfo' });
  if (accessibilityProblems !== null && typeof accessibilityProblems !== 'undefined') {
    switch (accessibilityProblems) {
      case 0:
        accessText = intl.formatMessage({ id: 'unit.accessibility.ok' });
        break;
      default:
        accessText = intl.formatMessage({ id: 'unit.accessibility.problems' }, { count: accessibilityProblems });
    }
  }

  // Distance text
  // TODO: Change to check data for distance once location info is available
  const distance = null; // '100';

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
              className={classes.title}
              component="h3"
              variant="subtitle1"
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
                  <Typography
                    variant="caption"
                    className={`${classes.smallFont} ${classes.marginLeft}`}
                    component="p"
                    aria-hidden="true"
                  >
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
                variant="caption"
                className={`${classes.noMargin} ${classes.smallFont}`}
                component="p"
                aria-hidden="true"
              >
                <FormattedMessage id={object_type} />
              </Typography>
            </div>

            {
              accessText
              && (
              <div className={`${classes.rightColumn} ${classes.bottomColumn}`}>
                <Typography
                  id={`${listId}-result-item-accessibility-${id}`}
                  className={`${classes.smallFont} ${classes.marginLeft}`}
                  component="p"
                  variant="caption"
                  aria-hidden="true"
                >
                  {accessText}
                </Typography>
              </div>
              )
            }

          </div>
        </div>
      </ListItem>
      <li>
        <Divider aria-hidden="true" variant={icon && 'inset'} />
      </li>
    </>
  );
};

export default injectIntl(withStyles(styles)(ResultItem));

// Typechecking
ResultItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  listId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  intl: intlShape.isRequired,
};

ResultItem.defaultProps = {
  classes: {},
  data: {},
  icon: null,
  onClick: () => {},
};
