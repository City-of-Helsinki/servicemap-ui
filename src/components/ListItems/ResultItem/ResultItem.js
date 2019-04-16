/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, withStyles, Divider,
} from '@material-ui/core';

const styles = theme => ({
  cssFocused: {
    outlineStyle: 'solid',
    outlineColor: 'blue',
    outlineWidth: 2,
  },
  title: {
    textOverflow: 'ellipsis',
    margin: 0,
    marginBottom: theme.spacing.unit,
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
  caption: {
    color: 'rgba(0,0,0,0.6)',
  },
});

// TODO: Complete distance calculations and related accessibility texts

const ResultItem = ({
  bottomRightText, classes, onClick, icon, listId, itemId, subtitle, title, distancePosition,
}) => {
  // Distance text
  // TODO: Change to check data for distance once location info is available
  const distance = distancePosition; // '100';

  return (
    <>
      <ListItem
        button
        role="link"
        component="li"
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
              id={`${listId}-result-item-title-${itemId}`}
              className={classes.title}
              component="h3"
              variant="body2"
              aria-labelledby={`${listId}-result-item-title-${itemId} ${listId}-result-item-type-${itemId} ${listId}-result-item-distance-${itemId} ${listId}-result-item-accessibility-${itemId}`}
            >
              {title}
            </Typography>

            {
              distance
              && (
                <div className={classes.rightColumn}>
                  <Typography
                    variant="caption"
                    className={`${classes.caption} ${classes.marginLeft}`}
                    component="p"
                    aria-hidden="true"
                  >
                    {distance}
                    m
                    <span id={`${listId}-result-item-distance-${itemId}`} className="sr-only" aria-hidden="true">{`${distance} metrin päässä`}</span>
                  </Typography>
                </div>
              )
            }

          </div>
          {
            // Bottom row
            (subtitle || bottomRightText)
            && (
              <div className={classes.bottomRow}>
                {
                  subtitle
                  && (
                    <div className={classes.bottomColumn}>
                      <Typography
                        id={`${listId}-result-item-type-${itemId}`}
                        variant="caption"
                        className={`${classes.noMargin} ${classes.smallFont}`}
                        component="p"
                        aria-hidden="true"
                      >
                        {subtitle}
                      </Typography>
                    </div>
                  )
                }

                {
                  bottomRightText
                  && (
                  <div className={`${classes.rightColumn} ${classes.bottomColumn}`}>
                    <Typography
                      id={`${listId}-result-item-accessibility-${itemId}`}
                      className={`${classes.smallFont} ${classes.marginLeft}`}
                      component="p"
                      variant="caption"
                      aria-hidden="true"
                    >
                      {bottomRightText}
                    </Typography>
                  </div>
                  )
                }

              </div>
            )
          }
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
  bottomRightText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  listId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  itemId: PropTypes.number.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distancePosition: PropTypes.objectOf(PropTypes.any),
};

ResultItem.defaultProps = {
  bottomRightText: null,
  classes: {},
  icon: null,
  onClick: () => {},
  subtitle: null,
  distancePosition: null,
};
