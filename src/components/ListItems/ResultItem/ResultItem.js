/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {
  ListItem, ListItemIcon, Typography, Divider,
} from '@material-ui/core';

// TODO: Complete distance calculations and related accessibility texts
const ResultItem = ({
  bottomHighlight,
  bottomText,
  classes,
  onClick,
  onKeyDown,
  icon,
  subtitle,
  title,
  distance,
  divider,
  role,
  srLabel,
  intl,
  selected,
  padded,
  extendedClasses,
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
    ${bottomText || ''} 
    ${srLabel || ''}
  `;

  const typographyClasses = (extendedClasses && extendedClasses.typography) || {};
  const listItemClasses = padded ? classes.paddedItem : classes.listItem;
  const listItemIconClasses = padded ? classes.listItemIconPadded : classes.listItemIcon;

  return (
    <>
      <ListItem
        selected={selected}
        button
        role={role || 'link'}
        component="li"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={listItemClasses}
        classes={{
          focusVisible: classes.cssFocused,
        }}
      >
        {
          icon
          && (
          <ListItemIcon className={listItemIconClasses}>
            {icon}
          </ListItemIcon>
          )
        }
        <div className={classes.itemTextContainer}>
          <div className={classes.topRow || ''}>
            {
              // SROnly element with full readable text
            }
            <Typography
              className={`${classes.title || ''}`}
              component="p"
              variant="srOnly"
            >
              {srText}
            </Typography>

            {
              // Title
            }
            <Typography
              className={`${classes.title || ''}  ${typographyClasses.title || ''}`}
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
                <div className={`${classes.rightColumn || ''}`}>
                  <Typography
                    variant="caption"
                    className={`${classes.caption || ''} ${classes.text} ${classes.marginLeft || ''} ${typographyClasses.topRight || ''}`}
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
            (subtitle || bottomText)
            && (
              <div>
                <div>
                  <Typography
                    variant="caption"
                    className={`${classes.noMargin || ''} ${classes.text} ${typographyClasses.subtitle || ''}`}
                    component="p"
                    aria-hidden="true"
                  >
                    {subtitle || ''}
                  </Typography>
                </div>
                {
                  bottomText
                  && (
                  <div className={`${classes.bottomContainer} ${bottomHighlight ? classes.bottomHighlight : ''}`}>
                    <Typography
                      className={`${classes.smallFont || ''} ${typographyClasses.bottom || ''}`}
                      color="inherit"
                      component="p"
                      variant="caption"
                      aria-hidden="true"
                    >
                      {bottomText}
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
        <Divider className={classes.divider} aria-hidden="true" variant="inset" />
      </li>
      )}
    </>
  );
};

export default ResultItem;

// Typechecking
ResultItem.propTypes = {
  bottomHighlight: PropTypes.bool,
  bottomText: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any),
  extendedClasses: PropTypes.objectOf(PropTypes.shape({
    typography: PropTypes.shape({
      bottom: PropTypes.string,
      subtitle: PropTypes.string,
      title: PropTypes.string,
      topRight: PropTypes.string,
    }),
  })),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distance: PropTypes.objectOf(PropTypes.any),
  divider: PropTypes.bool,
  role: PropTypes.string,
  srLabel: PropTypes.string,
  selected: PropTypes.bool,
  padded: PropTypes.bool,
  intl: intlShape.isRequired,
};

ResultItem.defaultProps = {
  bottomHighlight: false,
  bottomText: null,
  classes: {},
  extendedClasses: null,
  icon: null,
  onClick: () => {},
  onKeyDown: null,
  subtitle: null,
  distance: null,
  divider: true,
  role: null,
  srLabel: null,
  selected: false,
  padded: false,
};
