import { css } from '@emotion/css';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { selectAddress } from '../../../../redux/selectors/address';
import { getAddressText } from '../../../../utils/address';
import useLocaleText from '../../../../utils/useLocaleText';
import { getIcon } from '../../../../components';

const AddressMarker = ({
  embeded = false,
  position = null,
}) => {
  const getLocaleText = useLocaleText();
  const theme = useTheme();
  const address = useSelector(selectAddress);
  if (!position && (!address || !address.addressCoordinates)) {
    return null;
  }

  const { Marker, Tooltip } = global.rL;
  const tooltipClass = css({
    padding: theme.spacing(2),
    textAlign: 'left',
  });
  const addressIconClass = css({
    fontSize: 50,
    color: theme.palette.primary.main,
    textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
    outline: 'none',
  });

  // eslint-disable-next-line global-require
  const { divIcon } = require('leaflet');
  const addressIcon = divIcon({
    className: `${addressIconClass} AddressMarkerIcon`,
    'data-sm': 'AddressMarkerIcon',
    html: renderToStaticMarkup(
      getIcon('addresslocationMarker'),
    ),
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
            className={tooltipClass}
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
  position: PropTypes.arrayOf(PropTypes.number),
  embeded: PropTypes.bool,
};

export default AddressMarker;
