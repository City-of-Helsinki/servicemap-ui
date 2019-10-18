import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {
  ListItem, ListItemIcon, Typography, Divider,
} from '@material-ui/core';

// TODO: Complete distance calculations and related accessibility texts
const ResultItem = ({
  bottomRightColor,
  bottomRightText,
  classes,
  onClick,
  icon,
  subtitle,
  title,
  distance,
  divider,
  role,
  srLabel,
  intl,
}) => {
  // Screen reader text
  const srText = `
    ${title || ''} 
    ${subtitle || ''} 
    ${distance
    ? `${distance.distance} ${distance.type === 'm'
      ? intl.formatMessage({ id: 'general.distance.meters' })
      : intl.formatMessage({ id: 'general.distance.kilometers' })}`
    : ''} 
    ${bottomRightText || ''} 
    ${srLabel || ''}
  `;

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
                    {distance.distance}
                    {distance.type}
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
      {divider && (
      <li>
        <Divider aria-hidden="true" variant={icon && 'inset'} />
      </li>
      )}
    </>
  );
};

export default ResultItem;

// Typechecking
ResultItem.propTypes = {
  bottomRightColor: PropTypes.string,
  bottomRightText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distance: PropTypes.objectOf(PropTypes.any),
  divider: PropTypes.bool,
  role: PropTypes.string,
  srLabel: PropTypes.string,
  intl: intlShape.isRequired,
};

ResultItem.defaultProps = {
  bottomRightColor: null,
  bottomRightText: null,
  classes: {},
  icon: null,
  onClick: () => {},
  subtitle: null,
  distance: null,
  divider: true,
  role: null,
  srLabel: null,
};
