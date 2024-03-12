/* eslint-disable camelcase */
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import URI from 'urijs';

const isClient = () => typeof window !== 'undefined';

export const isRetina = () => {
  if (isClient && window.devicePixelRatio > 1) {
    return true;
  }
  return false;
};

export const uppercaseFirst = val => val.charAt(0).toUpperCase() + val.slice(1);

export const validateEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Function for parsing react router search params
export const parseSearchParams = (searchParams) => {
  if (typeof searchParams !== 'string' || searchParams.length < 1) {
    return {};
  }

  const searchQuery = searchParams.slice(1, searchParams.length).split('&');
  const searchParamsObject = {};

  searchQuery.forEach((element) => {
    const keyValuePair = element.split('=');
    try {
      const key = decodeURIComponent(keyValuePair[0]);
      const value = decodeURIComponent(keyValuePair[1]);
      searchParamsObject[key] = key === 'q' ? value.replace('+', ' ') : value;
    } catch (e) {
      console.warn('Failed to decode URI component');
    }
  });

  return searchParamsObject;
};

// Turn SearchParam object back to string
export const stringifySearchParams = (searchParams) => {
  if (typeof searchParams !== 'object') {
    return '';
  }

  // TODO: Check if this needs alternative for IE and Edge mobile
  const searchParamsObject = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    searchParamsObject.append(key, value);
  });

  const string = searchParamsObject.toString().replace(/[+]/g, ' ');

  return string;
};

// Custom hook for getting url query parameters as object
export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const queryParams = new URLSearchParams(search);
    const queryObject = {};
    queryParams.forEach((value, key) => {
      queryObject[key] = value;
    });
    return queryObject;
  }, [search]);
};

// Keyboard handler
export const keyboardHandler = (callback, keys) => {
  // Map given keys to keycodes
  const codes = keys.map((key) => {
    switch (key) {
      case 'enter':
        return 13;
      case 'space':
        return 32;
      case 'esc':
        return 27;
      case 'up':
        return 38;
      case 'down':
        return 40;
      default:
    }
    return null;
  });
  // Return function that runs callback if pressed keycode equals any given keycodes
  return (event) => {
    event.stopPropagation();
    const ref = event.which;
    if (ref && codes.indexOf(ref) >= 0) {
      event.preventDefault();
      return callback(event);
    }
    return null;
  };
};

// Add event listener and return function to unlisten given event
export const AddEventListener = (elem, event, handler) => {
  if (!elem || !elem.addEventListener || typeof event !== 'string' || typeof handler !== 'function') {
    return null;
  }

  try {
    elem.addEventListener(event, handler);
    return () => {
      elem.removeEventListener(event, handler);
    };
  } catch (e) {
    return null;
  }
};

export const valuesHaveChanged = (obj1, obj2, keys = []) => {
  let hasChanged = false;

  keys.forEach((key) => {
    if (hasChanged) return;

    if (
      Object.prototype.hasOwnProperty.call(obj1, key)
      && Object.prototype.hasOwnProperty.call(obj2, key)
    ) {
      if (obj1[key] !== obj2[key]) {
        hasChanged = true;
      }
    }
  });

  return hasChanged;
};

export const alphabeticCompare = (a, b) => {
  if (a !== b) {
    return a < b ? -1 : 1;
  }
  return 0;
};

export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const getSearchParam = (location, key) => {
  const searchParams = parseSearchParams(location.search);
  return searchParams[key];
};

/**
 * Transform distance number to distance object
 * @param {*} intl - Intl object to format number text
 * @param {number,string} distance - Calculated distance
 */
export const formatDistanceObject = (intl, distance) => {
  let adjustedDistance = distance;
  if (typeof adjustedDistance === 'number' && intl) {
    if (adjustedDistance >= 1000) {
      adjustedDistance /= 1000; // Convert from m to km
      adjustedDistance = adjustedDistance.toFixed(1); // Show only one decimal
      adjustedDistance = intl.formatNumber(adjustedDistance); // Format distance according to locale
      adjustedDistance = { distance: adjustedDistance, type: 'km', text: `${adjustedDistance} km` };
    } else {
      adjustedDistance = { distance, type: 'm', text: `${adjustedDistance} m` };
    }
    return adjustedDistance;
  }
  return null;
};

/**
 * Adds search parameters to given object avoids overriding
 * @param {object} obj - object which is used as base for insertion
 * @param {array} params - array of key values for which the search parameters are checked against
 */
export const addSearchParametersToObject = (obj, params) => {
  if (!window || !window.location || !params || !params.length) {
    return obj;
  }

  const uri = URI(window.location);
  const search = uri.search(true);
  const newObject = { ...obj };
  params.forEach((v) => {
    if (search[v] && !newObject[v]) {
      newObject[v] = search[v];
    }
  });
  return newObject;
};


export const isMobileDevice = () => {
  if (!window) {
    return false;
  }
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  const { userAgent } = navigator;
  return toMatch.some(toMatchItem => userAgent.match(toMatchItem));
};


export default isClient;
