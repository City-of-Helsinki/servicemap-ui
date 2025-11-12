import styled from '@emotion/styled';
import { ButtonBase, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMapEvents } from 'react-leaflet';
import { useLocation } from 'react-router';

import { SMButton } from '../../../../components';
import { getAddressText, useNavigationParams } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import fetchAddress from '../../utils/fetchAddress';

function AddressPopup({ navigator }) {
  const { Popup } = global.rL;
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const getAddressNavigatorParams = useNavigationParams();
  const location = useLocation();

  const [mapClickPoint, setMapClickPoint] = useState(null);
  const addressTextRef = useRef(null);
  const addressButtonRef = useRef(null);
  const addressData = useRef(null);

  const updatePopupText = (type) => {
    if (type === 'addressFound') {
      if (addressTextRef.current) {
        addressTextRef.current.innerText = intl.formatMessage({
          id: 'map.address.info',
        });
      }
      if (addressButtonRef.current) {
        addressButtonRef.current.innerText = getAddressText(
          addressData.current,
          getLocaleText
        );
      }
    }
    if (type === 'noAddress') {
      if (addressTextRef.current) {
        addressTextRef.current.innerText = intl.formatMessage({
          id: 'map.address.notFound',
        });
      }
    }
  };

  const map = useMapEvents({
    click(e) {
      setMapClickPoint(null);
      if (document.getElementsByClassName('leaflet-popup').length > 0) {
        map.closePopup();
      } else {
        setMapClickPoint(e.latlng);
        fetchAddress(e.latlng)
          .then((data) => {
            addressData.current = data;
            if (!data) updatePopupText('noAddress');
            else updatePopupText('addressFound');
          })
          .catch(() => updatePopupText('noAddress'));
      }
    },
  });

  if (!mapClickPoint) return null;

  const coordClick = () => {
    if (mapClickPoint) {
      const usp = new URLSearchParams(location.search);
      const { lat, lng } = mapClickPoint;
      usp.delete('lat');
      usp.delete('lon');
      usp.append('lat', lat);
      usp.append('lon', lng);
      const newLocation = {
        ...location,
        search: usp.toString(),
      };
      navigator.replace(newLocation);
      try {
        if (map) {
          setMapClickPoint(null);
        }
      } catch (e) {
        console.warn('Unable to close AddressPopup on coordinate selection');
      }
    }
  };

  return (
    <Popup
      className="popup"
      key="addressPopup"
      autoPan={false}
      position={[mapClickPoint.lat, mapClickPoint.lng]}
    >
      <StyledAddressPopupContainer>
        <Typography ref={addressTextRef} variant="subtitle2" component="p">
          <FormattedMessage id="map.address.searching" />
        </Typography>
        <StyledAddressPopupButton
          onClick={() => {
            if (navigator && addressData.current) {
              setMapClickPoint(null);
              navigator.push(
                'address',
                getAddressNavigatorParams(addressData.current)
              );
            }
          }}
        >
          <StyledAddressLink ref={addressButtonRef} variant="body2" />
        </StyledAddressPopupButton>
        <StyledCloseButton
          role="button"
          onClick={coordClick}
          messageID="map.address.coordinate"
          color="primary"
        />
      </StyledAddressPopupContainer>
    </Popup>
  );
}

const StyledAddressPopupButton = styled(ButtonBase)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(2),
}));

const StyledAddressLink = styled(Typography)(({ theme }) => ({
  color: theme.palette.link.main,
  textDecoration: 'underline',
}));

const StyledCloseButton = styled(SMButton)(() => ({
  marginLeft: 'auto',
}));

const StyledAddressPopupContainer = styled.div(({ theme }) => ({
  lineHeight: '6px',
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  padding: theme.spacing(2),
  position: 'inherit',
  wordBreak: 'break-all',
}));

AddressPopup.propTypes = {
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AddressPopup;
