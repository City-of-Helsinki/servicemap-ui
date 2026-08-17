import { dataSetReducer } from '../fetchDataReducer';

const state = {
  data: ['old'],
  current: 'current',
  count: 1,
  errorMessage: null,
  isFetching: false,
  max: 2,
  next: 'next',
  previousSearch: 'old search',
  activeFetches: 0,
  fetchStartTime: null,
};

describe('dataSetReducer', () => {
  it('starts a fetch and resets progress state', () => {
    const result = dataSetReducer(
      state,
      {
        type: 'TEST_IS_FETCHING',
        search: 'new search',
      },
      'TEST'
    );

    expect(result).toMatchObject({
      isFetching: true,
      previousSearch: 'new search',
      count: 0,
      max: 0,
      next: null,
    });
    expect(result.fetchStartTime).toEqual(expect.any(Number));
  });

  it('handles errors and successful data', () => {
    expect(
      dataSetReducer(
        state,
        {
          type: 'TEST_FETCH_HAS_ERRORED',
          errorMessage: 'failed',
        },
        'TEST'
      )
    ).toMatchObject({ isFetching: false, errorMessage: 'failed', count: 0 });

    expect(
      dataSetReducer(
        state,
        {
          type: 'TEST_FETCH_DATA_SUCCESS',
          data: ['one', 'two'],
        },
        'TEST'
      )
    ).toMatchObject({ isFetching: false, data: ['one', 'two'], count: 2 });
  });

  it('updates progress and keeps concurrent counts monotonic', () => {
    expect(
      dataSetReducer(
        state,
        {
          type: 'TEST_FETCH_PROGRESS_UPDATE',
          count: 4,
          max: 10,
          next: 'next-page',
        },
        'TEST'
      )
    ).toMatchObject({ count: 4, max: 10, next: 'next-page' });

    expect(
      dataSetReducer(
        { ...state, count: 5 },
        {
          type: 'TEST_FETCH_PROGRESS_UPDATE_CONCURRENT',
          count: 3,
          max: 10,
        },
        'TEST'
      )
    ).toMatchObject({ count: 5, max: 10 });
  });

  it('handles additive fetches', () => {
    const fetching = dataSetReducer(
      state,
      {
        type: 'TEST_ADDITIVE_IS_FETCHING',
        search: 'additive',
      },
      'TEST'
    );
    expect(fetching).toMatchObject({ isFetching: true, activeFetches: 1 });

    const progress = dataSetReducer(
      fetching,
      {
        type: 'TEST_ADDITIVE_FETCH_PROGRESS_UPDATE',
        count: 2,
        max: 3,
      },
      'TEST'
    );
    expect(progress).toMatchObject({ count: 2, max: 3 });

    const success = dataSetReducer(
      progress,
      {
        type: 'TEST_ADDITIVE_FETCH_DATA_SUCCESS',
        data: ['new'],
      },
      'TEST'
    );
    expect(success).toMatchObject({ data: ['old', 'new'], activeFetches: 0 });
  });
});
