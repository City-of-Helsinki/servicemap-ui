export default function getTypeAndClass(vehicleMode) {
  switch (vehicleMode) {
    case 'TRAM': // Tram stops
      return { color: '#00985F', className: 'icon-icon-hsl-tram' };
    case 'BUS': // Bus stops
      return { color: '#007AC9', className: 'icon-icon-hsl-bus' };
    case 'SUBWAY': // Subway stops
      return { color: '#FF6319', className: 'icon-icon-hsl-metro' };
    case 7: // Bike stations
      return { color: '#fcb919', className: 'icon-icon-hsl-bike' };
    case 'FERRY': // Ferry stops
      return { color: '#00B9E4', className: 'icon-icon-hsl-ferry' };
    case 'TRAIN': // Train stops
    default:
      return { color: '#8C4799', className: 'icon-icon-hsl-train' };
  }
}
