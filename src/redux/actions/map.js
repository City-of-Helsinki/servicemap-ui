import CreateMap from '../../views/MapView/utils/createMap';

export const setMapType = (mapType) => {
  const newMap = CreateMap(mapType);
  return {
    type: 'SET_MAPTYPE',
    mapType: newMap,
  };
};

export const setMapRef = ref => ({
  type: 'SET_MAP_REF',
  mapRef: ref,
});
