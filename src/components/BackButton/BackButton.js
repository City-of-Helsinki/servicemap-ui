import styled from '@emotion/styled';
import { ArrowBack } from '@mui/icons-material';
import {
  Button,
  ButtonBase,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import {
  selectBreadcrumb,
  selectNavigator,
} from '../../redux/selectors/general';
import { getPathName } from '../../utils/path';

function BackButton(props) {
  const {
    className = '',
    onClick = null,
    style = {},
    variant = null,
    srHidden = false,
    ariaLabel = null,
    text = null,
    focusVisibleClassName = null,
  } = props;
  const breadcrumb = useSelector(selectBreadcrumb);
  const navigator = useSelector(selectNavigator);
  const intl = useIntl();

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

  const onClickAction = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (navigator) {
      navigator.goBack();
    }
  };

  const renderContainerVariantButton = (CustomButton) => (
    <CustomButton
      data-sm="BackButton"
      role="link"
      className={`SMBackButton ${className}`}
      style={style}
      aria-hidden={srHidden}
      aria-label={ariaLabel || buttonTitle}
      onClick={(e) => onClickAction(e)}
    >
      <ArrowBack fontSize="inherit" />
      <StyledContainerText
        aria-hidden
        fontSize="inherit"
        color="inherit"
        variant="body2"
      >
        {text || buttonTitle}
      </StyledContainerText>
    </CustomButton>
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
        onClick={(e) => onClickAction(e)}
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
      onClick={(e) => onClickAction(e)}
    >
      {buttonText}
    </Button>
  );
}

const StyledContainerText = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  fontSize: '0.773rem',
  paddingLeft: theme.spacing(1),
}));

const StyledTopBackButtonContainer = styled('div')(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const marginTop = isMobile ? theme.spacing(-1) : 'auto';
  const marginBottom = isMobile ? theme.spacing(-0.5) : theme.spacing(-1);

  return {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    marginTop,
    marginBottom,
  };
});

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
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['container', 'icon', 'topBackButton', null]),
  srHidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
  text: PropTypes.string,
  focusVisibleClassName: PropTypes.string,
};

export default BackButton;
