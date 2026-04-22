/* eslint-disable import/prefer-default-export */
import featureFlags from '../../config/featureFlags';
import { isMobileDevice } from '.';
import ServiceMapAPI from './newFetch/ServiceMapAPI';
import { isEmbed } from './path';

// // Simple servicemap page view tracking that tracks only visit count, embed, and mobile data
// // since Matomo can't be used in embed since it saves user specific data and requires user
// // permissions which causes issues with question box
export const servicemapTrackPageView = () => {
  if (featureFlags.servicemapPageTracking) {
    const smAPI = new ServiceMapAPI();
    smAPI
      .sendStats({
        embed: isEmbed() ? 1 : 0,
        mobile_device: isMobileDevice() ? 1 : 0,
      })
      .catch((e) => {
        // Silently ignore aborted POSTs (user navigated away or 10s timeout).
        // Log anything else so genuine regressions remain visible.
        if (!(e.name === 'APIFetchError' && e.cause?.name === 'AbortError')) {
          console.error(
            'servicemapTrackPageView: unexpected stats POST error',
            e
          );
        }
      });
  }
};
