import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';

import { StyledHslIcon } from '../styled/styled';

function DistanceMeasure(props) {
  const { markerArray, setMarkerArray, lineArray, setLineArray } = props;

  const { Marker, Polyline, Tooltip, Popup } = global.rL;

  const theme = useTheme();
  const [icon, setIcon] = useState(null);

  useMapEvents({
    click(e) {
      setMarkerArray([...markerArray, e.latlng]);
      setLineArray([...lineArray, e.latlng]);
    },
    zoom() {
      // Distance markers lose interactive status after zooming. Add it back manually
      setTimeout(() => {
        const measureMarkers = document.getElementsByClassName(
          'leaflet-marker-draggable'
        );
        if (measureMarkers.length) {
          measureMarkers.forEach((marker) => {
            marker.classList.add('leaflet-interactive');
          });
        }
      }, 500);
    },
  });

  const getDistance = (interval) => {
    let points = lineArray;
    let dist = 0;
    if (interval) {
      points = points.slice(0, interval + 1);
    }
    points.forEach((p, i, arr) => {
      if (i !== 0) {
        dist += p.distanceTo(arr[i - 1]);
      }
    });
    return Math.round(dist);
  };

  const updateLine = (event, index) => {
    const updateArray = lineArray;
    updateArray[index] = event.latlng;
    setLineArray([...updateArray]);
  };
  const addressIconClass = css({
    fontSize: 50,
    color: theme.palette.primary.main,
    textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
    outline: 'none',
  });

  useEffect(() => {
    const mapElement = document.getElementsByClassName('leaflet-container')[0];
    mapElement.style.cursor = 'crosshair';
    setMarkerArray(lineArray);
    return () => {
      mapElement.style.cursor = 'grab';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Create marker icon on component mount
    const icon = global.L.divIcon({
      iconSize: global.L.point([50, 50]),
      iconAnchor: global.L.point([25, 56]),
      popupAnchor: global.L.point([0, -40]),
      className: addressIconClass,
      html: renderToStaticMarkup(
        <>
          <StyledHslIcon className="icon-icon-hsl-background" />
          <span className="icon-icon-address" />
        </>
      ),
    });
    setIcon(icon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (icon && markerArray.length) {
    return (
      <>
        {markerArray.map((point, i) => (
          <Marker
            zIndexOffset={500}
            keyboard={false}
            icon={icon}
            draggable
            key={`${point.lat}-${point.lng}`}
            position={point}
            eventHandlers={{
              click: () => {},
              mouseOver: (e) => e.target.openPopup(),
              mouseOut: (e) => e.target.closePopup(),
              drag: (e) => updateLine(e, i),
            }}
          >
            {/* Show distance tooltip on last marker */}
            {markerArray.length > 1 && i === markerArray.length - 1 && (
              <Tooltip direction="top" offset={[0, -40]} permanent>
                <Typography>{`${getDistance()}m`}</Typography>
              </Tooltip>
            )}
            {/* Show distance popup on markers when clicked */}
            {i !== 0 && i !== markerArray.length - 1 && (
              <Popup closeButton={false} autoPan={false}>
                <StyledDistancePopup>
                  <Typography>{`${getDistance(i)}m`}</Typography>
                </StyledDistancePopup>
              </Popup>
            )}
          </Marker>
        ))}
        <Polyline
          color={theme.palette.measuringStroke.border}
          weight="14"
          positions={lineArray}
        />
        <Polyline
          color={theme.palette.measuringStroke.background}
          weight="10"
          positions={lineArray}
        />
        <Polyline
          color={theme.palette.measuringStroke.main}
          dashArray="12"
          positions={lineArray}
        />
      </>
    );
  }
  return null;
}
const StyledDistancePopup = styled.div(() => ({
  padding: 8,
}));

DistanceMeasure.propTypes = {
  markerArray: PropTypes.arrayOf(PropTypes.any).isRequired,
  lineArray: PropTypes.arrayOf(PropTypes.any).isRequired,
  setMarkerArray: PropTypes.func.isRequired,
  setLineArray: PropTypes.func.isRequired,
};

export default DistanceMeasure;
