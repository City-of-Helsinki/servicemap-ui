import simpleAction from '../simpleActions';

describe('simpleAction', () => {
  it('creates a selection action', () => {
    expect(simpleAction('MAPREF', 'map-ref')).toEqual({
      type: 'MAPREF_SET_SELECTION',
      selection: 'map-ref',
    });
  });
});
