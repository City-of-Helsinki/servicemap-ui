import React, { useState, useEffect } from 'react';
import { withStyles, ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from '../styles';

const fetchAddress = async (latlng) => {
  const addressData = await fetch(`https://api.hel.fi/servicemap/v2/address/?lat=${latlng.lat}&lon=${latlng.lng}&page_size=5`)
    .then(response => response.json())
    .then((data) => {
      const address = data.results[0];
      if (address.letter) {
        address.number += address.letter;
      }
      return data;
    });
  return addressData.results[0];
};

const AddressPopup = ({
  Popup, classes, mapClickPoint, getLocaleText, map, setAddressLocation, navigator,
}) => {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    fetchAddress(mapClickPoint)
      .then(data => setAddress(data));
  }, []);

  return (
    <Popup className="popup" closeButton={false} autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
      {address ? (
        <div
          className={classes.addressPopup}
        >
          <Typography variant="body2">
            {`${getLocaleText(address.street.name)} ${address.number}`}
          </Typography>
          <ButtonBase
            style={{ paddingTop: '9px', paddingBottom: 12 }}
            onClick={() => {
              if (navigator) {
                map.leafletElement.closePopup();
                setAddressLocation({
                  addressId: address.street.id,
                  clickCoordinates: [mapClickPoint.lat, mapClickPoint.lng],
                });
                navigator.push('address', {
                  municipality: address.street.municipality,
                  street: getLocaleText(address.street.name),
                  number: address.number,
                });
              }
            }}
          >
            <Typography className={classes.addressLink} variant="button">
              <FormattedMessage id="map.address.info" />
            </Typography>
          </ButtonBase>
        </div>

      ) : (
        <div className={classes.popup}>
          <Typography variant="body2">
            <FormattedMessage id="map.address.searching" />
          </Typography>
        </div>
      )}
    </Popup>
  );
};

AddressPopup.propTypes = {
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  mapClickPoint: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
};


export default withStyles(styles)(AddressPopup);
