import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@material-ui/core';
import { renderToStaticMarkup } from 'react-dom/server';


const DistanceMeasure = (props) => {
  const {
    classes, markerArray, setMarkerArray, lineArray, setLineArray,
  } = props;

  const {
    Marker, Polyline, Tooltip, Popup, useLeaflet,
  } = global.rL;

  const theme = useTheme();
  const { map } = useLeaflet();

  const [clickedPoint, setClickedPoint] = useState(null);
  const [icon, setIcon] = useState(null);

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

  useEffect(() => {
    // When the map is clicked, add new marker and update line between markers
    if (clickedPoint) {
      setMarkerArray([...markerArray, clickedPoint]);
      setLineArray([...lineArray, clickedPoint]);
    }
  }, [clickedPoint]);

  useEffect(() => {
    map.on('click', e => setClickedPoint(e.latlng));
    setMarkerArray(lineArray);
  }, []);


  useEffect(() => {
    // Create marker icon on component mount
    const icon = global.L.divIcon({
      iconSize: global.L.point([50, 50]),
      iconAnchor: global.L.point([25, 56]),
      popupAnchor: global.L.point([0, -40]),
      className: classes.addressIcon,
      html: renderToStaticMarkup(
        <>
          <span className={`${classes.distanceMarkerBackground} icon-icon-hsl-background`} />
          <span className="icon-icon-address" />
        </>,
      ),
    });
    setIcon(icon);
  }, []);

  if (icon && markerArray.length) {
    return (
      <>
        {markerArray.map((point, i) => (
          <Marker
            zIndexOffset={500}
            keyboard={false}
            icon={icon}
            onDrag={ev => updateLine(ev, i)}
            onClick={() => {}}
            draggable
            key={`${point.lat}-${point.lng}`}
            position={point}
            onMouseOver={(e) => { e.target.openPopup(); }}
            onMouseOut={(e) => { e.target.closePopup(); }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            {/* Show distance tooltip on last marker */}
            {markerArray.length > 1 && i === markerArray.length - 1 && (
            <Tooltip
              direction="top"
              offset={[0, -40]}
              permanent
            >
              <Typography>{`${getDistance()}m`}</Typography>
            </Tooltip>
            )}
            {/* Show distance popup on markers when clicked */}
            {i !== 0 && i !== markerArray.length - 1 && (
            <Popup closeButton={false} autoPan={false}>
              <div className={classes.distancePopup}>
                <Typography>
                  {`${getDistance(i)}m`}
                </Typography>
              </div>
            </Popup>
            )}
          </Marker>
        ))}
        <Polyline color={theme.palette.measuringStroke.border} weight="14" positions={lineArray} />
        <Polyline color={theme.palette.measuringStroke.background} weight="10" positions={lineArray} />
        <Polyline color={theme.palette.measuringStroke.main} dashArray="12" positions={lineArray} />
      </>
    );
  }
  return null;
};

DistanceMeasure.propTypes = {
  markerArray: PropTypes.arrayOf(PropTypes.any).isRequired,
  lineArray: PropTypes.arrayOf(PropTypes.any).isRequired,
  setMarkerArray: PropTypes.func.isRequired,
  setLineArray: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DistanceMeasure;
