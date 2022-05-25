/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, Divider,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useSelector } from 'react-redux';
import { keyboardHandler } from '../../../utils';
import locationIcon from '../../../assets/icons/LocationDefault.svg';
import locationIconHover from '../../../assets/icons/LocationHover.svg';
import locationIconContrast from '../../../assets/icons/LocationDefaultContrast.svg';
import locationIconContrastHover from '../../../assets/icons/LocationHoverContrast.svg';

const ResultItem = ({
  bottomHighlight,
  bottomText,
  classes,
  onClick,
  icon,
  subtitle,
  title,
  distance,
  divider,
  role,
  srLabel,
  selected,
  padded,
  extendedClasses,
  unitId,
  simpleItem,
  ...rest
}) => {
  const theme = useSelector(state => state.user.theme);

  const resetMarkerHighlight = () => {
    // Handle marker highlight removal
    const marker = document.querySelector(`.unit-marker-${unitId}`);
    if (!marker) {
      return;
    }
    marker.classList.remove('markerHighlighted');
    if (marker.nodeName === 'IMG') {
      const icon = theme === 'dark' ? locationIconContrast : locationIcon;
      marker.setAttribute('src', icon);
    }
  };

  useEffect(() => () => {
    // Remove highlights on unmount
    resetMarkerHighlight();
  }, []);

  const onMouseEnter = () => {
    // Handle marker highlighting
    const marker = document.querySelector(`.unit-marker-${unitId}`);
    if (marker) {
      marker.classList.add('markerHighlighted');
      if (marker.nodeName === 'IMG') {
        const icon = theme === 'dark' ? locationIconContrastHover : locationIconHover;
        marker.setAttribute('src', icon);
      }
    }
  };

  const onMouseLeave = () => {
    // Reset marker highlighting
    resetMarkerHighlight();
  };


  // Screen reader text
  const srText = `
    ${title || ''} 
    ${subtitle || ''} 
    ${distance?.srText || ''} 
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
        role={role}
        component="li"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={keyboardHandler(onClick, ['enter', 'space'])}
        onFocus={unitId ? onMouseEnter : null}
        onBlur={unitId ? onMouseLeave : null}
        onMouseEnter={unitId ? onMouseEnter : null}
        onMouseLeave={unitId ? onMouseLeave : null}
        className={listItemClasses}
        {...rest}
      >
        {
          icon
          && (
          <ListItemIcon className={listItemIconClasses}>
            {icon}
          </ListItemIcon>
          )
        }
        <div className={`${classes.itemTextContainer}  ${simpleItem ? classes.compactTextContainer : ''}`}>
          <div className={`${classes.topRow || ''}`}>
            {
              // SROnly element with full readable text
            }
            <Typography
              className={`${classes.title || ''} ResultItem-srOnly`}
              component="p"
              style={visuallyHidden}
            >
              {srText}
            </Typography>

            {
              // Title
            }
            <Typography
              className={`${classes.title || ''}  ${typographyClasses.title || ''} ${simpleItem ? classes.compactItem : ''} ResultItem-title`}
              component="p"
              role="textbox"
              variant="body2"
              aria-hidden="true"
            >
              {title}
            </Typography>

            {
              // Distance text
              distance && distance.text
              && (
                <div className={`${classes.rightColumn || ''}`}>
                  <Typography
                    variant="caption"
                    className={`${classes.caption || ''} ${classes.text} ${classes.marginLeft || ''} ${typographyClasses.topRight || ''} ResultItem-distance`}
                    component="p"
                    aria-hidden="true"
                  >
                    {distance.text}
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
                    className={`${classes.noMargin || ''} ${classes.text} ${typographyClasses.subtitle || ''} ResultItem-subtitle`}
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
                      className={`${classes.smallFont || ''} ${typographyClasses.bottom || ''} ResultItem-bottom`}
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
        <li aria-hidden>
          <Divider
            className={simpleItem ? classes.shortDivider : classes.divider}
            variant={icon ? 'inset' : 'fullWidth'}
          />
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
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  distance: PropTypes.shape({
    srText: PropTypes.string,
    text: PropTypes.string,
  }),
  divider: PropTypes.bool,
  role: PropTypes.string,
  srLabel: PropTypes.string,
  selected: PropTypes.bool,
  unitId: PropTypes.number,
  padded: PropTypes.bool,
  simpleItem: PropTypes.bool,
};

ResultItem.defaultProps = {
  bottomHighlight: false,
  bottomText: null,
  classes: {},
  extendedClasses: null,
  unitId: null,
  icon: null,
  onClick: () => {},
  subtitle: null,
  distance: null,
  divider: true,
  role: 'link',
  srLabel: null,
  selected: false,
  padded: false,
  simpleItem: false,
};
