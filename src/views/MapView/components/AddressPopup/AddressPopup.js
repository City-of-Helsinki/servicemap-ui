import React, { useRef, useState } from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMapEvents } from 'react-leaflet';
import fetchAddress from '../../utils/fetchAddress';
import { getAddressText, useNavigationParams } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import { SMButton } from '../../../../components';

const AddressPopup = ({
  classes,
  navigator,
}) => {
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
      addressTextRef.current.innerText = intl.formatMessage({ id: 'map.address.info' });
      addressButtonRef.current.innerText = getAddressText(addressData.current, getLocaleText);
    }
    if (type === 'noAddress') {
      addressTextRef.current.innerText = intl.formatMessage({ id: 'map.address.notFound' });
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
    <Popup className="popup" key="addressPopup" closeButton={false} autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
      <div className={classes.addressPopup}>
        <Typography ref={addressTextRef} variant="subtitle2" component="p">
          <FormattedMessage id="map.address.searching" />
        </Typography>
        <ButtonBase
          className={classes.addressPopupButton}
          onClick={() => {
            if (navigator && addressData.current) {
              setMapClickPoint(null);
              navigator.push('address', getAddressNavigatorParams(addressData.current));
            }
          }}
        >
          <Typography ref={addressButtonRef} className={classes.addressLink} variant="body2" />
        </ButtonBase>
        <SMButton
          role="button"
          className={classes.closeButton}
          onClick={coordClick}
          messageID="map.address.coordinate"
          color="primary"
        />
      </div>
    </Popup>
  );
};

AddressPopup.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AddressPopup;
