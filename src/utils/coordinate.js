export const coordinateIsActive = (location) => {
  try {
    // Attempt to get coordinates from URL
    const usp = new URLSearchParams(location.search);
    const lat = usp.get('lat');
    const lng = usp.get('lon');
    if (lat && lng) {
      return true;
    }
  } catch (e) {
    console.warn('Unable to get coordinate from URL.');
  }
  return false;
};

export default coordinateIsActive;
