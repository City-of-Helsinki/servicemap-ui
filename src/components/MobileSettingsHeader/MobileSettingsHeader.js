import { FormLabel, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styled from '@emotion/styled';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

function MobileSettingsHeader({ textId, onClose = null }) {
  const intl = useIntl();

  return (
    <StyledWrapper>
      {onClose && (
        <StyledCloseButton
          onClick={onClose}
          aria-label={intl.formatMessage({ id: 'general.close' })}
        >
          <Close />
        </StyledCloseButton>
      )}
      <StyledFormLabel>
        <FormattedMessage id={textId} />
      </StyledFormLabel>
    </StyledWrapper>
  );
}

const StyledFormLabel = styled(FormLabel)(() => ({
  fontWeight: 700,
  fontSize: '1.03rem',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  color: '#000',
}));

const StyledWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '1rem',
}));

const StyledCloseButton = styled(IconButton)(() => ({
  order: 1,
  padding: 0,
  svg: {
    fill: '#000',
  },
}));

MobileSettingsHeader.propTypes = {
  textId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default MobileSettingsHeader;
