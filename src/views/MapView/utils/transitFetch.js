import config from '../../../../config';
import { unitsFetch } from '../../../utils/fetch';
import { getBboxFromBounds } from '../../../utils/mapUtility';

const digitransitApiHeaders = () => ({
  'Content-Type': 'application/graphql',
});

// Digitransit enforces rate/quota limiting per subscription key and can return
// 403 (or 429) during traffic peaks even for normal use. Retry those responses
// with exponential backoff + jitter, as recommended by Digitransit.
const MAX_RETRIES = 3;
const BASE_DELAY = 500; // ms
const RETRYABLE_STATUS = new Set([403, 429]);

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// POST a GraphQL query to the Digitransit proxy, retrying transient rate-limit
// responses. Non-retryable responses (and the last retry) are returned as-is so
// callers keep their existing response.ok handling.
const digitransitFetch = async (body) => {
  let response = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    response = await fetch(`${config.digitransitAPI.root}`, {
      method: 'post',
      headers: digitransitApiHeaders(),
      body,
    });

    if (
      response.ok ||
      !RETRYABLE_STATUS.has(response.status) ||
      attempt === MAX_RETRIES
    ) {
      return response;
    }

    const backoff = BASE_DELAY * 2 ** attempt + Math.random() * BASE_DELAY;
    // eslint-disable-next-line no-await-in-loop
    await delay(backoff);
  }
  return response;
};

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

  try {
    const [transitResponse, subwayResponse] = await Promise.all([
      // Fetch for transit stops
      digitransitFetch(`{
          stopsByBbox(
            minLat: ${wideBounds.getSouthWest().lat},
            minLon: ${wideBounds.getSouthWest().lng},
            maxLat: ${wideBounds.getNorthEast().lat},
            maxLon: ${wideBounds.getNorthEast().lng}
          ) {
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
        }`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      }),
      // Fetch for subway entrances
      unitsFetch({
        service: 437,
        page_size: 50,
        bbox: `${fetchBox}`,
      }),
    ]);

    // If the subway units fetch failed (the fetch wrapper may swallow errors
    // and return undefined), treat this as an explicit failure and throw
    if (!subwayResponse) {
      throw new Error('API error: unitsFetch failed to fetch subway entrances');
    }

    // Handle subwaystops and return list of all stops
    const stops = transitResponse.data.stopsByBbox;
    const subwayStations = stops.filter(
      (stop) => stop.vehicleMode === 'SUBWAY'
    );

    // Remove subwaystations from stops list since they will be replaced with subway entrances
    const filteredStops = stops.filter((stop) => stop.vehicleMode !== 'SUBWAY');

    // Defensive: if for some reason subwayResponse results is missing,
    // fall back to an empty array to avoid runtime TypeErrors.
    const entrances = subwayResponse.results ?? [];

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
            (stop.lat - entrance.location.coordinates[1]) ** 2 +
              (stop.lon - entrance.location.coordinates[0]) ** 2
          );
          if (!closest.distance || distance < closest.distance) {
            closest.distance = distance;
            closest.stop = stop;
          }
        });
        // Get the same station's stop for other direction (west/east)
        const otherStop = subwayStations.find(
          (station) =>
            station.name === closest.stop.name &&
            station?.gtfsId !== closest.stop.gtfsId
        );
        // Create a new stop from the entrance
        // Give it the stop data of the corresponding station and add it to the list of stops
        // The other-direction platform may be outside the search area, so guard
        // against it being undefined. fetchStopData falls back to the primary
        // stop when secondaryId is absent.
        const newStop = {
          gtfsId: closest.stop.gtfsId,
          ...(otherStop && { secondaryId: otherStop.gtfsId }),
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
  } catch (error) {
    console.error(error);

    throw error;
  }
  return stopData;
};

// Short-lived cache for single-stop timetable data. Popups re-fetch every time
// they open, so caching per stop reduces redundant requests (and in-flight
// deduplication prevents parallel fetches for the same stop). The TTL is kept
// short because departure times are time-sensitive.
const STOP_DATA_TTL = 30 * 1000; // ms
const stopDataCache = new Map(); // cache key -> { timestamp, promise }

const getStopCacheKey = (stop) =>
  `${stop.gtfsId}${stop.secondaryId ? `+${stop.secondaryId}` : ''}`;

const fetchStopDataUncached = async (stop) => {
  const requestBody = (id) => `{
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
  }`;

  try {
    const response = await digitransitFetch(requestBody(stop.gtfsId));

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (stop.secondaryId) {
      const response2 = await digitransitFetch(requestBody(stop.secondaryId));

      if (!response2.ok) {
        return data; // Return primary data only
      }

      const secondData = await response2.json();
      // Combine both timetables into one.
      const combinedData = data;
      combinedData.data.stop.stoptimesWithoutPatterns = [
        ...combinedData.data.stop.stoptimesWithoutPatterns,
        ...secondData.data.stop.stoptimesWithoutPatterns,
      ];
      return combinedData;
    }

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

const fetchStopData = (stop) => {
  const key = getStopCacheKey(stop);
  const cached = stopDataCache.get(key);
  if (cached && Date.now() - cached.timestamp < STOP_DATA_TTL) {
    return cached.promise;
  }

  const promise = fetchStopDataUncached(stop);
  stopDataCache.set(key, { timestamp: Date.now(), promise });

  // Single eviction path (skips if a newer request already replaced the entry):
  // drop failures immediately so the next open retries, and drop successes
  // after the TTL so payloads don't accumulate for the whole session.
  const evict = () => {
    if (stopDataCache.get(key)?.promise === promise) {
      stopDataCache.delete(key);
    }
  };
  promise.then(() => {
    setTimeout(evict, STOP_DATA_TTL);
  }, evict);

  return promise;
};

const fetchBikeStations = async () => {
  try {
    const response = await digitransitFetch(`{
      bikeRentalStations {
        name
        stationId
        lat
        lon
      }
    }`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export { fetchBikeStations, fetchStopData, fetchStops };
