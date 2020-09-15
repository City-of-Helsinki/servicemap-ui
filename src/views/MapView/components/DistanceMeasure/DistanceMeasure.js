import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';


const DistanceMeasure = (props) => {
  const { mapClickPoint, classes } = props;

  const {
    Marker, Polyline, Tooltip, Popup,
  } = global.rL;

  const [markerArray, setMarkerArray] = useState([]);
  const [lineArray, setLineArray] = useState([]);
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
    if (mapClickPoint) {
      setMarkerArray([...markerArray, mapClickPoint]);
      setLineArray([...lineArray, mapClickPoint]);
    }
  }, [mapClickPoint]);


  useEffect(() => {
    // Create marker icon on component mount
    const icon = global.L.divIcon({
      iconSize: global.L.point([50, 50]),
      iconAnchor: global.L.point([25, 56]),
      popupAnchor: global.L.point([0, -40]),
      className: classes.distanceIcon,
      html: '<span class=icon-icon-address></span>',
    });
    setIcon(icon);
  }, []);


  return (
    <>
      {markerArray.map((point, i) => (
        <Marker
          keyboard={false}
          icon={icon}
          onDrag={ev => updateLine(ev, i)}
          onClick={() => {}}
          draggable
          key={point.lat}
          position={point}
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
      <Polyline className={classes.distanceLineBorder} positions={lineArray} />
      <Polyline className={classes.distanceLine} positions={lineArray} />
    </>
  );
};

DistanceMeasure.propTypes = {
  mapClickPoint: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

DistanceMeasure.defaultProps = {
  mapClickPoint: null,
};

export default DistanceMeasure;
