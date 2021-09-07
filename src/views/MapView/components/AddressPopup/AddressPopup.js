import React, { useState } from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMapEvents } from 'react-leaflet';
import fetchAddress from '../../utils/fetchAddress';
import { getAddressText, useNavigationParams } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';

const AddressPopup = ({
  classes,
  navigator,
}) => {
  const { Popup } = global.rL;
  const getLocaleText = useLocaleText();
  const getAddressNavigatorParams = useNavigationParams();
  const location = useLocation();

  const [address, setAddress] = useState(null);
  const [fetching, setFetching] = useState(null);
  const [mapClickPoint, setMapClickPoint] = useState(null);

  const map = useMapEvents({
    click(e) {
      setMapClickPoint(null);
      if (document.getElementsByClassName('leaflet-popup').length > 0) {
        map.closePopup();
      } else {
        setMapClickPoint(e.latlng);
        setFetching(true);
        fetchAddress(e.latlng)
          .then((data) => {
            setAddress(data);
            setFetching(false);
          })
          .catch(() => setFetching(false));
      }
    },
  });


  if (!mapClickPoint) return null;

  const popupText = address ? `${getAddressText(address, getLocaleText)}` : '';
  const coordText = `${mapClickPoint.lat}, ${mapClickPoint.lng}`;

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
          map.closePopup();
        }
      } catch (e) {
        console.warn('Unable to close AddressPopup on coordinate selection');
      }
    }
  };

  let popupContent;

  if (fetching) {
    popupContent = (
      <Typography className={classes.marginBottom} variant="subtitle2" component="p">
        <FormattedMessage id="map.address.searching" />
      </Typography>
    );
  } else if (!address) {
    popupContent = (
      <Typography className={classes.marginBottom} variant="subtitle2" component="p">
        <FormattedMessage id="map.address.notFound" />
      </Typography>
    );
  } else {
    popupContent = (
      <>
        <Typography variant="subtitle2" component="p">
          <FormattedMessage id="map.address.info" />
        </Typography>
        <ButtonBase
          className={classes.addressPopupButton}
          onClick={() => {
            if (navigator) {
              map.closePopup();
              navigator.push('address', getAddressNavigatorParams(address));
            }
          }}
        >
          <Typography className={classes.addressLink} variant="body2">
            {popupText}
          </Typography>
        </ButtonBase>
      </>
    );
  }

  return (
    <Popup className="popup" closeButton={false} autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
      <div className={classes.addressPopup}>
        {popupContent}
        {
          coordText
          && (
            <>
              <Typography variant="subtitle2" component="p">
                <FormattedMessage id="map.address.coordinate" />
              </Typography>
              <ButtonBase
                className={classes.addressPopupButton}
                onClick={coordClick}
              >
                <Typography className={classes.coordinateLink} variant="body2">{coordText}</Typography>
              </ButtonBase>
            </>
          )
        }
      </div>
    </Popup>
  );
};

AddressPopup.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AddressPopup;
