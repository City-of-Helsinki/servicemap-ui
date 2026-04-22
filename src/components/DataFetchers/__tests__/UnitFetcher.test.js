import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';

const minimalReducer = () => ({
  selectedUnit: { unit: { data: null } },
  mapRef: null,
});

// Mock react-router-dom's useParams so we control the unit param in each test
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useParams: vi.fn() };
});

// Mock focusToPosition so Leaflet doesn't have to be set up
vi.mock('../../../views/MapView/utils/mapActions', () => ({
  focusToPosition: vi.fn(),
}));

// Mock action creators to return plain objects so redux-mock-store doesn't choke on thunks
const mockFetchSelectedUnit = vi.fn(() => ({
  type: 'MOCK_FETCH_SELECTED_UNIT',
}));
const mockFetchReservations = vi.fn(() => ({
  type: 'MOCK_FETCH_RESERVATIONS',
}));
const mockFetchUnitEvents = vi.fn(() => ({ type: 'MOCK_FETCH_UNIT_EVENTS' }));
const mockFetchAccessibilitySentences = vi.fn(() => ({
  type: 'MOCK_FETCH_ACCESSIBILITY',
}));
const mockChangeSelectedUnit = vi.fn(() => ({
  type: 'MOCK_CHANGE_SELECTED_UNIT',
}));

vi.mock('../../../redux/actions/selectedUnit', () => ({
  fetchSelectedUnit: (...args) => mockFetchSelectedUnit(...args),
  changeSelectedUnit: (...args) => mockChangeSelectedUnit(...args),
}));
vi.mock('../../../redux/actions/selectedUnitReservations', () => ({
  fetchReservations: (...args) => mockFetchReservations(...args),
}));
vi.mock('../../../redux/actions/selectedUnitEvents', () => ({
  fetchUnitEvents: (...args) => mockFetchUnitEvents(...args),
}));
vi.mock('../../../redux/actions/selectedUnitAccessibility', () => ({
  fetchAccessibilitySentences: (...args) =>
    mockFetchAccessibilitySentences(...args),
}));

const { useParams } = await import('react-router-dom');
const { default: UnitFetcher } = await import('../UnitFetcher');

const renderComponent = (store = createStore(minimalReducer)) => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <UnitFetcher>
          <span>child</span>
        </UnitFetcher>
      </MemoryRouter>
    </Provider>
  );
};

describe('UnitFetcher — invalid unit ID guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when unit param is the string "undefined"', () => {
    useParams.mockReturnValue({ unit: 'undefined' });
    renderComponent();

    expect(mockFetchReservations).not.toHaveBeenCalled();
    expect(mockFetchSelectedUnit).not.toHaveBeenCalled();
  });

  it('does not fetch when unit param is a non-numeric string', () => {
    useParams.mockReturnValue({ unit: 'abc' });
    renderComponent();

    expect(mockFetchReservations).not.toHaveBeenCalled();
    expect(mockFetchSelectedUnit).not.toHaveBeenCalled();
  });

  it('does not fetch when unit param is missing', () => {
    useParams.mockReturnValue({});
    renderComponent();

    expect(mockFetchReservations).not.toHaveBeenCalled();
    expect(mockFetchSelectedUnit).not.toHaveBeenCalled();
  });

  it('fetches normally when unit param is a valid numeric ID', () => {
    useParams.mockReturnValue({ unit: '12345' });
    renderComponent();

    expect(mockFetchReservations).toHaveBeenCalledWith('12345');
    expect(mockFetchSelectedUnit).toHaveBeenCalledWith(
      '12345',
      expect.any(Function)
    );
  });

  it('also calls fetchUnitEvents for a valid unit ID', () => {
    useParams.mockReturnValue({ unit: '12345' });
    renderComponent();

    expect(mockFetchUnitEvents).toHaveBeenCalledWith('12345');
  });
});

describe('UnitFetcher — unit already loaded', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // The reducer must return a stable reference to avoid react-redux re-render loops
  const loadedUnitState = {
    selectedUnit: {
      unit: { data: { id: 12345, complete: true, object_type: 'unit' } },
    },
    mapRef: null,
  };
  const storeWithUnit = createStore((state = loadedUnitState) => state);

  it('skips fetchSelectedUnit when unit is already complete with matching ID', () => {
    useParams.mockReturnValue({ unit: '12345' });
    renderComponent(storeWithUnit);

    expect(mockFetchSelectedUnit).not.toHaveBeenCalled();
  });

  it('calls fetchAccessibilitySentences when unit is already complete with matching ID', () => {
    useParams.mockReturnValue({ unit: '12345' });
    renderComponent(storeWithUnit);

    expect(mockFetchAccessibilitySentences).toHaveBeenCalledWith('12345');
  });
});
