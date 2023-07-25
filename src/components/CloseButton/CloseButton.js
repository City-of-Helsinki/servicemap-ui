/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from '@emotion/styled';

const CloseButton = ({
  className,
  intl,
  onClick,
  textID,
  ...rest
}) => (
  <StyledButton
    aria-label={intl.formatMessage({ id: 'general.close' })}
    className={`${className || ''}`}
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
  </StyledButton>
);

const StyledButton = styled(Button)(() => ({
  flex: '0 0 auto',
  flexDirection: 'column',
  textTransform: 'none',
  fontSize: '0.75rem',
  color: 'black',
}));


CloseButton.propTypes = {
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
