import { getSettings } from "./default";

const settings = getSettings();

if (typeof settings.FEATURE_SERVICEMAP_PAGE_TRACKING === 'undefined') {
  settings.FEATURE_SERVICEMAP_PAGE_TRACKING = false;
}

export default {
  servicemapPageTracking: settings.FEATURE_SERVICEMAP_PAGE_TRACKING === 'true',
}
