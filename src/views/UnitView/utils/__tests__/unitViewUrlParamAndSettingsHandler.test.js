import { parseUnitViewUrlParams } from '../unitViewUrlParamAndSettingsHandler';

describe('parseUnitViewUrlParams', () => {
  // Attempt to shut sonar for code duplication
  function baseTest(url, expected) {
    const actions = parseUnitViewUrlParams(url);
    expect(actions).toEqual(expected);
  }

  it('Should not act on undefined url params', () => {
    baseTest('?search=aaa&city=helsinki', []);
  });

  it('Should reset mobility setting on empty param', () => {
    baseTest('?search=aaa&city=helsinki&mobility=', [
      { setting: 'mobility', value: null },
    ]);
  });

  it('Should reset senses setting on empty param', () => {
    baseTest('?senses=&fooz=accessible_map', [
      { setting: 'senses', value: null },
    ]);
  });

  it('Should act on mobility param', () => {
    baseTest('?search=aaa&city=helsinki&mobility=rollator', [
      { setting: 'mobility', value: 'rollator' },
    ]);
  });

  it('Should act on senses param', () => {
    baseTest('?senses=colorblind&fooz=accessible_map', [
      { setting: 'senses', value: 'colorblind' },
    ]);
  });

  it('Should act on multiple senses params', () => {
    baseTest('?senses=colorblind%2ChearingAid&fooz=accessible_map', [
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 1', () => {
    baseTest(
      '?senses=colorblind%2ChearingAid&fooz=accessible_map&mobility=stroller',
      [
        { setting: 'mobility', value: 'stroller' },
        { setting: 'senses', value: 'colorblind' },
        { setting: 'senses', value: 'hearingAid' },
      ]
    );
  });

  it('Should act on mobility and senses params 2', () => {
    baseTest('?senses=&fooz=accessible_map&mobility=stroller', [
      { setting: 'mobility', value: 'stroller' },
      { setting: 'senses', value: null },
    ]);
  });

  it('Should act on mobility and senses params 3', () => {
    baseTest('?senses=colorblind%2ChearingAid&fooz=accessible_map&mobility=', [
      { setting: 'mobility', value: null },
      { setting: 'senses', value: 'colorblind' },
      { setting: 'senses', value: 'hearingAid' },
    ]);
  });

  it('Should act on mobility and senses params 4', () => {
    baseTest('?senses=&fooz=accessible_map&mobility=', [
      { setting: 'mobility', value: null },
      { setting: 'senses', value: null },
    ]);
  });

  it('Should not act on empty map param', () => {
    baseTest('?map=&search=safdf', []);
  });

  it('Should act on map param', () => {
    baseTest('?map=guidemap&search=safdf', [
      { setting: 'mapType', value: 'guidemap' },
    ]);
  });
});
