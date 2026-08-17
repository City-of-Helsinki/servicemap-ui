import { orderUnits } from '../orderUnits';

describe('orderUnits', () => {
  const units = [
    { object_type: 'unit', name: { fi: 'Zeta' }, sort_index: 1 },
    { object_type: 'unit', name: { fi: 'Alpha' }, sort_index: 3 },
    { object_type: 'address', name: { fi: 'Address' }, sort_index: 2 },
  ];

  it('sorts names alphabetically', () => {
    const result = orderUnits(units, {
      direction: 'asc',
      order: 'alphabetical',
      locale: 'fi',
    });

    expect(result.map(({ name }) => name.fi)).toEqual([
      'Zeta',
      'Alpha',
      'Address',
    ]);
  });

  it('sorts match scores in ascending order', () => {
    const result = orderUnits(units, {
      direction: 'asc',
      order: 'match',
      locale: 'fi',
    });

    expect(result.map(({ sort_index }) => sort_index)).toEqual([3, 2, 1]);
  });
});
