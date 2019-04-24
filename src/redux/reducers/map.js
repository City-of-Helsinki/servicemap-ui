export const mapType = (state = '', action) => {
  switch (action.type) {
    case 'SET_MAPTYPE':
      return action.mapType;
    default:
      return state;
  }
};

export const mapRef = (state = '', action) => {
  switch (action.type) {
    case 'SET_MAP_REF':
      return action.mapRef;
    default:
      return state;
  }
};
