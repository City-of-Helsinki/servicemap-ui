import LocalStorageUtility from '../../../utils/localStorage';
import { saveSearchToHistory } from '../previousSearchData';

describe('previous search timestamps', () => {
  it('reads the stored update timestamp as a number', () => {
    vi.spyOn(LocalStorageUtility, 'getItem').mockImplementation((key) =>
      key === 'history:updated' ? String(Date.now() + 86400000) : null
    );
    const saveItem = vi
      .spyOn(LocalStorageUtility, 'saveItem')
      .mockImplementation(() => {});

    saveSearchToHistory('library', { object_type: 'service' });

    expect(saveItem).toHaveBeenCalled();
  });
});
