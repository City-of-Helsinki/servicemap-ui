import { getSettings } from "./default";

const settings = getSettings();

if (typeof settings.FEATURE_SERVICEMAP_PAGE_TRACKING === 'undefined') {
  settings.FEATURE_SERVICEMAP_PAGE_TRACKING = false; // Default to false
}

if (typeof settings.FEATURE_SM_COOKIES === 'undefined') {
  settings.FEATURE_SM_COOKIES = true; // Default to true
}

export default {
  servicemapPageTracking: settings.FEATURE_SERVICEMAP_PAGE_TRACKING === 'true',
  smCookies: settings.FEATURE_SM_COOKIES === 'true',
}
