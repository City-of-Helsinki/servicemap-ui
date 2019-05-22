/* eslint-disable global-require */
const fetchStops = async (map) => {
  const L = require('leaflet');

  const fetchBounds = map.getBounds();
  const cornerBottom = fetchBounds.getSouthWest();
  const cornerTop = fetchBounds.getNorthEast();

  const viewSize = {
    width: Math.abs(cornerBottom.lng - cornerTop.lng),
    height: Math.abs(cornerBottom.lat - cornerTop.lat),
  };

  // Increase the search area by the amount of current view size
  cornerBottom.lat -= viewSize.height;
  cornerBottom.lng -= viewSize.width;
  cornerTop.lat += viewSize.height;
  cornerTop.lng += viewSize.width;

  const wideBounds = L.latLngBounds(cornerTop, cornerBottom);

  // Bounds used in subway entrance fetch
  const fetchBox = `${wideBounds.getWest()},${wideBounds.getSouth()},${wideBounds.getEast()},${wideBounds.getNorth()}`;

  const data = await Promise.all([
    // Fetch for transit stops
    fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/graphql' },
      body:
      `{
        stopsByBbox(minLat: ${wideBounds.getSouthWest().lat}, minLon: ${wideBounds.getSouthWest().lng}, maxLat: ${wideBounds.getNorthEast().lat}, maxLon: ${wideBounds.getNorthEast().lng} ) {
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
