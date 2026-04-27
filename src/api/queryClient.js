import { QueryClient } from '@tanstack/react-query';

// Factory rather than a singleton so the server can create a fresh client
// per request — sharing one QueryClient across requests would leak cache
// between users.
export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // iOS Safari fires focus events on every tab/app switch. Default-on
        // refetching would hammer the backend on mobile; individual queries
        // can opt in if they genuinely need fresh data on focus.
        refetchOnWindowFocus: false,
        // Don't retry user/nav-triggered aborts — they're not failures.
        retry: (failureCount, error) =>
          error?.name !== 'AbortError' &&
          error?.name !== 'AbortAPIError' &&
          failureCount < 2,
        staleTime: 60_000,
      },
    },
  });
