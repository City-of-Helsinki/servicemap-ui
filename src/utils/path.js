import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import paths from '../../config/paths';
import config from '../../config';
import isClient from '.';

export const isEmbed = (match) => {
  if (!match) {
    return isClient() && !!paths.embed.regex.exec(window.location);
  }
  return match.url && !!paths.embed.regex.exec(match.url);
};

// This is a hook implementation of isEmbed functionality
export const useEmbedStatus = () => {
  const match = useRouteMatch();
  return match.url && !!paths.embed.regex.exec(match.url);
};

export const comparePath = (path, location) => {
  if (Object.prototype.hasOwnProperty.call(paths, path)) {
    const { regex } = paths[path];
    if (regex && regex.exec(location)) {
      return true;
    }
  }
  return false;
};

export const getPathName = (location) => {
  let result;
  Object.keys(paths).forEach((key) => {
    if (result) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(paths, key)) {
      const { regex } = paths[key];
      if (regex && regex.exec(location)) {
        result = key;
      }
    }
  });

  return result;
};

// Generate path for page
export const generatePath = (path, locale = config.defaultLocale, data = null, embed = false) => {
  if (Object.prototype.hasOwnProperty.call(paths, path)) {
    const pathString = paths[path].generate(data); // Create path string
    return `/${locale || config.defaultLocale}${embed ? '/embed' : ''}${pathString}`; // Return path with locale
  }
  return null;
};

// Check if pathname string equals home page path
export const isHomePage = (pathname) => {
  if (typeof pathname === 'string') {
    return paths.home.regex.test(pathname);
  }
  return false;
};
