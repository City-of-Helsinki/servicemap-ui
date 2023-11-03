/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accessible from '@mui/icons-material/Accessible';
import { FormattedMessage } from 'react-intl';
import { Typography, ButtonBase } from '@mui/material';
import { Close } from '@mui/icons-material';
import { fetchStopData } from '../../../utils/transitFetch';
import useLocaleText from '../../../../../utils/useLocaleText';
import { getIcon } from '../../../../../components';
import { StyledCloseText } from '../../styled/styled';

const TransitStopInfo = ({
  stop, onCloseClick, type, classes,
}) => {
  const getLocaleText = useLocaleText();
  const [stopData, setStopData] = useState({ departureTimes: null, wheelchair: null });

  const getAccessibilityIcon = (value) => {
    if (value === 'POSSIBLE') {
      return <Accessible className={classes.infoIcon} />;
    } if (value === 'NOT_POSSIBLE') {
      return getIcon('noWheelchair', { className: classes.infoIcon });
    }
    return null;
  };

  useEffect(() => {
    if (type === 'bikeStation') return;
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
        icon = <span className={`${classes.infoIcon} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
      case 0: // Tram stops
        icon = <span className={`${classes.infoIcon} ${classes.tramIconColor} icon-icon-hsl-tram`} />;
        break;
      case 109: // Train stops
        icon = <span className={`${classes.infoIcon} ${classes.trainIconColor} icon-icon-hsl-train`} />;
        break;
      case 1: // Subway stops
        icon = <span className={`${classes.infoIcon} ${classes.metroIconColor} icon-icon-hsl-metro`} />;
        break;
      case -999: case 4: // Ferry stops
        icon = <span className={`${classes.infoIcon} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
        break;
      default:
        icon = <span className={`${classes.infoIcon} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
    }

    if (stopData.departureTimes && stopData.departureTimes.length) {
      return stopData.departureTimes.map((departure, index) => {
        const time = new Date((departure.realtimeDeparture + departure.serviceDay) * 1000);
        const hours = time.getHours();
        const minutes = time.getMinutes();

        return (
          <div key={index} className={classes.departureItem}>
            <Typography className={classes.departureTime}>
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
            {getAccessibilityIcon(departure.trip.wheelchairAccessible)}
          </div>
        );
      });
    } return null;
  };


  return (
    <div aria-hidden className={classes.tranistInfoContainer}>
      <ButtonBase onClick={() => onCloseClick()} className={classes.closeButton}>
        <StyledCloseText><FormattedMessage id="general.close" /></StyledCloseText>
        <Close className={classes.infoIcon} />
      </ButtonBase>
      <div className={classes.transitInfoTitle}>
        <Typography className={classes.bold}>
          {typeof stop.name === 'object' ? getLocaleText(stop.name) : stop.name}
        </Typography>
        {getAccessibilityIcon(stopData.wheelchair)}
      </div>
      {type === 'bikeStation'
        ? null
        : renderDepartureTimes()}
    </div>
  );
};

TransitStopInfo.propTypes = {
  stop: PropTypes.objectOf(PropTypes.any),
  onCloseClick: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  type: PropTypes.string,
};

TransitStopInfo.defaultProps = {
  stop: {},
  type: null,
};

export default TransitStopInfo;
