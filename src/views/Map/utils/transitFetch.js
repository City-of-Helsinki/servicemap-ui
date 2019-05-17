/* eslint-disable no-underscore-dangle */
const fetchStops = async (bounds) => {
  const fetchBounds = bounds.getBounds();

  const viewSize = {
    width: Math.abs(fetchBounds._southWest.lng - fetchBounds._northEast.lng),
    height: Math.abs(fetchBounds._southWest.lat - fetchBounds._northEast.lat),
  };

  // Widen the area of search
  fetchBounds._southWest.lat -= viewSize.height;
  fetchBounds._southWest.lng -= viewSize.width;
  fetchBounds._northEast.lat += viewSize.height;
  fetchBounds._northEast.lng += viewSize.width;

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

  const response = await fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/graphql' },
    body: requestBody(stop.gtfsId),
  });
  const data = await response.json();

  if (stop.secondaryId) {
    const response = await fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/graphql' },
      body: requestBody(stop.secondaryId),
    });
    const secondData = await response.json();
    const combinedData = data;
    combinedData.data.stop.stoptimesWithoutPatterns = [
      ...combinedData.data.stop.stoptimesWithoutPatterns,
      ...secondData.data.stop.stoptimesWithoutPatterns,
    ];
    return combinedData;
  }

  return data;
};

export {
  fetchStops,
  fetchStopData,
};
