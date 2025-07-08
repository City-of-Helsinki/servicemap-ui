/* eslint-disable no-underscore-dangle */
import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function CloseButton({
  className = null,
  intl,
  onClick,
  textID = null,
  ...rest
}) {
  return (
    <StyledButton
      aria-label={intl.formatMessage({ id: 'general.close' })}
      className={`${className || ''}`}
      onClick={() => {
        onClick();
      }}
      {...rest}
    >
      <Close />
      {textID ? (
        <FormattedMessage id={textID} />
      ) : (
        <FormattedMessage id="general.close" />
      )}
    </StyledButton>
  );
}

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

export default CloseButton;
