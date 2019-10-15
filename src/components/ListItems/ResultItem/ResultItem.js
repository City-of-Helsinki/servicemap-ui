/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, Divider,
} from '@material-ui/core';
import { isSmallContentArea } from '../../../utils';

// TODO: Complete distance calculations and related accessibility texts
const ResultItem = ({
  bottomRightColor,
  bottomRightText,
  classes,
  onClick,
  onKeyDown,
  icon,
  subtitle,
  title,
  distancePosition,
  divider,
  role,
  srLabel,
  selected,
}) => {
  // Distance text
  // TODO: Change to check data for distance once location info is available
  const distance = distancePosition; // '100';

  const isSmallContent = isSmallContentArea();
  const classStyles = !isSmallContent ? classes : {};

  // Screen reader text
  const srText = `${title || ''} ${subtitle || ''} ${distance ? `${distance} metrin päässä` : ''} ${bottomRightText || ''} ${srLabel || ''}`;
  const bottomRightStyles = { color: bottomRightColor };

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
        classes={{
          focusVisible: classStyles.cssFocused,
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
        <div className={classStyles.itemTextContainer || ''}>
          <div className={classStyles.topRow || ''}>
            {
              // SROnly element with full readable text
            }
            <Typography
              className={classStyles.title || ''}
              component="p"
              variant="srOnly"
            >
              {srText}
            </Typography>

            {
              // Title
            }
            <Typography
              className={classStyles.title || ''}
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
                <div className={classStyles.rightColumn || ''}>
                  <Typography
                    variant="caption"
                    className={`${classStyles.caption || ''} ${classStyles.marginLeft || ''}`}
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
              <div className={classStyles.bottomRow || ''}>
                <div className={classStyles.bottomColumn || ''}>
                  <Typography
                    variant="caption"
                    className={`${classStyles.noMargin || ''} ${classStyles.smallFont || ''}`}
                    component="p"
                    aria-hidden="true"
                  >
                    {subtitle || ''}
                  </Typography>
                </div>
                {
                  bottomRightText
                  && (
                  <div className={`${classStyles.rightColumn || ''} ${classStyles.bottomColumn || ''}`}>
                    <Typography
                      className={`${classStyles.smallFont || ''} ${classStyles.marginLeft || ''}`}
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
  onKeyDown: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distancePosition: PropTypes.objectOf(PropTypes.any),
  divider: PropTypes.bool,
  role: PropTypes.string,
  srLabel: PropTypes.string,
  selected: PropTypes.bool,
};

ResultItem.defaultProps = {
  bottomRightColor: null,
  bottomRightText: null,
  classes: {},
  icon: null,
  onClick: () => {},
  onKeyDown: null,
  subtitle: null,
  distancePosition: null,
  divider: true,
  role: null,
  srLabel: null,
  selected: false,
};
