/* eslint-disable no-underscore-dangle */
const fetchStops = async (bounds) => {
  const response = await fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/graphql' },
    body:
      `{ 
        stopsByBbox(minLat: ${bounds._southWest.lat - 0.002070372076}, minLon: ${bounds._southWest.lng - 0.002070372076}, maxLat: ${bounds._northEast.lat + 0.002070372076}, maxLon: ${bounds._northEast.lng + 0.002070372076} ) {
          gtfsId
          name
          stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            pickupType
            headsign
            trip {
              route {
                mode
                shortName
              }
            }
          }
          lat
          lon
          patterns {
            route {
              mode
            }
          }
        } 
        }`,
  });
  const data = await response.json();
  return data;
};

export default fetchStops;
