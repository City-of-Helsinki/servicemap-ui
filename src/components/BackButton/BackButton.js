import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IconButton, Typography, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
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


  if (variant === 'icon') {
    return (
      <IconButton
        role="link"
        className={className}
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
        <ArrowBack />
      </IconButton>
    );
  }

  if (variant === 'container') {
    return (
      <div className={`${classes.flexRow} ${classes.container}`}>
        <IconButton
          role="link"
          className={`${classes.containerButton} ${className}`}
          style={style}
          aria-hidden={srHidden}
          aria-label={ariaLabel || buttonText}
          onClick={(e) => {
            e.preventDefault();
            if (onClick) {
              onClick(e);
            } else if (navigator) {
              navigator.goBack();
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography aria-hidden className={`${classes.containerText}`} color="inherit" variant="body2"><FormattedMessage id="general.backTo" /></Typography>
      </div>
    );
  }

  return (
    <Button
      aria-hidden={srHidden}
      aria-label={ariaLabel || buttonText}
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
  variant: PropTypes.oneOf(['container', 'icon', null]),
  srHidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
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
  focusVisibleClassName: null,
};

export default BackButton;
