import berryIcon from '../../../assets/images/berryIcon.png';

// TODO: If berries are not used anymore, clean unused functionalities here

// Functions draw the marker icon into canvas and returns it as png

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
  color: '#333',
};

const berryCenter = (value) => {
  let rotation = value;
  rotation = Math.PI * rotation / 180;
  const x = 0.8 * Math.cos(rotation) * ratio * stemDefaults.top + (size / 2);
  const y = -Math.sin(rotation) * ratio * stemDefaults.top + size - ratio * stemDefaults.base;
  return [x, y];
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
  // Light border
  ctx.beginPath();
  ctx.arc(...center, berryDefaults.radius * ratio, 0, 2 * Math.PI);
  ctx.strokeStyle = '#fcf7f5';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
};

const drawStem = (
  ctx,
  berryCenter,
  lineWidth = ratio * stemDefaults.width,
  color = stemDefaults.color,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
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

/*
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
    drawStem(ctx, berryCenterPoint);
    drawBerry(ctx, berryCenterPoint, berryColor);
    drawNumber(ctx, unit.length);
  }
  drawStem(ctx, berryCenterPoint);
  drawBerry(ctx, berryCenterPoint, berryColor);

  return canvas.toDataURL();
};
*/

const adjustCurve = (curve) => {
  if (curve) {
    if (curve > 110) {
      return 110;
    }
    if (curve < 70) {
      return 70;
    }
    return curve;
  }
  return 90;
};

export const drawUnitIcon = (berryColor, curve) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.height = canvasSize.height;
  canvas.width = canvasSize.width;


  // Berry calculation
  const berryCenterPoint = berryCenter(adjustCurve(curve));

  const stemRadius = ratio * stemDefaults.width;
  drawStem(ctx, berryCenterPoint, stemRadius + 6, '#fff');
  drawStem(ctx, berryCenterPoint, stemRadius);
  drawBerry(ctx, berryCenterPoint, berryColor);

  return canvas.toDataURL();
};

// Temporary solution
export const drawServiceIcon = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.height = canvasSize.height;
  canvas.width = canvasSize.width;
  const berryColor = 'gray';

  // Berry calculation
  let berryCenterPoint;
  berryCenterPoint = berryCenter(90); // Creates straight line
  drawStem(ctx, berryCenterPoint);
  drawBerry(ctx, berryCenterPoint, berryColor);

  berryCenterPoint = berryCenter(90 + 40);
  drawStem(ctx, berryCenterPoint);
  drawBerry(ctx, berryCenterPoint, berryColor);

  berryCenterPoint = berryCenter(90 - 40);
  drawStem(ctx, berryCenterPoint);
  drawBerry(ctx, berryCenterPoint, berryColor);

  return canvas.toDataURL();
};

export const drawMarkerIcon = () => {
  const L = require('leaflet'); // eslint-disable-line global-require

  // Generate marker icon
  const markerIcon = L.icon({
    iconUrl: berryIcon,
    iconSize: [25, 25],
    iconAnchor: [13, 33],
  });

  return markerIcon;
};

export default drawMarkerIcon;
