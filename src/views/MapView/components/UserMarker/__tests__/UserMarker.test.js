import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-leaflet', () => ({
  Marker: (props) => (
    <button type="button" data-testid="user-marker" onClick={props.onClick}>
      marker
    </button>
  ),
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn((options) => ({ ...options, __mockIcon: true })),
  },
}));

vi.mock('../../../../../components', () => ({
  getIcon: vi.fn(() => <svg data-testid="mock-icon" />),
}));

import UserMarker from '../UserMarker';

describe('UserMarker', () => {
  it('renders a leaflet Marker', () => {
    render(<UserMarker position={[60.1, 24.9]} onClick={vi.fn()} />);

    expect(screen.getByTestId('user-marker')).toBeInTheDocument();
  });

  it('invokes onClick when clicked', () => {
    const onClick = vi.fn();
    render(<UserMarker position={[60.1, 24.9]} onClick={onClick} />);

    screen.getByTestId('user-marker').click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
