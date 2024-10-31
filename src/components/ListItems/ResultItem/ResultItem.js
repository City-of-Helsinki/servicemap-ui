/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemIcon, Typography, Divider,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import locationIcon from '../../../assets/icons/LocationDefault.svg';
import locationIconHover from '../../../assets/icons/LocationHover.svg';
import locationIconContrast from '../../../assets/icons/LocationDefaultContrast.svg';
import locationIconContrastHover from '../../../assets/icons/LocationHoverContrast.svg';
import { selectThemeMode } from '../../../redux/selectors/user';

const ResultItem = ({
  bottomHighlight,
  bottomText,
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
  const themeMode = useSelector(selectThemeMode);

  const resetMarkerHighlight = () => {
    // Handle marker highlight removal
    const marker = document.querySelector(`.unit-marker-${unitId}`);
    if (!marker) {
      return;
    }
    marker.classList.remove('markerHighlighted');
    if (marker.nodeName === 'IMG') {
      const icon = themeMode === 'dark' ? locationIconContrast : locationIcon;
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
        const icon = themeMode === 'dark' ? locationIconContrastHover : locationIconHover;
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

  return (
    <>
      <StyledListItem
        data-sm="ResultItemComponent"
        selected={selected}
        button
        role={role}
        component="li"
        tabIndex={0}
        onClick={onClick}
        onFocus={unitId ? onMouseEnter : null}
        onBlur={unitId ? onMouseLeave : null}
        onMouseEnter={unitId ? onMouseEnter : null}
        onMouseLeave={unitId ? onMouseLeave : null}
        {...rest}
      >
        {
          icon
          && (
          <StyledListItemIcon>
            {icon}
          </StyledListItemIcon>
          )
        }
        <StyledItemTextContainer simpleitem={+simpleItem}>
          <StyledTopRow data-sm="ResultItemTopRow">
            {
              // SROnly element with full readable text
            }
            <StyledTitle
              className="ResultItem-srOnly ResultItem-title"
              component="p"
              style={visuallyHidden}
            >
              {srText}
            </StyledTitle>

            {
              // Title
            }
            <StyledTitle
              simpleitem={+simpleItem}
              data-sm="ResultItemTitle"
              className={`${typographyClasses.title || ''} ResultItem-title`}
              component="p"
              role="textbox"
              variant="body2"
              aria-hidden="true"
            >
              {title}
            </StyledTitle>

            {
              // Distance text
              distance && distance.text
              && (
                <StyledRightColumn data-sm="ResultItemRightColumn">
                  <StyledText
                    variant="caption"
                    caption="true"
                    marginleft="true"
                    className={`${typographyClasses.topRight || ''} ResultItem-distance`}
                    component="p"
                    aria-hidden="true"
                  >
                    {distance.text}
                  </StyledText>
                </StyledRightColumn>
              )
            }

          </StyledTopRow>
          {
            // Bottom row
            (subtitle || bottomText)
            && (
              <div>
                <div>
                  <StyledText
                    variant="caption"
                    hidemargin="true"
                    className={`${typographyClasses.subtitle || ''} ResultItem-subtitle`}
                    component="p"
                    aria-hidden="true"
                  >
                    {subtitle || ''}
                  </StyledText>
                </div>
                {
                  bottomText
                  && (
                  <StyledBottomContainer bottomhighlight={bottomHighlight || undefined}>
                    <Typography
                      className={`${typographyClasses.bottom || ''} ResultItem-bottom`}
                      color="inherit"
                      component="p"
                      variant="caption"
                      aria-hidden="true"
                    >
                      {bottomText}
                    </Typography>
                  </StyledBottomContainer>
                  )
                }

              </div>
            )
          }
        </StyledItemTextContainer>
      </StyledListItem>
      {divider && (
        <li aria-hidden>
          <StyledDivider
            simpleitem={+simpleItem}
            variant={icon ? 'inset' : 'fullWidth'}
          />
        </li>
      )}
    </>
  );
};

const StyledDivider = styled(Divider)(({ theme, simpleitem }) => (
  simpleitem
    ? {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(-2),
    }
    : {
      marginRight: theme.spacing(-2),
    }
));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  margin: theme.spacing(1),
  marginRight: theme.spacing(2),
  minWidth: 0,
}));

const StyledItemTextContainer = styled('div')(({ theme, simpleitem }) => {
  const styles = {
    flex: '1 1 auto',
    margin: 0,
    marginLeft: theme.spacing(2),
  };
  if (simpleitem) {
    Object.assign(styles, {
      width: '100%',
      marginLeft: 0,
      paddingLeft: theme.spacing(1),
      boxSizing: 'border-box',
    });
  }
  return styles;
});

const StyledTopRow = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
}));

const StyledTitle = styled(Typography)(({ simpleitem }) => {
  const styles = {
    flex: '1 1 auto',
    textOverflow: 'ellipsis',
    margin: 0,
  };
  if (simpleitem) {
    Object.assign(styles, {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    });
  }
  return styles;
});

const StyledRightColumn = styled('div')(() => ({
  textAlign: 'right',
}));

const StyledText = styled(Typography)(({
  theme, caption, marginleft, hidemargin,
}) => {
  const styles = {
    color: '#000', fontWeight: 'normal',
  };
  if (caption) {
    Object.assign(styles, {
      marginleft: theme.spacing(1),
    });
  }
  if (marginleft) {
    Object.assign(styles, {
      color: 'rgba(0,0,0,0.6)',
    });
  }
  if (hidemargin) {
    Object.assign(styles, {
      margin: 0,
    });
  }
  return styles;
});

const StyledBottomContainer = styled('div')(({ bottomhighlight }) => {
  const styles = {
    display: 'inline-block',
    marginTop: '6px',
    '& p': {
      fontWeight: 'normal',
    },
  };
  if (bottomhighlight) {
    Object.assign(styles, {
      backgroundColor: '#323232',
      color: '#FFF',
      padding: '0 8px',
      marginBottom: '2px',
    });
  }
  return styles;
});

export default ResultItem;

// Typechecking
ResultItem.propTypes = {
  bottomHighlight: PropTypes.bool,
  bottomText: PropTypes.string,
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
