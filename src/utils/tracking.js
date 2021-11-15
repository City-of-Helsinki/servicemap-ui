import MatomoTracker from '@datapunt/matomo-tracker-js';
import config from '../../config';

const matomoTracker = (
  typeof window !== 'undefined'
  && config.matomoSiteId
  && config.matomoUrl
  && window?.cookiehub?.hasConsented('analytics'))
  ? new MatomoTracker({
    urlBase: `https://${config.matomoUrl}`,
    siteId: config.matomoSiteId,
    trackerUrl: `https://${config.matomoUrl}/tracker.php`, // optional, default value: `${urlBase}matomo.php`
    srcUrl: `https://${config.matomoUrl}/piwik.min.js`, // optional, default value: `${urlBase}matomo.js`
    disabled: !window?.cookiehub?.hasConsented('analytics'), // optional, false by default. Makes all tracking calls no-ops if set to true.
    linkTracking: false, // optional, default value: true
  }) : null;

export default matomoTracker;
