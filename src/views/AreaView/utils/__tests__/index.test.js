import { sortByOriginID } from '../index';

describe('sortByOriginID', () => {
  it('sorts districts numerically by origin ID', () => {
    const districts = [{ origin_id: '10' }, { origin_id: '2' }];

    sortByOriginID(districts);

    expect(districts.map(({ origin_id }) => origin_id)).toEqual(['2', '10']);
  });
});
