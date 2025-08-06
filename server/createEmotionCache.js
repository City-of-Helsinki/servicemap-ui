import createCache from '@emotion/cache';

export default function createEmotionCache(nonce) {
  return createCache({ key: 'css', nonce: nonce });
}
