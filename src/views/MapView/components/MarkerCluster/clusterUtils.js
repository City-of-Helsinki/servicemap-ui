import ReactDOMServer from 'react-dom/server';
import React from 'react';
import isClient from '../../../../utils';
import { isEmbed } from '../../../../utils/path';

export const createMarkerClusterLayer = (
  createClusterCustomIcon,
  createPopupContent,
  clusterMouseover,
  clusterMouseout,
  clusterAnimationend,
  maxClusterRadius,
) => {
  if (!isClient()) {
    return null;
  }
  let embeded = false;
  if (global.window) {
    embeded = isEmbed();
  }

  const clusterLayer = global.L.markerClusterGroup({
    animate: true,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction: createClusterCustomIcon,
    maxClusterRadius,
    removeOutsideVisibleBounds: true,
    zoomToBoundsOnClick: !embeded,
  });

  if (!embeded) {
    clusterLayer.on('clustermouseover', (a) => {
      if (clusterMouseover) clusterMouseover(a);

      const clusterMarkers = a.layer.getAllChildMarkers();
      const units = clusterMarkers.map((marker) => {
        if (marker && marker.options && marker.options.customUnitData) {
          const data = marker.options.customUnitData;
          return data;
        }
        return null;
      });

      // Create popuelement and add events
      const elem = createPopupContent(units);
      // Bind and open popup with content to cluster
      a.layer.bindPopup(elem, {
        closeButton: true,
        offset: [4, -14],
      }).openPopup();
    });
  } else {
    // Add cluster click only when embeded
    clusterLayer.on('clusterclick', () => {
      window.open(window.location.href.replace('/embed', ''));
    });
  }

  // Hide clusters and markers from keyboard after clustering animations are done
  clusterLayer.on('animationend', () => {
    if (clusterAnimationend) clusterAnimationend();

    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });
  });

  // Run clustermouseout function
  clusterLayer.on('clustermouseout', () => {
    if (clusterMouseout) clusterMouseout();
  });


  return clusterLayer;
};

export const createMarkerContent = (unit, classes, getLocaleText, distance) => (
  ReactDOMServer.renderToStaticMarkup(
    <div>
      <p className={classes.unitTooltipTitle}>{unit.name && getLocaleText(unit.name)}</p>
      <div className={classes.unitTooltipSubContainer}>
        {
          unit.street_address
          && (
            <p className={classes.unitTooltipSubtitle}>
              {getLocaleText(unit.street_address)}
            </p>
          )
        }
        {
          distance
          && (
            <p className={classes.unitTooltipSubtitle}>
              {distance.distance}
              {distance.type}
            </p>
          )
        }
      </div>
    </div>,
  )
);
