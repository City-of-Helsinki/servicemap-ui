import { useEffect, useState } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 *
 * Used to defer rendering of client-only components (e.g. ones relying on
 * React.lazy/Suspense) until after hydration, so that the initial client
 * render matches the server-rendered HTML exactly and avoids React
 * hydration mismatches.
 */
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export default useIsClient;
