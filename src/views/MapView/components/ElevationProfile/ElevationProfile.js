import {
  createElementHook,
  createLeafComponent,
  createControlComponent,
  createPathHook,
} from '@react-leaflet/core';
import { useSelector } from 'react-redux';
import { selectMapRef } from '../../../../redux/selectors/general';

let L;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  console.log('leaflet', L);
  require('@raruto/leaflet-elevation');
  console.log('leaflet-elevation', L);
}

/* eslint-disable global-require */
// import * as elevation from '@raruto/leaflet-elevation';

// function ElevationProfile(props) {
//   const context = useLeafletContext();
//
//   // const center = [25.110242620744813, 60.31393682886327];
//   const center = [60.31393682886327, 25.110242620744813];
//   console.log('center 222', center);
//   useEffect(() => {
//     const bounds = L.latLng(center).toBounds(1000)
//     const square = new L.Rectangle(bounds)
//     const container = context.layerContainer || context.map
//     container.addLayer(square);
//
//     return () => {
//       container.removeLayer(square)
//     }
//   });
//
//   return null;
// }

const createElevationOptions = () => ({

  // Default chart colors: theme lime-theme, magenta-theme, ...
  theme: 'lightblue-theme',

  // Chart container outside/inside map container
  detached: true,

  // if (detached), the elevation chart container
  elevationDiv: '#elevation-div',

  // if (!detached) autohide chart profile on chart mouseleave
  autohide: false,

  // if (!detached) initial state of chart profile control
  collapsed: false,

  // if (!detached) control position on one of map corners
  position: 'topright',

  // Toggle close icon visibility
  closeBtn: true,

  // Autoupdate map center on chart mouseover.
  followMarker: true,

  // Autoupdate map bounds on chart update.
  autofitBounds: true,

  // Chart distance/elevation units.
  imperial: false,

  // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
  reverseCoords: false,

  // Acceleration chart profile: true || "summary" || "disabled" || false
  acceleration: false,

  // Slope chart profile: true || "summary" || "disabled" || false
  slope: false,

  // Speed chart profile: true || "summary" || "disabled" || false
  speed: false,

  // Altitude chart profile: true || "summary" || "disabled" || false
  altitude: true,

  // Display time info: true || "summary" || false
  time: true,

  // Display distance info: true || "summary" || false
  distance: true,

  // Summary track info style: "inline" || "multiline" || false
  summary: 'multiline',

  // Download link: "link" || false || "modal"
  downloadLink: 'link',

  // Toggle chart ruler filter
  ruler: true,

  // Toggle chart legend filter
  legend: true,

  // Toggle "leaflet-almostover" integration
  almostOver: true,

  // Toggle "leaflet-distance-markers" integration
  distanceMarkers: false,

  // Toggle "leaflet-edgescale" integration
  edgeScale: false,

  // Toggle "leaflet-hotline" integration
  hotline: true,

  // Display track datetimes: true || false
  timestamps: false,

  // Display track waypoints: true || "markers" || "dots" || false
  waypoints: true,

  // Toggle custom waypoint icons: true || { associative array of <sym> tags } || false
  wptIcons: {
    '': L.divIcon({
      className: 'elevation-waypoint-marker',
      html: '<i class="elevation-waypoint-icon"></i>',
      iconSize: [30, 30],
      iconAnchor: [8, 30],
    }),
  },

  // Toggle waypoint labels: true || "markers" || "dots" || false
  wptLabels: true,

  // Render chart profiles as Canvas or SVG Paths
  preferCanvas: true,

});

function getBounds(props) {
  // const map = useSelector(selectMapRef);
  console.log('getBounds center', props.center);
  console.log('getBounds size', props.size);
  console.log('getBounds track', props.track);
  return L.latLng(props.center).toBounds(props.size);
}

function createSquare(props, context) {
  console.log('createSquare context', context);
  const elevation = L.control.elevation(createElevationOptions()).addTo(context.map);
  console.log('getBounds elevation', elevation);
  elevation.load(props.track);
  return { instance: elevation, context };
}

function updateSquare(instance, props, prevProps) {
  console.log('updateSquare', instance);
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

const useSquareElement = createElementHook(createSquare, updateSquare);
const useSquare = createPathHook(useSquareElement);
const ElevationProfile = createControlComponent((dick ) => {
  console.log('dick', dick);
  useSquare(dick);
});

export default ElevationProfile;
