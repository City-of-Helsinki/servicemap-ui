import isClient from '../../../utils';
import { mapTypes } from '../config/mapConfig';
import { drawMarkerIcon } from './drawIcon';


const createMarkerClusterLayer = (
  leaflet,
  map,
  classes,
  popupTexts,
  embeded,
  navigator,
  settings,
  getLocaleText,
  getDistance,
) => {
  const {
    divIcon, point, markerClusterGroup,
  } = leaflet || {};

  if (
    !divIcon || !point || !markerClusterGroup
    || !map || !classes || !getLocaleText
    || !navigator || !isClient()
  ) {
    return null;
  }

  // Function for creating custom icon for cluster group
  // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster) {
    const icon = divIcon({
      html: `<span aria-hidden="true" tabindex="-1">${cluster.getChildCount()}</span>`,
      className: `unitClusterMarker ${classes.unitClusterMarker}`,
      iconSize: point(30, 30, true),
    });
    return icon;
  };

  const { clusterPopupVisibility, maxZoom, minZoom } = mapTypes[settings.mapType || 'servicemap'];
  const maxClusterRadius = (zoom) => {
    const normalizedZoom = (zoom - minZoom) / (maxZoom - minZoom);
    return Math.round(100 * (1 - normalizedZoom));
  };

  const onClusterItemClick = (unit) => {
    if (navigator && unit) {
      navigator.push('unit', { id: unit.id });
    }
  };


  // Cluster layer
  const markers = markerClusterGroup({
    animate: true,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    iconCreateFunction: createClusterCustomIcon,
    maxClusterRadius,
    removeOutsideVisibleBounds: true,
    zoomToBoundsOnClick: !embeded,
  });

  // eslint-disable-next-line no-underscore-dangle
  const showListOfUnits = () => (map.leafletElement._zoom > clusterPopupVisibility);

  // Generate popup content element
  const createPopupContent = (units) => {
    const hideNodeFromSR = (node) => {
      node.setAttribute('aria-hidden', 'true');
    };
    // Create container and title
    const container = document.createElement('div');
    container.className = classes.unitTooltipContainer;

    // Render simple info popup
    if (!showListOfUnits()) {
      const title = document.createElement('p');
      title.innerText = popupTexts.info(units.length);
      title.className = classes.unitTooltipTitle;
      container.appendChild(title);

      return container;
    }

    /**
     * Create element with list of units in cluster
     * */
    hideNodeFromSR(container);
    const title = document.createElement('p');
    title.innerText = popupTexts.title;
    title.className = classes.unitPopupTitle;
    container.appendChild(title);

    // Add list element
    const list = document.createElement('ul');
    list.className = classes.unitPopupList;

    // Add list items to list
    units.forEach((unit) => {
      const listItem = document.createElement('li');
      listItem.onclick = () => {
        if (onClusterItemClick) {
          onClusterItemClick(unit);
        }
      };

      let content = '';
      if (unit && unit.name) {
        content += `<p class="${classes.unitPopupItem}">${getLocaleText(unit.name)}</p>`;
      }

      // Distance
      const distance = getDistance(unit);

      if (distance) {
        content += `<p class="${classes.unitPopupDistance} popup-distance">${distance.distance}${distance.type}</p>`;
      }
      listItem.innerHTML = content;
      list.appendChild(listItem);
      // Divider element
      const divider = document.createElement('li');
      hideNodeFromSR(divider);
      divider.className = 'popup-divider';
      divider.innerHTML = '<hr />';
      list.appendChild(divider);
    });
    container.appendChild(list);
    return container;
  };

  /**
   * Events
   */
  markers.on('clustermouseover', (a) => {
    if (embeded) {
      return;
    }
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
      closeButton: showListOfUnits(),
      offset: [4, -14],
    }).openPopup();
  })
    .on('clustermouseout', () => {
      if (embeded) {
        return;
      }
      if (!showListOfUnits()) {
        map.leafletElement.closePopup();
      }
    })
    .on('clusterclick', () => {
      if (embeded) {
        window.open(window.location.href.replace('/embed', ''));
      }
    });

  // Hide clusters and markers from keyboard after clustering animations are done
  markers.on('animationend', () => {
    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });
  });

  return markers;
};

const renderUnitMarkers = (
  getLocaleText,
  navigator,
  theme,
  leaflet,
  map,
  data,
  classes,
  clusterLayer,
  embeded,
  generatePath,
  getDistance,
) => {
  const {
    marker,
  } = leaflet || {};
  if (!data || !marker || !clusterLayer || !classes) {
    return;
  }

  const useContrast = theme === 'dark';

  // Handle unit markers
  const tooltipOptions = markerCount => ({
    className: classes.unitTooltipContainer,
    direction: 'top',
    permanent: markerCount === 1,
    opacity: 1,
    offset: [0, -25],
  });

  const unitListFiltered = data.units.filter(unit => unit.object_type === 'unit');
  if (marker && unitListFiltered.length) {
    clusterLayer.clearLayers();
    // Add unit markers to clusterlayer
    unitListFiltered.forEach((unit) => {
      // Show markers with location
      if (unit && unit.location) {
        // Distance
        const distance = getDistance(unit);
        // Add title
        let tooltipContent = `<p class="${classes.unitTooltipTitle}">${unit.name && getLocaleText(unit.name)}</p>`;
        tooltipContent += `<div class="${classes.unitTooltipSubContainer}">`;
        // Add address subtitle
        tooltipContent += `${unit.street_address ? `<p  class="${classes.unitTooltipSubtitle}">${getLocaleText(unit.street_address)}</p>` : ''}`;
        // Add distance subtitle
        if (distance) {
          tooltipContent += `<p class="${classes.unitTooltipSubtitle}">${distance.distance}${distance.type}</p>`;
        }
        tooltipContent += '</div>';

        const markerElem = marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(useContrast),
            customUnitData: unit,
            keyboard: false,
          },
        ).bindTooltip(
          tooltipContent,
          tooltipOptions(unitListFiltered.length),
        );

        if (unitListFiltered.length > 1 || embeded) {
          markerElem.on('click', () => {
            if (embeded) {
              const { origin } = window.location;
              const path = generatePath('unit', { id: unit.id });
              window.open(`${origin}${path}`);
              return;
            }
            if (navigator) {
              navigator.push('unit', { id: unit.id });
            }
          })
            .on('mouseover', () => {
              map.closePopup();
            });
        }

        clusterLayer.addLayer(markerElem);
      }
    });

    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });
  }
};


// Connector (closure) function used to add state values in redux connect
export const markerClusterConnector = (
  navigator,
  settings,
  getLocaleText,
  getDistance,
) => (
  leaflet, map, classes, popupTexts, embeded,
) => (
  createMarkerClusterLayer(
    leaflet,
    map,
    classes,
    popupTexts,
    embeded,
    navigator,
    settings,
    getLocaleText,
    getDistance,
  )
);

// Connector (closure) function used to add state values in redux connect
export const renderMarkerConnector = (
  getLocaleText, navigator, theme, generatePath, getDistance,
) => (
  leaflet, map, data, classes, clusterLayer, embeded,
) => renderUnitMarkers(
  getLocaleText,
  navigator,
  theme,
  leaflet,
  map,
  data,
  classes,
  clusterLayer,
  embeded,
  generatePath,
  getDistance,
);
