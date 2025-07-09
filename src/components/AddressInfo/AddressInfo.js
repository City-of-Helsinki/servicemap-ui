import styled from '@emotion/styled';
import { LocationOn } from '@mui/icons-material';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { getAddressText } from '../../utils/address';
import useLocaleText from '../../utils/useLocaleText';

const AddressInfo = memo(({ address, districts }) => {
  const getLocaleText = useLocaleText();
  const localPostArea = districts.find((obj) => obj.type === 'postcode_area');
  const localNeighborhood = districts.find(
    (obj) => obj.type === 'neighborhood'
  );
  return (
    <StyledAddressInfoContainer data-sm="AddressInfo">
      <StyledAddressInfoText component="h3">
        <FormattedMessage id="area.localAddress.title" />
      </StyledAddressInfoText>
      <StyledAddressInfoIconArea>
        <StyledAddressInfoIcon color="primary" />
        <Typography component="p" variant="subtitle1">
          {getAddressText(address, getLocaleText)}
        </Typography>
      </StyledAddressInfoIconArea>
      {localPostArea ? (
        <StyledAddressInfoText>
          <FormattedMessage
            id="area.localAddress.postCode"
            values={{ area: getLocaleText(localPostArea.name) }}
          />
        </StyledAddressInfoText>
      ) : null}
      {localNeighborhood ? (
        <StyledAddressInfoText>
          <FormattedMessage
            id="area.localAddress.neighborhood"
            values={{ area: getLocaleText(localNeighborhood.name) }}
          />
        </StyledAddressInfoText>
      ) : null}
    </StyledAddressInfoContainer>
  );
});

const StyledAddressInfoContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#E3F3FF',
  textAlign: 'left',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const StyledAddressInfoText = styled(Typography)(() => ({
  paddingLeft: 62,
}));

const StyledAddressInfoIconArea = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const StyledAddressInfoIcon = styled(LocationOn)(({ theme }) => ({
  width: 50,
  paddingRight: theme.spacing(1.5),
}));

AddressInfo.propTypes = {
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  districts: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default AddressInfo;
