import {
  bounds,
  direction,
  mapRef,
  measuringMode,
  order,
} from '../simpleReducers';

describe('simple reducers', () => {
  const reducers = [
    ['mapRef', mapRef, null, { current: 'map' }],
    ['bounds', bounds, null, { north: 60 }],
    ['measuringMode', measuringMode, false, true],
    ['direction', direction, 'desc', 'asc'],
    ['order', order, 'alphabetical', 'distance'],
  ];

  it.each(reducers)(
    '%s returns its default state',
    (_name, reducer, expected) => {
      expect(reducer(undefined, { type: 'UNKNOWN' })).toBe(expected);
    }
  );

  it.each(reducers)(
    '%s accepts its selection action',
    (_name, reducer, _default, selection) => {
      const prefix = _name.replace(/([A-Z])/g, (letter) =>
        letter.toUpperCase()
      );
      const actionPrefix =
        _name === 'mapRef'
          ? 'MAPREF'
          : _name === 'measuringMode'
            ? 'MEASURING_MODE'
            : prefix.toUpperCase();

      expect(
        reducer(undefined, {
          type: `${actionPrefix}_SET_SELECTION`,
          selection,
        })
      ).toBe(selection);
    }
  );
});
