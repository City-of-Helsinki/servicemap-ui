import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import distance from '@turf/distance';
import flip from '@turf/flip';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';

import { getSelectedUnit } from '../../../../redux/selectors/selectedUnit';
import { selectThemeMode } from '../../../../redux/selectors/user';
import useLocaleText from '../../../../utils/useLocaleText';
import { drawEntranceMarkerIcon } from '../../utils/drawIcon';
import {
  StyledUnitTooltipTitle,
  StyledUnitTooltipWrapper,
} from '../styled/styled';

function EntranceMarker() {
  const getLocaleText = useLocaleText();
  const unit = useSelector(getSelectedUnit);
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const map = useMap();

  const unitPoint = flip(unit.location);
  const zoomLimit = map.options.detailZoom;

  const shouldShowMarkers = () => map.getZoom() >= zoomLimit;
  const [showMarkers, setShowMarkers] = useState(shouldShowMarkers());

  const checkMarkerVisibility = () => {
    if (shouldShowMarkers()) {
      setShowMarkers(true);
    } else {
      setShowMarkers(false);
    }
  };

  useEffect(() => {
    // Add listener for zoom level to check if markers should be shown
    map.on('zoomend', checkMarkerVisibility);
    return () => {
      map.off('zoomend', checkMarkerVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (unit?.entrances?.length && showMarkers) {
    const { Marker, Popup } = global.rL || {};
    return unit.entrances.map((entrance) => {
      if (!entrance.location) return null;
      const position = flip(entrance.location);
      const distanceBetween = distance(position, unitPoint) * 1000;
      // Don't show entrances that are too close to the unit marker
      if (distanceBetween < 5) {
        return null;
      }
      const { coordinates } = position;

      return (
        <Marker
          key={`${coordinates[0]},${coordinates[1]}`}
          icon={drawEntranceMarkerIcon(useContrast)}
          position={coordinates}
        >
          <Popup>
            <StyledUnitTooltipWrapper>
              <StyledUnitTooltipTitle>
                {getLocaleText(unit.name)}
              </StyledUnitTooltipTitle>
              {entrance.name ? (
                <Typography>{getLocaleText(entrance.name)}</Typography>
              ) : null}
              <StyledEntranceType>
                {entrance.is_main_entrance ? (
                  <FormattedMessage id="unit.entrances.main" />
                ) : (
                  <FormattedMessage id="unit.entrances.secondary" />
                )}
              </StyledEntranceType>
            </StyledUnitTooltipWrapper>
          </Popup>
        </Marker>
      );
    });
  }
  return null;
}

const StyledEntranceType = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
}));

export default EntranceMarker;
