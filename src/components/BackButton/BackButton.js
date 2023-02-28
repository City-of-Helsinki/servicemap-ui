import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton, Typography, Button, ButtonBase,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getPathName } from '../../utils/path';

const BackButton = (props) => {
  const {
    breadcrumb,
    classes,
    className,
    intl,
    onClick,
    style,
    variant,
    navigator,
    srHidden,
    ariaLabel,
    text,
    focusVisibleClassName,
  } = props;
  // Generate dynamic text
  // Figure out correct translation id suffix
  let idSuffix = 'goToHome';
  if (breadcrumb.length) {
    const previousEntry = breadcrumb[breadcrumb.length - 1]?.location;
    if (typeof previousEntry === 'string') {
      const suffix = getPathName(previousEntry);
      if (suffix) {
        idSuffix = suffix;
      }
    }
    if (typeof previousEntry === 'object' && previousEntry.pathname) {
      const suffix = getPathName(previousEntry.pathname);
      if (suffix) {
        idSuffix = suffix;
      }
    }
  }

  // Attempt to generate custom text
  const textId = `general.back.${idSuffix}`;
  const defaultMessage = intl.formatMessage({ id: 'general.back' });
  const buttonText = intl.formatMessage({ id: textId, defaultMessage });
  // Set button text as state, so that it does not change
  const [buttonTitle] = useState(buttonText);
  let classNames = 'SMBackButton';


  if (variant === 'icon') {
    classNames += ` ${className}`;
    return (
      <IconButton
        role="link"
        className={classNames}
        style={style}
        aria-hidden={srHidden}
        aria-label={ariaLabel || buttonText}
        focusVisibleClassName={focusVisibleClassName}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick(e);
          } else if (navigator) {
            navigator.goBack();
          }
        }}
      >
        <ArrowBack fontSize="inherit" />
      </IconButton>
    );
  }

  if (variant === 'container') {
    classNames += ` ${classes.containerButton} ${className}`;
    return (
      <ButtonBase
        role="link"
        className={classNames}
        style={style}
        aria-hidden={srHidden}
        aria-label={ariaLabel || buttonTitle}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick(e);
          } else if (navigator) {
            navigator.goBack();
          }
        }}
      >
        <ArrowBack fontSize="inherit" />
        <Typography aria-hidden className={`${classes.containerText}`} fontSize="inherit" color="inherit" variant="body2">
          {text || buttonTitle}
        </Typography>
      </ButtonBase>
    );
  }

  if (variant === 'topBackButton') {
    classNames += ` ${classes.topBackButton} ${className}`;
    return (
      <div className={classes.topBackButtonContainer}>
        <ButtonBase
          role="link"
          className={classNames}
          style={style}
          aria-hidden={srHidden}
          aria-label={ariaLabel || buttonTitle}
          onClick={(e) => {
            e.preventDefault();
            if (onClick) {
              onClick(e);
            } else if (navigator) {
              navigator.goBack();
            }
          }}
        >
          <ArrowBack fontSize="inherit"/>
          <Typography aria-hidden className={`${classes.containerText}`} fontSize="inherit" color="inherit" variant="body2">
            {text || buttonTitle}
          </Typography>
        </ButtonBase>
      </div>
    );
  }

  return (
    <Button
      aria-hidden={srHidden}
      aria-label={ariaLabel || buttonText}
      className={classNames}
      role="link"
      variant="contained"
      color="primary"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick(e);
        } else if (navigator) {
          navigator.goBack();
        }
      }}
    >
      {buttonText}

    </Button>

  );
};

BackButton.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['container', 'icon', 'topBackButton', null]),
  srHidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
  text: PropTypes.string,
  focusVisibleClassName: PropTypes.string,
};

BackButton.defaultProps = {
  className: '',
  navigator: null,
  style: {},
  onClick: null,
  variant: null,
  srHidden: false,
  ariaLabel: null,
  text: null,
  focusVisibleClassName: null,
};

export default BackButton;
