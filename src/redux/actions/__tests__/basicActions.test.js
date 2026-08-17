import {
  setAddressData,
  setAddressLocation,
  setAddressUnits,
  setAdminDistricts,
  setToRender,
} from '../address';
import { changeSelectedEvent, setSelectedEvent } from '../event';
import { setBounds, setMapRef, setMeasuringMode } from '../map';
import navigatorRefAction from '../navigator';
import { setTracker } from '../tracker';

describe('basic action creators', () => {
  it('creates address actions', () => {
    expect(setAddressData('data')).toEqual({
      type: 'SET_ADDRESS_DATA',
      data: 'data',
    });
    expect(setAddressLocation('location')).toEqual({
      type: 'SET_ADDRESS_LOCATION',
      location: 'location',
    });
    expect(setAddressUnits(['unit'])).toEqual({
      type: 'SET_ADDRESS_UNITS',
      units: ['unit'],
    });
    expect(setAdminDistricts(['district'])).toEqual({
      type: 'SET_ADMINISTRATIVE_DISTRICTS',
      data: ['district'],
    });
    expect(setToRender(true)).toEqual({ type: 'SET_TO_RENDER', data: true });
  });

  it('creates event, map, navigator, and tracker actions', async () => {
    const event = { id: 1 };
    expect(setSelectedEvent(event)).toEqual({
      type: 'SET_SELECTED_EVENT',
      event,
    });
    const dispatch = vi.fn();
    await changeSelectedEvent(event)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setSelectedEvent(event));

    expect(setMapRef('map')).toEqual({
      type: 'MAPREF_SET_SELECTION',
      selection: 'map',
    });
    expect(setBounds('bounds')).toEqual({
      type: 'BOUNDS_SET_SELECTION',
      selection: 'bounds',
    });
    expect(setMeasuringMode(true)).toEqual({
      type: 'MEASURING_MODE_SET_SELECTION',
      selection: true,
    });
    expect(setTracker('tracker')).toEqual({
      type: 'SET_TRACKER',
      tracker: 'tracker',
    });

    const navigatorDispatch = vi.fn();
    await navigatorRefAction('ref')(navigatorDispatch);
    expect(navigatorDispatch).toHaveBeenCalledWith({
      type: 'SET_NAVIGATOR_REF',
      ref: 'ref',
    });
  });
});
