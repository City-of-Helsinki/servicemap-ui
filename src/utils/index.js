/* eslint-disable camelcase */
import { unstable_useMediaQuery } from '@material-ui/core/useMediaQuery';
import config from '../../config';

const isClient = () => typeof window !== 'undefined';

export const isRetina = () => {
  if (isClient && window.devicePixelRatio > 1) {
    return true;
  }
  return false;
};

// Focus user to view title's link element
export const focusToViewTitle = () => {
  const elem = document.getElementById('view-title');
  if (elem) {
    elem.focus();
  }
};

export const uppercaseFirst = val => val.charAt(0).toUpperCase() + val.slice(1);

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
      searchParamsObject[key] = value;
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

export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;


  for (let i = 0; i < a.length; i + 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
/**
 * USE ONLY IN SIMPLE COMPONENTS because mediaquery hook
 * Check if sidebar content is small
 * Return true if smaller than smallContent treshold
 * or smallscreen but not mobile
 */
export const isSmallContentArea = () => {
  const { smallContentAreaBreakpoint, mobileUiBreakpoint, smallScreenBreakpoint } = config;
  const smallContent = unstable_useMediaQuery(`(max-width:${smallContentAreaBreakpoint}px)`);
  const smallScreen = unstable_useMediaQuery(`(max-width:${smallScreenBreakpoint}px)`);
  const notMobile = unstable_useMediaQuery(`(min-width:${mobileUiBreakpoint}px)`);
  return (
    smallContent
    || (smallScreen && notMobile)
  );
};


export default isClient;
