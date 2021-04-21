export const adjustControlElements = () => {
  // Hide leaflet controls from screen readers
  const e = document.querySelector('.leaflet-control-zoom');
  const e2 = document.querySelector('.leaflet-control-attribution');
  if (e) { e.setAttribute('aria-hidden', 'true'); }
  if (e2) { e2.setAttribute('aria-hidden', 'true'); }

  // Adjust bottom controls to align with pan controls
  const control1 = document.querySelector('.leaflet-bottom.leaflet-right [class="leaflet-control"]');
  const control2 = document.querySelector('.leaflet-bottom.leaflet-right .leaflet-control-zoom');
  if (control1 && control2) {
    const controls = [control1, control2];
    controls.forEach(v => {
      v.style['margin-right'] = '43px';
    });
  }
}
