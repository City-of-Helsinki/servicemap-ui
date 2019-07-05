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
  bottomRightColor,
  bottomRightText,
  classes,
  onClick,
  icon,
  subtitle,
  title,
  distancePosition,
  role,
  srLabel,
}) => {
  // Distance text
  // TODO: Change to check data for distance once location info is available
  const distance = distancePosition; // '100';

  // Screen reader text
  const srText = `${title || ''} ${subtitle || ''} ${distance ? `${distance} metrin päässä` : ''} ${bottomRightText || ''} ${srLabel || ''}`;
  const bottomRightStyles = { color: bottomRightColor };

  return (
    <>
      <ListItem
        button
        role={role || 'link'}
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
            {
              // SROnly element with full readable text
            }
            <Typography
              className={classes.title}
              component="p"
              variant="srOnly"
            >
              {srText}
            </Typography>

            {
              // Title
            }
            <Typography
              className={classes.title}
              component="p"
              role="textbox"
              variant="body2"
              aria-hidden="true"
            >
              {title}
            </Typography>

            {
              // Distance text
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
                      className={`${classes.smallFont} ${classes.marginLeft}`}
                      component="p"
                      variant="caption"
                      aria-hidden="true"
                      style={bottomRightStyles}
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
  bottomRightColor: PropTypes.string,
  bottomRightText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distancePosition: PropTypes.objectOf(PropTypes.any),
  role: PropTypes.string,
  srLabel: PropTypes.string,
};

ResultItem.defaultProps = {
  bottomRightColor: null,
  bottomRightText: null,
  classes: {},
  icon: null,
  onClick: () => {},
  subtitle: null,
  distancePosition: null,
  role: null,
  srLabel: null,
};
