import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

// ServiceMapButton
const SMButton = React.forwardRef((props, ref) => {
  const {
    'aria-label': ariaLabel,
    children,
    classes,
    intl,
    className,
    small,
    color,
    icon,
    messageID,
    onClick,
    margin,
    style,
    role,
    disabled,
    ...rest
  } = props;
  const colorStyle = classes[color] || '';
  const buttonIcon = icon ? React.cloneElement(icon, { className: classes.buttonIcon }) : null;
  const buttonClasses = `${classes.button} ${small ? classes.smallButton : ''} ${margin ? classes.margin : classes.marginRight} ${className} ${colorStyle}`;
  const textClasses = classes.typography;

  let buttonTitle = null;

  if (messageID) {
    buttonTitle = intl.formatMessage({ id: messageID });
  }

  return (
    <ButtonBase
      {...rest}
      ref={ref}
      aria-label={ariaLabel || buttonTitle}
      disabled={disabled}
      className={buttonClasses}
      icon={buttonIcon}
      onClick={onClick}
      role={role || 'button'}
      style={{
        ...style,
      }}
      variant="contained"
    >
      {
        icon
      }
      {
        messageID
        && (
          <Typography aria-hidden color="inherit" component="p" variant="caption" className={textClasses}>
            <FormattedMessage id={messageID} />
          </Typography>
        )
      }
      {
        !messageID
        && children
      }
    </ButtonBase>
  );
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
  role: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

SMButton.defaultProps = {
  'aria-label': null,
  children: null,
  className: '',
  small: false,
  color: 'default',
  icon: null,
  margin: false,
  messageID: null,
  style: null,
  disabled: false,
};

export default SMButton;
