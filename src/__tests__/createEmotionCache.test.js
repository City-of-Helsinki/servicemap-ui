import { describe, expect, it } from 'vitest';

import createEmotionCache from '../createEmotionCache';

describe('createEmotionCache', () => {
  it('creates an emotion cache with the "css" key', () => {
    const cache = createEmotionCache();

    expect(cache.key).toBe('css');
    expect(cache.sheet.nonce).toBeUndefined();
  });

  it('forwards a nonce to the created cache when provided', () => {
    const cache = createEmotionCache('test-nonce');

    expect(cache.key).toBe('css');
    expect(cache.sheet.nonce).toBe('test-nonce');
  });
});
