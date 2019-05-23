import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton, Button } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import { getPathName } from '../../utils/path';

const BackButton = (props) => {
  const {
    breadcrumb, className, intl, onClick, style, variant, navigator,
  } = props;

  // Generate dynamic text
  // Figure out correct aria suffix
  let ariaSuffix = 'home';
  if (breadcrumb.length) {
    const previousEntry = breadcrumb[breadcrumb.length - 1];
    if (typeof previousEntry === 'string') {
      const suffix = getPathName(previousEntry);
      if (suffix) {
        ariaSuffix = suffix;
      }
    }
    if (typeof previousEntry === 'object' && previousEntry.pathname) {
      const suffix = getPathName(previousEntry.pathname);
      if (suffix) {
        ariaSuffix = suffix;
      }
    }
  }

  // Attempt to generate custom text
  const ariaTextId = `general.back.${ariaSuffix}`;
  const defaultMessage = intl.formatMessage({ id: 'general.back' });
  const buttonText = intl.formatMessage({ id: ariaTextId, defaultMessage });


  if (variant === 'icon') {
    return (
      <IconButton
        role="link"
        className={className}
        style={style}
        aria-label={buttonText}
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

  return (
    <Button
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
  className: PropTypes.string,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['icon', null]),
};

BackButton.defaultProps = {
  className: '',
  navigator: null,
  style: {},
  onClick: null,
  variant: null,
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { breadcrumb, navigator } = state;
  return {
    breadcrumb,
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  null,
)(BackButton));
