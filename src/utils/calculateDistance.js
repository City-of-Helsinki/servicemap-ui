const calculateDistance = (unit, user) => {
  if (user && unit && unit.location) {
    const toRadians = (degree) => {
      const pi = Math.PI;
      return degree * (pi / 180);
    };

    // Calculate distance between two coordinates using the Haversine formula
    const r = 6371e3;
    const lat1 = unit.location.coordinates[1];
    const lat2 = user.latitude;
    const lon1 = unit.location.coordinates[0];
    const lon2 = user.longitude;

    const dLat = toRadians((lat2 - lat1));
    const dLon = toRadians((lon2 - lon1));

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = Math.round(r * c);

    return distance;
  }
  return null;
};

export default calculateDistance;
