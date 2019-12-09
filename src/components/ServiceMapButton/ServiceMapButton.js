import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

// ServiceMapButton
const SMButton = ({
  children, classes, className, color, messageID, onClick, srText, style, role, ...rest
}) => {
  const colorStyle = classes[color] || '';

  return (
    <ButtonBase
      className={`${classes.button} ${className} ${colorStyle}`}
      role={role || 'link'}
      variant="contained"
      onClick={onClick}
      aria-label={srText}
      style={{
        ...style,
      }}
      {...rest}
    >
      {
        messageID
        && (
          <Typography color="inherit" component="p" variant="caption" className={classes.typography}>
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
};

SMButton.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'default']),
  messageID: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  srText: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
  role: PropTypes.string,
};

SMButton.defaultProps = {
  children: null,
  className: '',
  color: 'default',
  messageID: null,
  srText: null,
  style: null,
  role: null,
};

export default SMButton;
