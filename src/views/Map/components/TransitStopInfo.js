import React from 'react';
import PropTypes from 'prop-types';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsRailway from '@material-ui/icons/DirectionsRailway';
import DirectionsSubway from '@material-ui/icons/DirectionsSubway';

const TransitStopInfo = (props) => {
  const { stop } = props;
  return (
    <div style={{ width: '100px' }}>
      <p style={{ marginBottom: '10%', marginTop: '0px' }}>{stop.name}</p>

      {stop.stoptimesWithoutPatterns.map((arrival, index) => {
        const time = new Date((arrival.realtimeArrival + arrival.serviceDay) * 1000);

        let TransitIcon = null;
        if (arrival.trip.route.mode === 'BUS') {
          TransitIcon = (
            <DirectionsBus style={{
              height: '20', display: 'inline', float: 'left', color: 'blue',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'TRAM') {
          TransitIcon = (
            <DirectionsRailway style={{
              height: '20', display: 'inline', float: 'left', color: 'green',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'RAIL') {
          TransitIcon = (
            <DirectionsRailway style={{
              height: '20', display: 'inline', float: 'left', color: 'purple',
            }}
            />
          );
        } else if (arrival.trip.route.mode === 'SUBWAY') {
          TransitIcon = (
            <DirectionsSubway style={{
              height: '20', display: 'inline', float: 'left', color: 'orange',
            }}
            />
          );
        }

        return (
          <div key={index} style={{ display: 'flex' }}>
            <p style={{ marginTop: '0px', marginBottom: '2px', width: '40%' }}>{`${time.getHours()}:${time.getMinutes()}`}</p>
            <div style={{ marginTop: '0px', marginBottom: '2px', width: '60%' }}>
              {TransitIcon}
              <p style={{ display: 'inline', fontSize: '120%' }}>{arrival.trip.route.shortName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransitStopInfo;

TransitStopInfo.propTypes = {
  stop: PropTypes.objectOf(PropTypes.any),
};

TransitStopInfo.defaultProps = {
  stop: {},
};
