import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

// Manual Canvas mock for Vitest - more comprehensive approach
const mockCanvas = () => {
  const context = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    quadraticCurveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    arcTo: vi.fn(),
    ellipse: vi.fn(),
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
    // Properties
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    globalAlpha: 1,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    direction: 'inherit',
    globalCompositeOperation: 'source-over',
  };

  return context;
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => mockCanvas()),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  // eslint-disable-next-line no-useless-concat
  value: vi.fn(() => 'data:image/png;base64,' + '00'),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: vi.fn(),
});

// Mock width and height properties
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  get: vi.fn(() => 150),
  set: vi.fn(),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  get: vi.fn(() => 150),
  set: vi.fn(),
});

// Prevent vitest test passing if Failed prop type error occures
const originalConsoleError = console.error;
console.error = (message) => {
  if (/(Failed prop type)/.test(message)) {
    throw new Error(message);
  }

  originalConsoleError(message);
};

// Mock matchMedia to prevent crash when using mediaQuery hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock react-router-dom for Vitest
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(() => ({
      pathname: '/fi/',
    })),
  };
});
