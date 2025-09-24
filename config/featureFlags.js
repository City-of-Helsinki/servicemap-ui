import { getSettings } from "./default";

const settings = getSettings();

// Helper function to get feature flag value with defaults
function getFeatureFlag(key, defaultValue) {
  const value = settings[key];
  // Return default if value is undefined, null, empty string, or just whitespace
  if (!value || value.trim() === '') {
    return defaultValue;
  }
  return value;
}

const featureFlags = {
  servicemapPageTracking: getFeatureFlag('REACT_APP_FEATURE_SERVICEMAP_PAGE_TRACKING', 'false') === 'true',
  smCookies: getFeatureFlag('REACT_APP_FEATURE_SM_COOKIES', 'true') === 'true',
};

export default featureFlags;
