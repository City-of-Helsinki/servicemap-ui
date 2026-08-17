import { getTabIndexFromSearch } from '../TabLists';

describe('getTabIndexFromSearch', () => {
  const tabs = [{ id: 'units' }, { id: 'services' }, { id: 'addresses' }];

  it('parses a numeric tab index', () => {
    expect(getTabIndexFromSearch(tabs, { t: '2' })).toBe(2);
  });

  it('uses a matching tab id before parsing a number', () => {
    expect(getTabIndexFromSearch(tabs, { t: 'services' })).toBe(1);
  });

  it('falls back to the first tab for invalid or out-of-range values', () => {
    expect(getTabIndexFromSearch(tabs, { t: 'invalid' })).toBe(0);
    expect(getTabIndexFromSearch(tabs, { t: '9' })).toBe(0);
  });
});
