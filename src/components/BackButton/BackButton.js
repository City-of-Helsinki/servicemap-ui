import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton, Typography, Button, ButtonBase,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import styled from '@emotion/styled';
import { getPathName } from '../../utils/path';

const BackButton = (props) => {
  const {
    breadcrumb,
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

  const renderContainerVariantButton = (CustomButton) => (
    <>
      <CustomButton
        data-sm="BackButton"
        role="link"
        className={`SMBackButton ${className}`}
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
        <StyledContainerText aria-hidden fontSize="inherit" color="inherit" variant="body2">
          {text || buttonTitle}
        </StyledContainerText>
      </CustomButton>
    </>
  );


  if (variant === 'icon') {
    return (
      <IconButton
        role="link"
        data-sm="BackButton"
        className={`SMBackButton ${className}`}
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
    return renderContainerVariantButton(StyledButton);
  }

  if (variant === 'topBackButton') {
    return (
      <StyledTopBackButtonContainer>
        {renderContainerVariantButton(StyledTopBackButton)}
      </StyledTopBackButtonContainer>
    );
  }

  return (
    <Button
      aria-hidden={srHidden}
      aria-label={ariaLabel || buttonText}
      data-sm="BackButton"
      className="SMBackButton"
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

const StyledContainerText = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  fontSize: '0.773rem',
  paddingLeft: theme.spacing(1),
}));

const StyledTopBackButtonContainer = styled('div')(({ theme }) => ({
  color: '#fff',
  backgroundColor: theme.palette.primary.main,
  marginBottom: theme.spacing(-1),
}));

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  zIndex: 0,
  color: 'inherit',
  padding: theme.spacing(1),
}));

const StyledTopBackButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  zIndex: 0,
  color: 'inherit',
  padding: 0,
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginLeft: theme.spacing(2),
}));

BackButton.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
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
