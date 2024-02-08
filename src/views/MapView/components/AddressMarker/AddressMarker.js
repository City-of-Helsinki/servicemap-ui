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
import { StyledHslIcon } from '../styled/styled';

const AddressMarker = ({
  embeded,
  position,
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
    className: addressIconClass,
    html: renderToStaticMarkup(
      <>
        <StyledHslIcon className="icon-icon-hsl-background" />
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

AddressMarker.defaultProps = {
  embeded: false,
  position: null,
};

export default AddressMarker;
