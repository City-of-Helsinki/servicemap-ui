import { afterEach, describe, expect, it, vi } from 'vitest';

import { findUserLocation } from '../user';

describe('user actions', () => {
  const geolocationDescriptor = Object.getOwnPropertyDescriptor(
    navigator,
    'geolocation'
  );

  afterEach(() => {
    vi.restoreAllMocks();
    if (geolocationDescriptor) {
      Object.defineProperty(navigator, 'geolocation', geolocationDescriptor);
    } else {
      delete navigator.geolocation;
    }
  });

  it('handles an unavailable Geolocation API', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const dispatch = vi.fn();

    await findUserLocation()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_POSITION',
      position: {
        coordinates: null,
        allowed: false,
        addressData: null,
      },
    });
  });
});
