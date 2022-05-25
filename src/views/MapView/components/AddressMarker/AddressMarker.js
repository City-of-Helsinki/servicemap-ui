import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { getAddressText } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';

const AddressMarker = ({
  address,
  classes,
  embeded,
  position,
}) => {
  const getLocaleText = useLocaleText();
  if (!position && (!address || !address.addressCoordinates)) {
    return null;
  }

  const { Marker, Tooltip } = global.rL;

  // eslint-disable-next-line global-require
  const { divIcon } = require('leaflet');
  const addressIcon = divIcon({
    className: classes.addressIcon,
    html: renderToStaticMarkup(
      <>
        <span className={`${classes.distanceMarkerBackground} icon-icon-hsl-background`} />
        <span className="icon-icon-address" />
      </>,
    ),
    iconSize: [45, 45],
    iconAnchor: [22, 42],
  });

  const { addressCoordinates, addressData } = address;
  const tooltipText = getAddressText(addressData, getLocaleText);

  return (
    <Marker
      className="addressMarker"
      position={position || [addressCoordinates[1], addressCoordinates[0]]}
      icon={addressIcon}
      keyboard={false}
    >
      {
        embeded
        && (
          <Tooltip
            className={classes.unitTooltip}
            direction="top"
            offset={[0, -36]} // TODO: fix offset
            permanent
          >
            <Typography variant="body2">
              {tooltipText}
            </Typography>
          </Tooltip>
        )
      }
    </Marker>
  );
};

AddressMarker.propTypes = {
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  position: PropTypes.arrayOf(PropTypes.number),
  embeded: PropTypes.bool,
};

AddressMarker.defaultProps = {
  embeded: false,
  position: null,
};

export default AddressMarker;
