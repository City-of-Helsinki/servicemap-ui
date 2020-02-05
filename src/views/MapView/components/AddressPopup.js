import React, { useState, useEffect } from 'react';
import { withStyles, ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from '../styles';
import fetchAddress from '../utils/fetchAddress';
import { getAddressText } from '../../../utils/address';

const AddressPopup = ({
  Popup, classes, mapClickPoint, getAddressNavigatorParams, getLocaleText, map, navigator,
}) => {
  const [address, setAddress] = useState(null);

  useEffect(() => {
    fetchAddress(mapClickPoint)
      .then(data => setAddress(data));
  }, []);

  const popupText = address ? `${getAddressText(address, getLocaleText)}` : '';

  return (
    <Popup className="popup" closeButton={false} autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
      {address ? (
        <div
          className={classes.addressPopup}
        >
          <Typography variant="body2">
            {popupText}
          </Typography>
          <ButtonBase
            className={classes.addressPopupButton}
            onClick={() => {
              if (navigator) {
                map.leafletElement.closePopup();
                navigator.push('address', getAddressNavigatorParams(address));
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
  getAddressNavigatorParams: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withStyles(styles)(AddressPopup);
