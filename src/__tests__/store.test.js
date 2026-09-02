import { describe, expect, it } from 'vitest';

import { createAppStore } from '../store';

describe('createAppStore', () => {
  it('creates a redux store exposing dispatch/getState/subscribe', () => {
    const store = createAppStore();

    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.subscribe).toBe('function');
    expect(store.getState()).toBeDefined();
  });

  it('seeds the store with a preloaded state', () => {
    const preloadedState = { user: { theme: 'default' } };
    const store = createAppStore(preloadedState);

    expect(store.getState().user).toEqual({ theme: 'default' });
  });
});
