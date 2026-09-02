import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import useIsClient from '../useIsClient';

describe('useIsClient', () => {
  it('returns true once mounted (jsdom simulates the client)', async () => {
    const { result } = renderHook(() => useIsClient());

    expect(result.current).toBe(true);
  });
});
