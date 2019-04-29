const isClient = () => typeof window !== 'undefined';

const tAttr = (attr) => {
  let lang; let
    len;

  if (!attr) {
    return attr;
  }

  if (!(attr instanceof Object)) {
    console.error("translated attribute didn't get a translation object", attr);
    return attr;
  }

  // Try primary choice first, fallback to whatever's available.
  const languages = [].concat(SUPPORTED_LANGUAGES);

  for (let i = 0, len = languages.length; i < len; i++) {
    lang = languages[i];
    if (lang in attr) {
      return attr[lang];
    }
  }

  console.error('no supported languages found', attr);

  return null;
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

export default isClient;
