import config from './index';

// Application paths
const paths = {
  home: () => '/',
  search: query => `/search${query ? `?q=${query}` : ''}`,
  unit: id => `/unit/${id || ''}`
}

// Generate path for page
export const generatePath = (path, locale = config.default_locale, data = null) => {
  if (paths.hasOwnProperty(path)) {
    const pathString = paths[path](data); // Create path string
    return `/${locale || config.default_locale}${pathString}`; // Return path with locale
  }
  return;
}