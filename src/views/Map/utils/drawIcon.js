import { getAccesibilityColor } from '../../../utils/unitHelper';

// This class draws the marker icon into canvas and returns it as png

// Constants
const referenceLength = 4500;
const size = 70;
const ratio = size / referenceLength;
const canvasSize = {
  width: 75,
  height: 75,
};

// Berry specs
const berryDefaults = {
  radius: 1000,
  stroke: 125,
};
// Stem specs
const stemDefaults = {
  width: 250,
  base: 370,
  top: 2670,
  control: 1030,
};

const defaultStemColor = '#333';
const stemColors = {
  servicemap: {
    strokeStyle: '#333',
  },
  ortoImage: {
    strokeStyle: '#fff',
  },
  guideMap: {
    strokeStyle: '#333',
  },
  accessible_map: {
    strokeStyle: '#333',
  },
};

/*
Old berry colors
const berryColors = {
  // Housing and environment
  1400: 'rgb(77, 139, 0)',
  // Administration and economy
  1401: 'rgb(192, 79, 220)',
  // Culture and leisure
  1403: 'rgb(252, 173, 0)',
  // Maps, information services and communication
  1402: 'rgb(154, 0, 0)',
  // Teaching and education
  1087: 'rgb(0, 81, 142)',
  // Family and social services
  783: 'rgb(67, 48, 64)',
  // Child daycare and pre-school education
  1405: 'rgb(60, 210, 0)',
  // Health care
  986: 'rgb(142, 139, 255)',
  // Public safety
  1061: 'rgb(240, 66, 0)',
};
*/

const berryCenter = (value) => {
  let rotation = value;
  rotation = Math.PI * rotation / 180;
  const x = 0.8 * Math.cos(rotation) * ratio * stemDefaults.top + (size / 2);
  const y = -Math.sin(rotation) * ratio * stemDefaults.top + size - ratio * stemDefaults.base;
  return [x, y];
};

const getColor = (mapLayer, property) => {
  if (mapLayer && property) {
    return stemColors[mapLayer][property];
  }
  return defaultStemColor;
};

// Draw functions
const drawBerry = (ctx, center, color) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(...center, berryDefaults.radius * ratio, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,1.0)';
  const oldComposite = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalCompositeOperation = oldComposite;
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(...center, berryDefaults.radius * ratio - 1, 0, 2 * Math.PI);
  ctx.strokeStyle = '#fcf7f5';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
};

const drawStem = (ctx, berryCenter, mapLayer) => {
  ctx.strokeStyle = getColor(mapLayer, 'strokeStyle');
  ctx.lineWidth = ratio * stemDefaults.width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  const startingPoint = [size / 2, size];
  let point = startingPoint;
  ctx.moveTo(...point);
  point[1] -= ratio * stemDefaults.base;
  ctx.lineTo(...point);
  const controlPoint = point;
  controlPoint[1] -= ratio * stemDefaults.control;
  point = berryCenter;
  ctx.quadraticCurveTo(...controlPoint, ...point);
  ctx.stroke();
  ctx.closePath();
};

const drawNumber = (ctx, number) => {
  ctx.font = '30px Arial';
  ctx.fillText(number, canvasSize.width - 30, canvasSize.height - 5);
};


export const drawIcon = (unit, mapLayer, withoutCurve = false) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.height = canvasSize.height;
  canvas.width = canvasSize.width;

  // Berry calculation
  let berryCenterPoint;
  if (withoutCurve) {
    berryCenterPoint = berryCenter(90); // Creates straight line
  } else {
    berryCenterPoint = berryCenter(70 + (unit.id % 40));
  }
  const berryColor = getAccesibilityColor(unit);

  if (Array.isArray(unit)) {
    drawStem(ctx, berryCenterPoint, mapLayer);
    drawBerry(ctx, berryCenterPoint, berryColor);
    drawNumber(ctx, unit.length);
  }
  drawStem(ctx, berryCenterPoint, mapLayer);
  drawBerry(ctx, berryCenterPoint, berryColor);

  return canvas.toDataURL();
};

export const drawMarkerIcon = (unit, mapLayer) => {
  const L = require('leaflet'); // eslint-disable-line global-require

  // Return the drawn icon as lealfet icon
  const markerIcon = L.icon({
    iconUrl: drawIcon(unit, mapLayer),
    iconSize: [40, 40],
    iconAnchor: [20, 37],
  });

  return markerIcon;
};

export default drawMarkerIcon;
