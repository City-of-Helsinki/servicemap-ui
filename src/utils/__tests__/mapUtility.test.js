import { parseBboxFromLocation } from '../mapUtility';

describe('parseBboxFromLocation', () => {
  it('parses a bbox containing decimal coordinates', () => {
    expect(
      parseBboxFromLocation({ search: '?bbox=24.9,60.1,24.95,60.15' })
    ).toEqual(['24.9', '60.1', '24.95', '60.15']);
  });
});
