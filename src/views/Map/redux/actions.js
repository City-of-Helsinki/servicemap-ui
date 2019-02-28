import CreateMap from '../../../utils/createMap';

const setMapType = (mapType) => {
  const newMap = CreateMap(mapType);
  return {
    type: 'SET_MAPTYPE',
    mapType: newMap,
  };
};

export default setMapType;
