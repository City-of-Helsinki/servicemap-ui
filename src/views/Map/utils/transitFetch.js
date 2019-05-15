/* eslint-disable no-underscore-dangle */
const fetchStops = async (bounds) => {
  const fetchBounds = bounds.getBounds();

  const viewSize = {
    width: Math.abs(fetchBounds._southWest.lng - fetchBounds._northEast.lng),
    height: Math.abs(fetchBounds._southWest.lat - fetchBounds._northEast.lat),
  };

  // Widen the area of search to be three times the size of the view
  fetchBounds._southWest.lat -= viewSize.height * 2;
  fetchBounds._southWest.lng -= viewSize.width * 2;
  fetchBounds._northEast.lat += viewSize.height * 2;
  fetchBounds._northEast.lng += viewSize.width * 2;

  // Bounds used in subway entrance fetch
  const fetchBox = `${fetchBounds.getWest()},${fetchBounds.getSouth()},${fetchBounds.getEast()},${fetchBounds.getNorth()}`;

  const data = await Promise.all([
    // Fetch for transit stops
    fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/graphql' },
      body:
      `{
        stopsByBbox(minLat: ${fetchBounds._southWest.lat}, minLon: ${fetchBounds._southWest.lng}, maxLat: ${fetchBounds._northEast.lat}, maxLon: ${fetchBounds._northEast.lng} ) {
          vehicleType
          gtfsId
          name
          lat
          lon
          patterns {
            headsign
            route {
              gtfsId
              shortName
            }
          }
        }
      }`,
      /* body:
      `{
        stopsByBbox(minLat: ${fetchBounds._southWest.lat}, minLon: ${fetchBounds._southWest.lng}, maxLat: ${fetchBounds._northEast.lat}, maxLon: ${fetchBounds._northEast.lng} ) {
          vehicleType
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
        }`, */
    }).then(response => response.json()),
    // Fetch for subway entrances
    fetch(`https://api.hel.fi/servicemap/v2/unit/?service=437&page_size=200&bbox=${fetchBox}`)
      .then(response => response.json()).then(),
  ]);
  return data;
};

const fetchStopData = async (stop) => {
  const requestBody = id => (`{
    stop(id: "${id}") {
      name
      wheelchairBoarding
      stoptimesWithoutPatterns {
        scheduledDeparture
        realtimeDeparture
        realtime
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
    }
  }`);

  // if (stop.secondaryId) {
  /* const stopData = await Promise.all([
      fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/graphql' },
        body: requestBody,
      }).then(response => response.json()),

      fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/graphql' },
        body: requestBody,
      }).then(response => response.json()),
    ]);
    return stopData; */
  // }
  await fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/graphql' },
    body: requestBody(stop.gtfsId),
  })
    .then(response => response.json())
    .then((stopData) => {
      if (stop.secondaryId) {
        fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
          method: 'post',
          headers: { 'Content-Type': 'application/graphql' },
          body: requestBody(stop.secondaryId),
        }).then(response => response.json())
          .then((data) => {
            const times = [...stopData.data.stop.stoptimesWithoutPatterns, ...data.data.stop.stoptimesWithoutPatterns];
            console.log(stopData, data);
            return times;
          });
      } else {
        console.log('returning one');
        return stopData;
      }
      // return stopData;
    });
};

export {
  fetchStops,
  fetchStopData,
};
