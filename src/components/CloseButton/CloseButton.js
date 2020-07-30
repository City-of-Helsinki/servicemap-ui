/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const CloseButton = ({
  classes,
  className,
  intl,
  onClick,
  ...rest
}) => (
  <Button
    aria-label={intl.formatMessage({ id: 'general.close' })}
    className={`${classes.flexBase} ${classes.button} ${className || ''}`}
    classes={{ label: classes.buttonLabel }}
    onClick={() => {
      onClick();
    }}
    {...rest}
  >
    <Close />
    <FormattedMessage id="general.close" />
  </Button>
);

CloseButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
};

CloseButton.defaultProps = {
  className: null,
};

export default CloseButton;
