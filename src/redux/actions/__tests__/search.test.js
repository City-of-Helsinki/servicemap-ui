import { APIFetchError } from '../../../utils/newFetch/HTTPClient';
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
    const abortCause = new DOMException('The operation was aborted.', 'AbortError');

    it('does not dispatch fetchSuccess and does not rethrow', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi.fn().mockRejectedValue(new APIFetchError('fetch aborted', abortCause)),
      }));

      // Should resolve without throwing
      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState)
      ).resolves.toBeUndefined();

      // fetchSuccess should never have been dispatched
      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes).not.toContain('FETCH_SUCCESS');
    });

    it('dispatches fetchError to reset isFetching so subsequent searches are not blocked', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi.fn().mockRejectedValue(new APIFetchError('fetch aborted', abortCause)),
      }));

      await fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState);

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes).toContain('SEARCH_RESULTS_FETCH_HAS_ERRORED');
    });

    it('rethrows an APIFetchError that is not an abort (e.g. missing base URL)', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi.fn().mockRejectedValue(new APIFetchError('ServicemapAPI baseURL missing')),
      }));

      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState)
      ).rejects.toThrow('ServicemapAPI baseURL missing');
    });
  });

  describe('when smFetch throws an unexpected non-APIFetchError', () => {
    it('rethrows the error', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi
          .fn()
          .mockRejectedValue(new Error('unexpected network error')),
      }));

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
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi.fn().mockResolvedValue([mockUnit]),
      }));

      await fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState);

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes).toContain('SEARCH_RESULTS_FETCH_DATA_SUCCESS');
    });

    it('dispatches SEARCH_RESULTS_IS_FETCHING before the fetch starts', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        search: vi.fn().mockResolvedValue([]),
      }));

      await fetchSearchResults({ q: 'kirjasto' })(mockDispatch, mockGetState);

      const dispatchedTypes = mockDispatch.mock.calls
        .filter((call) => typeof call[0] === 'object')
        .map((call) => call[0]?.type);
      expect(dispatchedTypes[0]).toBe('SEARCH_RESULTS_IS_FETCHING');
    });

    it('sets object_type to "unit" on results from a service_node search', async () => {
      const { default: ServiceMapAPI } =
        await import('../../../utils/newFetch/ServiceMapAPI');
      const rawUnit = { id: 42, name: { fi: 'Testi' } };
      ServiceMapAPI.mockImplementation(() => ({
        setOnProgressUpdate: vi.fn(),
        serviceNodeSearch: vi.fn().mockResolvedValue([rawUnit]),
      }));

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
      LinkedEventsAPI.mockImplementation(() => ({
        eventsByKeyword: vi.fn().mockResolvedValue([rawEvent]),
      }));

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
    it('throws without dispatching', async () => {
      const busyGetState = () => ({
        searchResults: { isFetching: true, previousSearch: 'kirjasto' },
        user: { locale: 'fi' },
      });

      await expect(
        fetchSearchResults({ q: 'kirjasto' })(mockDispatch, busyGetState)
      ).rejects.toThrow(
        'Unable to fetch search results because previous fetch is still active'
      );

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
