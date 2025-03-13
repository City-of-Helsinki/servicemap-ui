import { unitsFetch } from '../../../utils/fetch';
import config from '../../../../config';
import { getBboxFromBounds } from '../../../utils/mapUtility';

const digitransitApiHeaders = () => ({
  'Content-Type': 'application/graphql',
});

/* eslint-disable global-require */
// Fetch list of stops
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
  const fetchBox = getBboxFromBounds(wideBounds, true);

  let stopData = null;

  await Promise.all([
    // Fetch for transit stops
    fetch(`${config.digitransitAPI.root}`, {
      method: 'post',
      headers: digitransitApiHeaders(),
      body:
      `{
        stopsByBbox(minLat: ${wideBounds.getSouthWest().lat}, minLon: ${wideBounds.getSouthWest().lng}, maxLat: ${wideBounds.getNorthEast().lat}, maxLon: ${wideBounds.getNorthEast().lng} ) {
          vehicleMode
          gtfsId
          name
          lat
          lon
          patterns {
            headsign
            route {
              shortName
            }
          }
        }
      }`,
    }).then(response => response.json()),
    // Fetch for subway entrances
    unitsFetch({
      service: 437,
      page_size: 50,
      bbox: `${fetchBox}`,
    }),
  ])
    .then((data) => {
      // Handle subwaystops and return list of all stops
      const stops = data[0].data.stopsByBbox;
      const subwayStations = stops.filter(stop => stop.vehicleMode === 'SUBWAY');

      // Remove subwaystations from stops list since they will be replaced with subway entrances
      const filteredStops = stops.filter(stop => stop.vehicleMode !== 'SUBWAY');

      const entrances = data[1].results;

      // Add subway entrances to the list of stops
      entrances.forEach((entrance) => {
        const closest = {
          distance: null,
          stop: null,
        };
        if (subwayStations.length) {
        // Find the subwaystation closest to the entrance
          subwayStations.forEach((stop) => {
            if (!stop.gtfsId) return;
            const distance = Math.sqrt(
              ((stop.lat - entrance.location.coordinates[1]) ** 2)
          + ((stop.lon - entrance.location.coordinates[0]) ** 2),
            );
            if (!closest.distance || distance < closest.distance) {
              closest.distance = distance;
              closest.stop = stop;
            }
          });
          // Get the same station's stop for other direction (west/east)
          const otherStop = subwayStations.find(
            station => station.name === closest.stop.name && station?.gtfsId !== closest.stop.gtfsId,
          );
          // Create a new stop from the entrance
          // Give it the stop data of the corresponding station and add it to the list of stops
          const newStop = {
            gtfsId: closest.stop.gtfsId,
            secondaryId: otherStop.gtfsId,
            lat: entrance.location.coordinates[1],
            lon: entrance.location.coordinates[0],
            name: entrance.name,
            patterns: closest.stop.patterns,
            vehicleMode: closest.stop.vehicleMode,
          };
          filteredStops.push(newStop);
        }
      });
      stopData = filteredStops;
    });
  return stopData;
};

// Fetch one stop data
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
          wheelchairAccessible
          route {
            mode
            shortName
          }
        }
      }
    }
  }`);

  const response = await fetch(`${config.digitransitAPI.root}`, {
    method: 'post',
    headers: digitransitApiHeaders(),
    body: requestBody(stop.gtfsId),
  });
  const data = await response.json();

  if (stop.secondaryId) {
    const response = await fetch(`${config.digitransitAPI.root}`, {
      method: 'post',
      headers: digitransitApiHeaders(),
      body: requestBody(stop.secondaryId),
    });
    const secondData = await response.json();
    // Combine both timetables into one.
    const combinedData = data;
    combinedData.data.stop.stoptimesWithoutPatterns = [
      ...combinedData.data.stop.stoptimesWithoutPatterns,
      ...secondData.data.stop.stoptimesWithoutPatterns,
    ];
    return combinedData;
  }

  return data;
};


const fetchBikeStations = async () => fetch(`${config.digitransitAPI.root}`, {
  method: 'post',
  headers: digitransitApiHeaders(),
  body:
    `{
      bikeRentalStations {
        name
        stationId
        lat
        lon
      }
    }`,
}).then(response => response.json());

export {
  fetchStops,
  fetchStopData,
  fetchBikeStations,
};
