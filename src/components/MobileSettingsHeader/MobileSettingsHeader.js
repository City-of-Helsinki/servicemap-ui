import { FormLabel } from '@mui/material';
import styled from '@emotion/styled';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const MobileSettingsHeader = ({ textId }) => (
  <StyledFormLabel>
    <FormattedMessage id={textId} />
  </StyledFormLabel>
);

const StyledFormLabel = styled(FormLabel)(() => ({
  fontWeight: 700,
  fontSize: '1.03rem',
  lineHeight: '24px',
  letterSpacing: '0.15px',
  color: '#000',
}));

MobileSettingsHeader.propTypes = {
  textId: PropTypes.string.isRequired,
};
export default MobileSettingsHeader;
