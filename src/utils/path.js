import paths from '../../config/paths';
import config from '../../config';

export const comparePath = (path, location) => {
  console.log('Path key: ', path);
  console.log('Location: ', location);
  if (paths.hasOwnProperty(path)) {
    const { regex } = paths[path];
    console.log(regex, regex.exec(location));
    if (regex && regex.exec(location)) {
      return true;
    }
  }
  return false;
};

// Generate path for page
export const generatePath = (path, locale = config.default_locale, data = null) => {
  if (paths.hasOwnProperty(path)) {
    const pathString = paths[path].generate(data); // Create path string
    return `/${locale || config.default_locale}${pathString}`; // Return path with locale
  }
};
