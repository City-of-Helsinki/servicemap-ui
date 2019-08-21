import CreateMap from '../../views/MapView/utils/createMap';
import simpleAction from './simpleActions';

// Map
export const setMapType = (value) => {
  const newMap = CreateMap(value);
  return simpleAction('MAPTYPE', newMap);
};
export const setMapRef = value => simpleAction('MAPREF', value);
