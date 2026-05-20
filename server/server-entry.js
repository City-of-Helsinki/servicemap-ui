// Production SSR bundle entry — bundled with `vite build --ssr server/server-entry.js`
import config from '../config';

export { render } from '../src/entry-server.jsx';
export { createAppStore } from '../src/store';
export { fetchEventData, fetchSelectedUnitData } from './dataFetcher';
export { default as getReadiness } from './readiness';
export {
  generateSitemap,
  getRobotsFile,
  getSitemap,
} from './sitemapMiddlewares';
export {
  getRequestFullUrl,
  languageSubdomainRedirect,
  makeLanguageHandler,
  parseInitialMapPositionFromHostname,
  sitemapActive,
  unitRedirect,
} from './utils';

export const { supportedLanguages } = config;
