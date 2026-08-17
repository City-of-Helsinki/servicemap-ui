import breadcrumb from '../breadcrumb';
import event from '../event';
import navigator from '../navigator';
import tracker from '../tracker';

describe('basic reducers', () => {
  it('handles breadcrumb entries', () => {
    const first = { location: '/first' };
    const second = { location: '/second' };
    const pushed = breadcrumb([], { type: 'PUSH_ENTRY', entry: first });

    expect(pushed).toEqual([first]);
    expect(breadcrumb([...pushed, second], { type: 'POP_ENTRY' })).toEqual([
      first,
    ]);
    expect(
      breadcrumb([...pushed, second], {
        type: 'REPLACE_ENTRY',
        entry: { location: '/replacement' },
      })
    ).toEqual([first, { location: '/replacement' }]);
  });

  it.each([
    ['event', event, 'SET_SELECTED_EVENT', 'event'],
    ['navigator', navigator, 'SET_NAVIGATOR_REF', 'navigator'],
    ['tracker', tracker, 'SET_TRACKER', 'tracker'],
  ])('updates the %s state', (_name, reducer, type, key) => {
    const value = { key };
    const actionKey =
      type === 'SET_SELECTED_EVENT'
        ? 'event'
        : type === 'SET_TRACKER'
          ? 'tracker'
          : 'ref';
    expect(reducer(undefined, { type, [actionKey]: value })).toBe(value);
    expect(reducer(undefined, { type: 'UNKNOWN' })).toBe(null);
  });
});
