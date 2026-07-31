import {
  AbortAPIError,
  APIFetchError,
} from '../../../utils/newFetch/HTTPClient';
import fetchSearchResults from '../search';

// Mock modules that fetchSearchResults depends on
vi.mock('../../../utils/newFetch/ServiceMapAPI');
vi.mock('../../../utils/newFetch/LinkedEventsAPI');
vi.mock('../../../components/SearchBar/previousSearchData', () => ({
  saveSearchToHistory: vi.fn(),
}));
vi.mock('../../../utils/path', () => ({ isEmbed: () => false }));

const mockDispatch = vi.fn();
const mockGetState = () => ({
  searchResults: { isFetching: false, previousSearch: null },
  user: { locale: 'fi' },
});

describe('fetchSearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when smFetch throws an APIFetchError (aborted request)', () => {
    const abortCause = new DOMException(
      'The operation was aborted.',
      'AbortError'
    );

    it('does not dispatch fetchSuccess, dispatches fetchError to reset isFetching, and does not rethrow', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          search: vi
            .fn()
            .mockRejectedValue(new AbortAPIError('fetch aborted', abortCause)),
        };
      });

      // Should resolve without throwing
      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState)
      ).resolves.toBeUndefined();

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);

      // Success action must not be dispatched on abort
      expect(dispatchedTypes).not.toContain(
        'SEARCH_RESULTS_FETCH_DATA_SUCCESS'
      );
      // fetchError must be dispatched to reset isFetching, preventing subsequent searches from being blocked
      expect(dispatchedTypes).toContain('SEARCH_RESULTS_FETCH_HAS_ERRORED');
    });

    it('rethrows an APIFetchError that is not an abort (e.g. missing base URL)', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          search: vi
            .fn()
            .mockRejectedValue(
              new APIFetchError('ServicemapAPI baseURL missing')
            ),
        };
      });

      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState)
      ).rejects.toThrow('ServicemapAPI baseURL missing');
    });
  });

  describe('when smFetch throws an unexpected non-APIFetchError', () => {
    it('rethrows the error', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          search: vi
            .fn()
            .mockRejectedValue(new Error('unexpected network error')),
        };
      });

      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState)
      ).rejects.toThrow('unexpected network error');
    });
  });

  describe('when smFetch resolves successfully', () => {
    it('dispatches fetchSuccess with results', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      const mockUnit = { id: 1, object_type: 'unit', name: { fi: 'Kirjasto' } };
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          search: vi.fn().mockResolvedValue([mockUnit]),
        };
      });

      await fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState);

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes).toContain('SEARCH_RESULTS_FETCH_DATA_SUCCESS');
    });

    it('dispatches SEARCH_RESULTS_IS_FETCHING before the fetch starts', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          search: vi.fn().mockResolvedValue([]),
        };
      });

      await fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState);

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes[0]).toBe('SEARCH_RESULTS_IS_FETCHING');
    });

    it('skips stale concurrent progress updates and dispatches only non-stale totals', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      let onProgressUpdate;
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn((callback) => {
            onProgressUpdate = callback;
          }),
          search: vi.fn().mockImplementation(async () => {
            // Stale update (smaller than current state count) should be dropped.
            onProgressUpdate(3, 10);
            // Fresh cumulative update should be dispatched.
            onProgressUpdate(6, 10);
            return [];
          }),
        };
      });

      const getStateWithCurrentCount = () => ({
        searchResults: { isFetching: false, previousSearch: null, count: 5 },
        user: { locale: 'fi' },
      });

      await fetchSearchResults({ q: 'kirjasto' })(
        mockDispatch,
        getStateWithCurrentCount
      );

      const progressCalls = mockDispatch.mock.calls
        .map((call) => call[0])
        .filter(
          (action) =>
            action?.type === 'SEARCH_RESULTS_FETCH_PROGRESS_UPDATE_CONCURRENT'
        );

      expect(progressCalls).toHaveLength(1);
      expect(progressCalls[0]).toMatchObject({ count: 6, max: 10 });
    });

    it('sets object_type to "unit" on results from a service_node search', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      const rawUnit = { id: 42, name: { fi: 'Testi' } };
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          serviceNodeSearch: vi.fn().mockResolvedValue([rawUnit]),
        };
      });

      await fetchSearchResults({ service_node: '100' })(
        mockDispatch,
        mockGetState
      );

      const successCall = mockDispatch.mock.calls.find(
        (call) => call[0]?.type === 'SEARCH_RESULTS_FETCH_DATA_SUCCESS'
      );
      expect(successCall[0].data[0].object_type).toBe('unit');
    });

    it('sets object_type to "event" on event results and parses location.id from tprek string', async () => {
      const { default: LinkedEventsAPI } =
        await import('../../../utils/newFetch/LinkedEventsAPI');
      const rawEvent = {
        id: 'helsinki:abc',
        location: { id: 'tprek:9876', name: { fi: 'Paikka' } },
      };
      LinkedEventsAPI.mockImplementation(function () {
        return {
          eventsByKeyword: vi.fn().mockResolvedValue([rawEvent]),
        };
      });

      await fetchSearchResults({ events: 'some-keyword' })(
        mockDispatch,
        mockGetState
      );

      const successCall = mockDispatch.mock.calls.find(
        (call) => call[0]?.type === 'SEARCH_RESULTS_FETCH_DATA_SUCCESS'
      );
      const result = successCall[0].data[0];
      expect(result.object_type).toBe('event');
      expect(result.location.object_type).toBe('unit');
      expect(result.location.id).toBe(9876);
    });
  });

  describe('when a fetch is already in progress', () => {
    it('starts a new fetch instead of throwing', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          setAbortController: vi.fn(),
          search: vi.fn().mockResolvedValue([]),
        };
      });

      const busyGetState = () => ({
        searchResults: { isFetching: true, previousSearch: 'kirjasto' },
        user: { locale: 'fi' },
      });

      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, busyGetState)
      ).resolves.toBeUndefined();

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);

      expect(dispatchedTypes).toContain('SEARCH_RESULTS_IS_FETCHING');
      expect(dispatchedTypes).toContain('SEARCH_RESULTS_FETCH_DATA_SUCCESS');
    });

    it('ignores stale result from an older overlapping fetch', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');

      let firstResolve;
      let secondResolve;
      let callIndex = 0;

      const firstPromise = new Promise((resolve) => {
        firstResolve = resolve;
      });
      const secondPromise = new Promise((resolve) => {
        secondResolve = resolve;
      });

      ServiceMapAPI.mockImplementation(function () {
        return {
          setOnProgressUpdate: vi.fn(),
          setAbortController: vi.fn(),
          search: vi.fn().mockImplementation(() => {
            callIndex += 1;
            return callIndex === 1 ? firstPromise : secondPromise;
          }),
        };
      });

      const firstThunkPromise = fetchSearchResults({ q: 'vanha' })(
        mockDispatch,
        mockGetState
      );
      const secondThunkPromise = fetchSearchResults({ q: 'uusi' })(
        mockDispatch,
        mockGetState
      );

      secondResolve([{ id: 2, name: { fi: 'Uusi' }, object_type: 'unit' }]);
      await secondThunkPromise;

      firstResolve([{ id: 1, name: { fi: 'Vanha' }, object_type: 'unit' }]);
      await firstThunkPromise;

      const successActions = mockDispatch.mock.calls
        .map((call) => call[0])
        .filter(
          (action) => action?.type === 'SEARCH_RESULTS_FETCH_DATA_SUCCESS'
        );

      expect(successActions).toHaveLength(1);
      expect(successActions[0].data[0].id).toBe(2);
    });
  });
});
