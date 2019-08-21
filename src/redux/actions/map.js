import CreateMap from '../../views/MapView/utils/createMap';
import setSelection from './simpleActions';

// Map
export const setMapType = (value) => {
  const newMap = CreateMap(value);
  return setSelection('MAPTYPE', newMap);
};
export const setMapRef = value => setSelection('MAPREF', value);
