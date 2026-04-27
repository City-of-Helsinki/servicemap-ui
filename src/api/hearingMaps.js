import { useQuery } from '@tanstack/react-query';

import config from '../../config';

export const hearingMapsKey = (unitId) => ['hearingMaps', String(unitId)];

export async function fetchHearingMaps(unitId, { signal } = {}) {
  const root = config?.hearingMapAPI?.root;
  if (typeof root !== 'string' || root.indexOf('undefined') !== -1) {
    throw new Error('HearingMapAPI baseURL missing');
  }
  const res = await fetch(`${root}/${unitId}/`, { signal });
  if (!res.ok) {
    throw new Error(
      `HTTP ${res.status} ${res.statusText} on hearingMaps/${unitId}`
    );
  }
  return res.json();
}

export function useHearingMaps(unitId, { enabled = true } = {}) {
  return useQuery({
    queryKey: hearingMapsKey(unitId),
    queryFn: ({ signal }) => fetchHearingMaps(unitId, { signal }),
    enabled: enabled && Boolean(unitId),
  });
}
