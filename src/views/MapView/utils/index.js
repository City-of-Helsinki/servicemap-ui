const adjustControlElements = () => {
  // Hide leaflet attribution from screen readers
  const element = document.querySelector('.leaflet-control-attribution');
  if (element) {
    element.setAttribute('aria-hidden', 'true');
  }

  // Adjust bottom controls to align with pan controls
  const control1 = document.querySelector(
    '.leaflet-bottom.leaflet-right .UserLocation'
  );
  if (control1) {
    const controls = [control1];
    controls.forEach((v) => {
      v.style['margin-right'] = '34px';
    });
  }
};

export default adjustControlElements;
