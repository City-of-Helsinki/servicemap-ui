import styled from '@emotion/styled';
import { ButtonBase, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// ServiceMapButton
function SMButton(props) {
  const {
    'aria-label': ariaLabel = null,
    children = null,
    intl,
    className = '',
    small = false,
    color = 'default',
    icon = null,
    messageID = null,
    messageCount = null,
    onClick,
    margin = false,
    style = null,
    role = 'button',
    disabled = false,
    textVariant = 'caption',
    passingRef = null,
    ...rest
  } = props;
  let buttonTitle = null;

  if (messageID) {
    buttonTitle = intl.formatMessage(
      { id: messageID },
      { count: messageCount }
    );
  }

  return (
    <StyledButtonBase
      small={+small}
      margin={+margin}
      color={color}
      {...rest}
      ref={passingRef}
      aria-label={ariaLabel || buttonTitle}
      disabled={disabled}
      className={`SMButton ${className}`}
      onClick={onClick}
      role={role}
      style={{
        ...style,
      }}
      variant="contained"
    >
      {icon}
      {messageID && (
        <StyledTypography
          aria-hidden
          color="inherit"
          component="p"
          variant={textVariant || 'caption'}
        >
          {buttonTitle}
        </StyledTypography>
      )}
      {!messageID && children}
    </StyledButtonBase>
  );
}

const StyledTypography = styled(Typography)(() => ({
  fontSize: '0.875rem',
}));

const StyledButtonBase = styled(ButtonBase)(({
  theme,
  small,
  margin,
  color,
}) => {
  const styles = {
    minHeight: 38,
    padding: '0 11px',
    boxSizing: 'border-box',
    borderRadius: 4,
  };
  if (small) {
    Object.assign(styles, {
      minHeight: 32,
      padding: '0 8px',
    });
  }
  if (margin) {
    Object.assign(styles, {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    });
  } else {
    Object.assign(styles, {
      marginRight: theme.spacing(2),
    });
  }
  if (color === 'primary') {
    Object.assign(styles, {
      color: theme.palette.primary.highContrast,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
      '&:disabled': {
        backgroundColor: theme.palette.disabled.strong,
      },
    });
  }
  if (color === 'secondary') {
    Object.assign(styles, {
      color: theme.palette.secondary.contrastText,
      backgroundColor: '#353638',
      border: `0.5px solid ${theme.palette.secondary.contrastText}`,
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
      '&:disabled': {
        backgroundColor: theme.palette.secondary.light,
        color: 'rgba(0, 0, 0, 0.5)',
      },
    });
  }
  if (color === 'default') {
    Object.assign(styles, {
      color: theme.palette.white.contrastText,
      backgroundColor: theme.palette.white.main,
      border: `0.5px solid ${theme.palette.white.contrastText}`,
      '&:hover': {
        backgroundColor: theme.palette.white.light,
      },
      '&:disabled': {
        // backgroundColor: theme.palette.white.dark,
        borderColor: theme.palette.white.dark,
        color: 'rgba(0, 0, 0, 0.5)',
      },
    });
  }
  return styles;
});

SMButton.propTypes = {
  'aria-label': PropTypes.string,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'default']),
  margin: PropTypes.bool,
  small: PropTypes.bool,
  messageID: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
  role: PropTypes.oneOf(['button', 'link']),
  disabled: PropTypes.bool,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  textVariant: PropTypes.string,
  messageCount: PropTypes.number,
  passingRef: PropTypes.shape({ current: PropTypes.objectOf(PropTypes.any) }),
};

export default SMButton;
