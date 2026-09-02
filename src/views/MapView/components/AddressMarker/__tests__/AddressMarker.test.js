import { render, screen } from '@testing-library/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock('@mui/material/styles', async () => {
  const actual = await vi.importActual('@mui/material/styles');
  return {
    ...actual,
    useTheme: () => ({
      spacing: (n) => `${n * 8}px`,
      palette: { primary: { main: '#000' } },
    }),
  };
});

vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn((options) => ({ ...options, __mockIcon: true })),
  },
}));

vi.mock('../../../../../components', () => ({
  getIcon: vi.fn(() => <svg data-testid="mock-icon" />),
}));

vi.mock('../../../../../utils/address', () => ({
  getAddressText: vi.fn(() => 'Test Street 1'),
}));

vi.mock('../../../../../utils/useLocaleText', () => ({
  default: () => (obj) => obj?.fi || '',
}));

import AddressMarker from '../AddressMarker';

const MockMarker = ({ children, position }) => (
  <div data-testid="address-marker" data-position={JSON.stringify(position)}>
    {children}
  </div>
);
const MockTooltip = ({ children }) => (
  <div data-testid="address-tooltip">{children}</div>
);

describe('AddressMarker', () => {
  beforeEach(() => {
    globalThis.rL = { Marker: MockMarker, Tooltip: MockTooltip };
  });

  afterEach(() => {
    delete globalThis.rL;
    vi.clearAllMocks();
  });

  it('renders nothing when there is no position and no address', () => {
    useSelector.mockReturnValue({});

    const { container } = render(<AddressMarker />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a marker at the given position prop', () => {
    useSelector.mockReturnValue({});

    render(<AddressMarker position={[60.1, 24.9]} />);

    expect(screen.getByTestId('address-marker')).toHaveAttribute(
      'data-position',
      JSON.stringify([60.1, 24.9])
    );
  });

  it('renders a marker at the flipped address coordinates when no position given', () => {
    useSelector.mockReturnValue({
      addressCoordinates: [24.9, 60.1],
      addressData: { name: { fi: 'Test Street 1' } },
    });

    render(<AddressMarker />);

    expect(screen.getByTestId('address-marker')).toHaveAttribute(
      'data-position',
      JSON.stringify([60.1, 24.9])
    );
  });

  it('renders a tooltip with the address text when embeded is true', () => {
    useSelector.mockReturnValue({
      addressCoordinates: [24.9, 60.1],
      addressData: { name: { fi: 'Test Street 1' } },
    });

    render(<AddressMarker embeded />);

    expect(screen.getByTestId('address-tooltip')).toHaveTextContent(
      'Test Street 1'
    );
  });

  it('does not render a tooltip when embeded is false', () => {
    useSelector.mockReturnValue({
      addressCoordinates: [24.9, 60.1],
      addressData: { name: { fi: 'Test Street 1' } },
    });

    render(<AddressMarker />);

    expect(screen.queryByTestId('address-tooltip')).not.toBeInTheDocument();
  });
});
