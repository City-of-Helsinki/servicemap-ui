// Errors that are safe to ignore in both client and server Sentry integrations.
// These are all network-abort / cancellation signals that are not actionable.
export const sharedIgnoreErrors = [
  'AbortError',
  // HTTPClient wraps aborted fetches in this typed subclass. iOS Safari
  // aggressively aborts in-flight requests on backgrounding / bfcache /
  // radio switches, so these are navigation noise rather than real errors.
  'AbortAPIError',
  // Fetch cancellation errors across browsers and locales.
  /TypeError: (Kumottu|cancelled)/,
  'TypeError: Failed to fetch',
  'TypeError: NetworkError when attempting to fetch resource.',
  // Safari/iOS equivalent of "Failed to fetch" for passively aborted requests.
  // Scoped to the raw TypeError so wrapped APIFetchError instances (which may
  // indicate genuine API failures) still surface in Sentry.
  'TypeError: Load failed',
];
