import config from './index';

// Application paths
const paths = {
  home: {
    generate: () => '/',
  },
  search: {
    generate: query => `/search${query ? `?q=${query}` : ''}`,
  },
  unit: {
    generate: id => `/unit/${id || ''}`,
  },
}

// Generate path for page
export const generatePath = (path, locale = config.default_locale, data = null) => {
  if (paths.hasOwnProperty(path)) {
    const pathString = paths[path].generate(data); // Create path string
    return `/${locale || config.default_locale}${pathString}`; // Return path with locale
  }
  return;
}