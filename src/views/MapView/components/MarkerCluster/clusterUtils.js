import ReactDOMServer from 'react-dom/server';
import React from 'react';
import isClient from '../../../../utils';
import { isEmbed } from '../../../../utils/path';
import { getAddressFromUnit } from '../../../../utils/address';

export const createMarkerClusterLayer = (
  createClusterCustomIcon,
  clusterMouseover,
  clusterMouseout,
  clusterAnimationend,
  showListOfUnits,
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
    maxClusterRadius: 40,
    removeOutsideVisibleBounds: true,
    zoomToBoundsOnClick: !embeded,
  });

  if (!embeded) {
    clusterLayer.on('clustermouseover', (a) => {
      if (clusterMouseover) clusterMouseover(a);
    });
    // Add click events as alternative way to trigger hover events on mobile
    clusterLayer.on('clusterclick', (a) => {
      if (clusterMouseover && showListOfUnits()) {
        clusterMouseover(a);
      }
    });
  } else {
    // Add cluster click when embeded
    clusterLayer.on('clusterclick', () => {
      window.open(window.location.href.replace('/embed', ''));
    });
  }

  // Hide clusters and markers from keyboard after clustering animations are done
  clusterLayer.on('animationend', (a) => {
    if (clusterAnimationend) clusterAnimationend(a);

    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });
  });

  // Run clustermouseout function
  clusterLayer.on('clustermouseout', (a) => {
    if (clusterMouseout) clusterMouseout(a);
  });


  return clusterLayer;
};

export const createTooltipContent = (unit, classes, getLocaleText, distance) => (
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


export const createPopupContent = (unit, classes, getLocaleText, distance, intl, isMobile) => (
  ReactDOMServer.renderToStaticMarkup(
    <div className={classes.unitTooltipWrapper}>
      <p className={classes.unitTooltipTitle}>{unit.name && getLocaleText(unit.name)}</p>
      <div className={classes.unitTooltipSubContainer}>
        {
          unit.street_address
          && (
            <p className={classes.unitTooltipSubtitle}>
              {getAddressFromUnit(unit, getLocaleText, intl)}
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
      {isMobile && (
        <p className={classes.unitTooltipLink}>
          {intl.formatMessage({ id: 'unit.showInformation' })}
        </p>
      )}
    </div>,
  )
);
