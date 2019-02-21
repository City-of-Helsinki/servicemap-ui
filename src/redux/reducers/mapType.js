const mapType = (state = '', action) => {
  switch (action.type) {
    case 'SET_MAPTYPE':
      return action.mapType
    default:
      return state
  }
}

export default mapType
