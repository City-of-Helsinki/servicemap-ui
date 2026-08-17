import { getSearchPageNumber } from '../PaginatedList';

describe('getSearchPageNumber', () => {
  it('parses the page query parameter', () => {
    expect(getSearchPageNumber('?p=3')).toBe(3);
  });

  it('uses the first page for missing or invalid parameters', () => {
    expect(getSearchPageNumber('')).toBe(1);
    expect(getSearchPageNumber('?p=invalid')).toBe(1);
  });
});
