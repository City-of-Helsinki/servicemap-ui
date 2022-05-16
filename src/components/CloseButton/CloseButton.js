/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { Close } from '@mui/icons-material';

const CloseButton = ({
  classes,
  className,
  intl,
  onClick,
  textID,
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
    {
      textID
        ? <FormattedMessage id={textID} />
        : <FormattedMessage id="general.close" />
    }
  </Button>
);

CloseButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
  textID: PropTypes.string,
};

CloseButton.defaultProps = {
  className: null,
  textID: null,
};

export default CloseButton;
