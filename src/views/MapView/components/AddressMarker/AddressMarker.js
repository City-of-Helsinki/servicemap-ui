import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { getAddressText } from '../../../../utils/address';
import { AddressIcon } from '../../../../components/SMIcon';

const AddressMarker = ({
  address,
  classes,
  embeded,
  position,
  getLocaleText,
}) => {
  if (!position && (!address || !address.addressCoordinates)) {
    return null;
  }

  const { Marker, Tooltip } = global.rL;

  // eslint-disable-next-line global-require
  const { divIcon } = require('leaflet');
  const addressIcon = divIcon({
    html: renderToStaticMarkup(
      <AddressIcon style={{ fontSize: 36 }} />,
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
            offset={[0, -36]}
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
  getLocaleText: PropTypes.func.isRequired,
};

AddressMarker.defaultProps = {
  embeded: false,
  position: null,
};

export default AddressMarker;
