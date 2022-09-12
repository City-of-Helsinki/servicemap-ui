import AbortController from 'abort-controller';
import paths from '../config/paths';
import { eventFetch, selectedUnitFetch, unitEventsFetch, accessibilitySentencesFetch, reservationsFetch, idFetch } from '../src/utils/fetch';
import { changeSelectedEvent } from '../src/redux/actions/event';
import { changeSelectedUnit } from '../src/redux/actions/selectedUnit';
import { changeAccessibilitySentences } from '../src/redux/actions/selectedUnitAccessibility';
import { events, reservations, hearingMaps } from '../src/redux/actions/fetchDataActions';
import HearingMapAPI from '../src/utils/newFetch/HearingMapAPI';

const timeoutTimer = process.env.SSR_FETCH_TIMEOUT;

// Get ID from request Url
const getParamID = (req, regex) => {
  const r = req.originalUrl.match(regex);
  if(regex && (!r || r.length < 2)) {
    return null;
  }

  return r[1] || r[2];
};

// Create abort timeout
const abortTimeout = (next) => {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => {
      controller.abort();
      next();
    },
    timeoutTimer,
  );

  return {controller, timeout};
}

// Send response forward
const sendResponse = (fetchCount, next, timeout) => {
  let current = 0;
  return () => {
    current += 1;
    // If all fetches done proceed to next
    if(current >= fetchCount) {
      clearTimeout(timeout); // Clear timeout
      next();
    }
  }
};

// Fetch data for event
export const fetchEventData = (req, res, next) => {
  try {
    const id = getParamID(req, paths.event.regex);
    if (!id) {
      throw Error('Current path not valid for event fetching');
    }
  
    const {controller, timeout} = abortTimeout(next);
    const store = req._context;
    const response = sendResponse(2, next, timeout);

    const onError = () => {
      response();
      return;
    }
  
    // FETCH END
    const fetchEnd = (data) => {
      if (!store || !store.dispatch || !data) {
        next();
        return;
      }
      store.dispatch(changeSelectedEvent(data));
      response();
      
      // Attempt fetching selected unit if it doesn't exist or isn't correct one
      const unit = data.location;
      if (typeof unit === 'object' && unit.id) {
        const fetchSuccess = (data) => {
          if (store && store.dispatch && data) {
            store.dispatch(changeSelectedUnit(data));
          }
          response();
        }
        // Attempt fetching selected unit if it doesn't exist or isn't correct one
        const unitId = unit.id.split(':').pop();
        selectedUnitFetch(null, null, fetchSuccess, onError, null, unitId, controller);
      }
    }
  
    // START FETCH
    const options = {
      include: 'location,location.accessibility_shortcoming_count',
    };
    eventFetch(options, null, fetchEnd, onError, null, id, controller);

  } catch (e) {
    console.log('Error in fetchEventData', e.message);
    next();
  }
}

export const fetchSelectedUnitData = (req, res, next) => {
  try {
    const id = getParamID(req, paths.unit.regex);
    
    if (!id) {
      throw Error('Current path not valid for unit page fetching');
    }

    const store = req._context;
    const { controller, timeout } = abortTimeout(next);
    const response = sendResponse(4, next, timeout);

    const fetchOnError = () => {
      response();
      return;
    }

    // Fetch unit view data
    const selectedUnitFetchEnd = async (data) => {
      if (!store || !store.dispatch || !data) {
        response();
        return;
      }
      data.complete = true;
      store.dispatch(changeSelectedUnit(data));
      if (data.keywords.fi?.includes('kuuluvuuskartta')) {
        const hearingMapAPI = new HearingMapAPI();
        const {
          fetchSuccess, fetchError,
        } = hearingMaps;
        try {
          const data = await hearingMapAPI.hearingMaps(id);
          store.dispatch(fetchSuccess({id, data}));
        } catch (e) {
          store.dispatch(fetchError(e.message));
        }
      }
      response();
    }
    selectedUnitFetch(null, null, selectedUnitFetchEnd, fetchOnError, null, id, controller);

    // Fetch events for unit
    const eventFetchEnd = (data) => {
      if (!store || !store.dispatch || !data) {
        response();
        return;
      }
      const {
        fetchSuccess, fetchProgressUpdate,
      } = events;
      store.dispatch(fetchProgressUpdate(data.data.length, data.meta.count));
      store.dispatch(fetchSuccess(data.data));
      response();
    }
    unitEventsFetch({ location: `tprek:${id}` }, null, eventFetchEnd, fetchOnError, null, null, controller);

    // Fetch accessibility sentences for unit
    const accessibilitySentenceFetchEnd = (data) => {
      if (!store || !store.dispatch || !data) {
        response();
        return;
      }
      store.dispatch(changeAccessibilitySentences(data));
      response();
    }
    accessibilitySentencesFetch(null, null, accessibilitySentenceFetchEnd, fetchOnError, null, id, controller);

    // Fetch reservations for unit
    const reservationFetchEnd = (data) => {
      if (!store || !store.dispatch || !data) {
        response();
        return;
      }
      const {
        fetchSuccess, fetchProgressUpdate,
      } = reservations;
      store.dispatch(fetchProgressUpdate(data.results.length, data.count));
      store.dispatch(fetchSuccess(data.results));
      response();
    }
    reservationsFetch({ unit: `tprek:${id}` }, null, reservationFetchEnd, fetchOnError, null, null, controller)

  } catch(e) {
    console.log('Error in fetchSelectedUnitData', e.message);
    next();
  }
}

// This fetches all IDs. Used when creating sitemaps
export const fetchIDs = async (type) => {
  let returnData = null;
  
  const onSuccess = (data) => {
    returnData = data;
  } 
  const onNext = () => {}
  const onError = (e) => {
    console.log('error:',e)
    return;
  }
  try {
    await idFetch(null, null, onSuccess, onError, onNext, type, null)
    return returnData;
  } catch(e) {
    console.log('Error in sitemap id fetch', e.message);
  }
}
