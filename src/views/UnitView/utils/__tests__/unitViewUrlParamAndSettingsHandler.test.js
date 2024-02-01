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
    const actions = parseUnitViewUrlParams('?senses=&fooz=accessible_map');
    expect(actions).toEqual([{ setting: 'senses', value: null }]);
  });

  it('Should act on mobility param', () => {
    const actions = parseUnitViewUrlParams('?search=aaa&city=helsinki&mobility=rollator');
    expect(actions).toEqual([{ setting: 'mobility', value: 'rollator' }]);
  });

  it('Should act on senses param', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind&fooz=accessible_map');
    expect(actions).toEqual([
      { setting: 'senses', value: 'colorblind' },
    ]);
  });

  it('Should act on multiple senses params', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&fooz=accessible_map');
    expect(actions).toEqual([
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 1', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&fooz=accessible_map&mobility=stroller');
    expect(actions).toEqual([
      { setting: 'mobility', value: 'stroller' },
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 2', () => {
    const actions = parseUnitViewUrlParams('?senses=&fooz=accessible_map&mobility=stroller');
    expect(actions).toEqual([
      { setting: 'mobility', value: 'stroller' },
      { setting: 'senses', value: null },
    ]);
  });

  it('Should act on mobility and senses params 3', () => {
    const actions = parseUnitViewUrlParams('?senses=colorblind%2ChearingAid&fooz=accessible_map&mobility=');
    expect(actions).toEqual([
      { setting: 'mobility', value: null },
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 4', () => {
    const actions = parseUnitViewUrlParams('?senses=&fooz=accessible_map&mobility=');
    expect(actions).toEqual([
      { setting: 'mobility', value: null },
      { setting: 'senses', value: null },
    ]);
  });

  it('Should not act on empty map param', () => {
    const actions = parseUnitViewUrlParams('?map=&search=safdf');
    expect(actions).toEqual([]);
  });

  it('Should act on map param', () => {
    const actions = parseUnitViewUrlParams('?map=guidemap&search=safdf');
    expect(actions).toEqual([{ setting: 'mapType', value: 'guidemap' }]);
  });
});
