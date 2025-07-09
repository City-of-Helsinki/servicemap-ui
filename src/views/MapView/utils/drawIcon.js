import entranceIcon from '../../../assets/icons/doorIcon.svg';
import entranceIconContrast from '../../../assets/icons/doorIconContrast.svg';
import berryIcon from '../../../assets/icons/LocationDefault.svg';
import berryIconContrast from '../../../assets/icons/LocationDefaultContrast.svg';
import berryEventIconContrast from '../../../assets/icons/LocationEventContrast.svg';
import berryEventIcon from '../../../assets/icons/LocationEventDefault.svg';

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

// NumberCircleMaker configurations
const CIRCLE_MARKER_FONT_SIZE = 32;
const CIRCLE_MARKER_PADDING = 15;

const berryCenter = (value) => {
  let rotation = value;
  rotation = (Math.PI * rotation) / 180;
  const x = 0.8 * Math.cos(rotation) * ratio * stemDefaults.top + size / 2;
  const y =
    -Math.sin(rotation) * ratio * stemDefaults.top +
    size -
    ratio * stemDefaults.base;
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
  color = stemDefaults.color
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

export const drawMarkerIcon = (
  contrast = false,
  className = '',
  eventIcon,
  popupAnchor
) => {
  const L = require('leaflet'); // eslint-disable-line global-require

  let icon;
  let iconSize = [30, 30];
  let iconAnchor = [15, 15];

  if (eventIcon) {
    iconSize = [36, 36];
    iconAnchor = [14, 19];
    icon = contrast ? berryEventIconContrast : berryEventIcon;
  } else {
    icon = contrast ? berryIconContrast : berryIcon;
  }

  // Generate marker icon
  const markerIcon = L.icon({
    iconUrl: icon,
    iconSize,
    iconAnchor,
    popupAnchor: popupAnchor || [-3, 11],
    tooltipAnchor: [0, 11],
    className: `unitMarker ${className}`,
  });

  return markerIcon;
};

export const drawEntranceMarkreIcon = (contrast = false, className = '') => {
  const L = require('leaflet'); // eslint-disable-line global-require

  // Generate marker icon
  const markerIcon = L.icon({
    iconUrl: contrast ? entranceIconContrast : entranceIcon,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: `entranceMarker ${className}`,
  });

  return markerIcon;
};

export class NumberCircleMaker {
  constructor(diameter1) {
    this.diameter = diameter1;
  }

  stroke = (c, callback) => {
    c.beginPath();
    callback(c);
    c.fill();
    return c.closePath();
  };

  drawNumber = (ctx, num, width) => {
    const position = width / 2 + CIRCLE_MARKER_PADDING;
    return ctx.fillText(num, position, position);
  };

  drawCircle = (ctx, diameter) =>
    this.stroke(ctx, (ctx) => {
      const radius = diameter / 2 + CIRCLE_MARKER_PADDING;
      return ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    });

  initContext = (ctx) => {
    ctx.font = `bold ${CIRCLE_MARKER_FONT_SIZE}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    return ctx;
  };

  drawNumberedCircle = (ctx, num) => {
    let number = num;
    this.initContext(ctx);
    number = num.toString();
    ctx.fillStyle = '#ffffff';
    const numberDimensions = ctx.measureText(num);
    const { width } = numberDimensions;
    const scalingFactor = this.diameter / (width + 2 * CIRCLE_MARKER_PADDING);
    ctx.save();
    ctx.scale(scalingFactor, scalingFactor);
    this.drawNumber(ctx, number, numberDimensions.width);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#000000';
    this.drawCircle(ctx, numberDimensions.width);
    return ctx.restore();
  };
}

export default drawMarkerIcon;
