import LocalStorageUtility from '../localStorage';
import { isEmbed } from '../path';

vi.mock('../path', () => ({ isEmbed: vi.fn(() => false) }));

describe('LocalStorageUtility', () => {
  beforeEach(() => {
    window.localStorage.clear();
    LocalStorageUtility.storage = null;
    isEmbed.mockReturnValue(false);
  });

  it('saves and reads prefixed items', () => {
    LocalStorageUtility.saveItem('mapType', 'accessible_map');

    expect(window.localStorage.getItem('SM:mapType')).toBe('accessible_map');
    expect(LocalStorageUtility.getItem('mapType')).toBe('accessible_map');
  });

  it('does not save items in embed mode', () => {
    isEmbed.mockReturnValue(true);

    LocalStorageUtility.saveItem('history:new', '[]');

    expect(window.localStorage.length).toBe(0);
  });

  it('does not read items in embed mode', () => {
    window.localStorage.setItem('SM:mobility', 'wheelchair');
    isEmbed.mockReturnValue(true);

    expect(LocalStorageUtility.getItem('mobility')).toBeNull();
  });
});
