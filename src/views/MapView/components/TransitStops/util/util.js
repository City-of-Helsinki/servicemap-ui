export default function getTypeAndClass(vehicleType) {
  switch (vehicleType) {
    case 0: // Tram stops
      return { color: '#00985F', className: 'icon-icon-hsl-tram' };
    case 109: // Train stops
      return { color: '#8C4799', className: 'icon-icon-hsl-train' };
    case 1: // Subway stops
      return { color: '#FF6319', className: 'icon-icon-hsl-metro' };
    case 7: // Bike stations
      return { color: '#fcb919', className: 'icon-icon-hsl-bike' };
    case -999:
    case 4: // Ferry stops
      return { color: '#00B9E4', className: 'icon-icon-hsl-ferry' };
    case 3: // Bus stops
    default:
      return { color: '#007AC9', className: 'icon-icon-hsl-bus' };
  }
}
