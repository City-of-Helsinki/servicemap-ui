import { parseUnitViewUrlParams } from '../unitViewUrlParamAndSettingsHandler';

describe('parseUnitViewUrlParams', () => {

  it('Should not act on undefined url params', () => {
    const actions = parseUnitViewUrlParams('?search=aaa&city=helsinki');
    expect(actions).toEqual([]);
  });

  it('Should reset mobility setting on empty param', () => {
    const actions = parseUnitViewUrlParams('?search=aaa&city=helsinki&mobility=');
    expect(actions).toEqual([{ setting: 'mobility', value: null }]);
  });

  it('Should reset senses setting on empty param', () => {
    const actions = parseUnitViewUrlParams('?senses=&map=accessible_map');
    expect(actions).toEqual([{ setting: 'senses', value: null }]);
  });

  it('Should act on mobility param', () => {
    const actions = parseUnitViewUrlParams('?search=aaa&city=helsinki&mobility=rollator');
    expect(actions).toEqual([{ setting: 'mobility', value: 'rollator' }]);
  });

  it('Should act on senses param', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind&map=accessible_map');
    expect(actions).toEqual([
      { setting: 'senses', value: 'colorblind' },
    ]);
  });

  it('Should act on multiple senses params', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&map=accessible_map');
    expect(actions).toEqual([
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 1', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&map=accessible_map&mobility=stroller');
    expect(actions).toEqual([
      { setting: 'mobility', value: 'stroller' },
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 2', () => {
    const actions = parseUnitViewUrlParams('?senses=&map=accessible_map&mobility=stroller');
    expect(actions).toEqual([
      { setting: 'mobility', value: 'stroller' },
      { setting: 'senses', value: null },
    ]);
  });

  it('Should act on mobility and senses params 3', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&map=accessible_map&mobility=');
    expect(actions).toEqual([
      { setting: 'mobility', value: null },
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 4', () => {
    const actions = parseUnitViewUrlParams('?senses=&map=accessible_map&mobility=');
    expect(actions).toEqual([
      { setting: 'mobility', value: null },
      { setting: 'senses', value: null },
    ]);
  });
});
