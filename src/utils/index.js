const isClient = () => typeof window !== 'undefined';


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

  return searchParamsObject.toString();
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


export default isClient;
