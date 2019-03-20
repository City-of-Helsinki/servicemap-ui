/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsRailway from '@material-ui/icons/DirectionsRailway';
import DirectionsSubway from '@material-ui/icons/DirectionsSubway';

// TODO: better styling + styling location
const TransitStopInfo = (props) => {
  const { stop, t } = props;
  return (
    <div style={{ width: '230px' }}>
      <p style={{
        paddingBottom: ' 2%',
        marginBottom: '5%',
        marginTop: '10%',
        fontSize: '14px',
        textTransform: 'uppercase',
        color: '#007AC9',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: 'rgba(0, 0, 0, 0.12)',
      }}
      >
        {stop.name}
      </p>

      {stop.stoptimesWithoutPatterns.map((arrival, index) => {
        const time = new Date((arrival.realtimeArrival + arrival.serviceDay) * 1000);
        const hours = time.getHours();
        const minutes = time.getMinutes();

        let TransitIcon = null;
        if (arrival.trip.route.mode === 'BUS') {
          TransitIcon = (
            <DirectionsBus style={{
              height: '20', display: 'inline', float: 'left', color: '#007AC9',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'TRAM') {
          TransitIcon = (
            <DirectionsRailway style={{
              height: '20', display: 'inline', float: 'left', color: '#00985F',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'RAIL') {
          TransitIcon = (
            <DirectionsRailway style={{
              height: '20', display: 'inline', float: 'left', color: '#8C4799',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'SUBWAY') {
          TransitIcon = (
            <DirectionsSubway style={{
              height: '20', display: 'inline', float: 'left', color: '#FF6319',
            }}
            />
          );
        }

        return (
          <div key={index} style={{ display: 'flex' }}>
            <p style={{ marginTop: '0px', marginBottom: '2px', width: '15%' }}>
              {/* This adds 0 before single digit times */}
              {`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`}
            </p>
            <div style={{ marginTop: '0px', marginBottom: '2px', width: '30%' }}>
              {TransitIcon}
              <p style={{ display: 'inline', fontSize: '120%' }}>{arrival.trip.route.shortName}</p>
            </div>
            <p style={{
              marginTop: '0px', marginBottom: '2px', width: '55%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: '20px', height: '20px',
            }}
            >
              {arrival.pickupType === 'NONE' ? t('transit.endStation') : arrival.headsign}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TransitStopInfo;

TransitStopInfo.propTypes = {
  stop: PropTypes.objectOf(PropTypes.any),
  t: PropTypes.func,
};

TransitStopInfo.defaultProps = {
  stop: {},
  t: null,
};
