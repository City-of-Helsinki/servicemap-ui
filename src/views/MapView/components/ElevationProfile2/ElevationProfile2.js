import {
  createElementHook,
  createLeafComponent,
  createPathHook,
} from '@react-leaflet/core';

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

function getBounds(props) {
  console.log('getBounds center', props.center);
  console.log('getBounds size', props.size);
  console.log('getBounds track', props.track);
  console.log('getBounds elevation', L.control.elevation);
  return L.latLng(props.center).toBounds(props.size);
}

function createSquare(props, context) {
  return { instance: new L.Rectangle(getBounds(props)), context }
}

function updateSquare(instance, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props))
  }
}

const useSquareElement = createElementHook(createSquare, updateSquare)
const useSquare = createPathHook(useSquareElement)
const ElevationProfile2 = createLeafComponent(useSquare)

export default ElevationProfile2;
