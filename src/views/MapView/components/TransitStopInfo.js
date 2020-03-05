/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accessible from '@material-ui/icons/Accessible';
import { FormattedMessage } from 'react-intl';
import { withStyles, Typography } from '@material-ui/core';
import { fetchStopData } from '../utils/transitFetch';
import styles from '../styles';

const TransitStopInfo = ({ stop, classes, getLocaleText }) => {
  const [stopData, setStopData] = useState({ departureTimes: null, wheelchair: null });

  useEffect(() => {
    fetchStopData(stop)
      .then((stopData) => {
        if (stopData) {
          let departureTimes = stopData.data.stop.stoptimesWithoutPatterns;
          departureTimes.sort(
            (a, b) => (a.realtimeDeparture + a.serviceDay) - (b.realtimeDeparture + b.serviceDay),
          );
          departureTimes = departureTimes.slice(0, 5);

          setStopData({
            departureTimes,
            wheelchair: stopData.data.stop.wheelchairBoarding,
          });
        }
      });
  }, []);

  const renderDepartureTimes = () => {
    let icon;
    switch (stop.vehicleType) {
      case 3: // Bus stops
        icon = <span className={`${classes.transitIconInfo} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
      case 0: // Tram stops
        icon = <span className={`${classes.transitIconInfo} ${classes.tramIconColor} icon-icon-hsl-tram`} />;
        break;
      case 109: // Train stops
        icon = <span className={`${classes.transitIconInfo} ${classes.trainIconColor} icon-icon-hsl-train`} />;
        break;
      case 1: // Subway stops
        icon = <span className={`${classes.transitIconInfo} ${classes.metroIconColor} icon-icon-hsl-metro`} />;
        break;
      case -999: case 4: // Ferry stops
        icon = <span className={`${classes.transitIconInfo} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
        break;
      default:
        icon = <span className={`${classes.transitIconInfo} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
    }

    if (stopData.departureTimes && stopData.departureTimes.length) {
      return stopData.departureTimes.map((departure, index) => {
        const time = new Date((departure.realtimeDeparture + departure.serviceDay) * 1000);
        const hours = time.getHours();
        const minutes = time.getMinutes();

        return (
          <div key={index} className={classes.departureItem}>
            <Typography>
              {/* This adds 0 before single digit times */}
              {`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`}
            </Typography>
            <div className={classes.departureVehicle}>
              {icon}
              <Typography className={classes.vehicleName}>
                {departure.trip.route.shortName}
              </Typography>
            </div>
            <Typography className={classes.routeName}>
              {departure.pickupType === 'NONE' ? <FormattedMessage id="map.transit.endStation" /> : departure.headsign}
            </Typography>
            {departure.trip.wheelchairAccessible === 'POSSIBLE' ? (
              <Accessible className={classes.transitIconInfo} />
            ) : null}
          </div>
        );
      });
    } return null;
  };

  return (
    <div className={classes.tranistInfoContainer}>
      <div className={classes.transitInfoTitle}>
        <Typography className={classes.bold}>
          {typeof stop.name === 'object' ? getLocaleText(stop.name) : stop.name}
        </Typography>
        {stopData.wheelchair === 'POSSIBLE' ? (
          <Accessible className={classes.transitIconInfo} />
        ) : null}
      </div>
      {renderDepartureTimes()}
    </div>
  );
};

export default withStyles(styles)(TransitStopInfo);

TransitStopInfo.propTypes = {
  stop: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

TransitStopInfo.defaultProps = {
  stop: {},
};
