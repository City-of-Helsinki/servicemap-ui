import isClient from '../../../utils';
import { mapTypes } from '../config/mapConfig';
import { drawMarkerIcon } from './drawIcon';


const createMarkerClusterLayer = (
  leaflet,
  map,
  classes,
  popupTitle,
  settings,
  getLocaleText,
  navigator,
) => {
  const {
    divIcon, point, markerClusterGroup,
  } = leaflet || {};

  if (
    !divIcon || !point || !markerClusterGroup
    || !map || !classes || !settings || !getLocaleText
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
      className: classes.unitClusterMarker,
      iconSize: point(30, 30, true),
    });
    return icon;
  };

  const { maxZoom, minZoom } = mapTypes[settings.mapType || 'servicemap'];
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
  });

  // Cluster click event
  markers.on('clusterclick', (a) => {
    // a.layer is actually a cluster
    const clusterMarkers = a.layer.getAllChildMarkers();
    const units = clusterMarkers.map((marker) => {
      if (marker && marker.options && marker.options.customUnitData) {
        const data = marker.options.customUnitData;
        return data;
      }
      return null;
    });

    // Bind and open popup from marker if on max zoom level
    const { maxZoom } = mapTypes[settings.mapType || 'servicemap'];
    // eslint-disable-next-line no-underscore-dangle
    if (map.leafletElement._zoom >= maxZoom) {
      const hideNodeFromSR = (node) => {
        node.setAttribute('aria-hidden', 'true');
      };
      // Create container and title
      const container = document.createElement('div');
      hideNodeFromSR(container);
      const title = document.createElement('p');
      title.innerText = popupTitle;
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

      // Bind and open popup with content to cluster
      a.layer.bindPopup(container, {
        closeButton: false,
        offset: [4, -14],
      }).openPopup();
    }
  });

  return markers;
};

const renderUnitMarkers = (
  settings,
  getLocaleText,
  navigator,
  theme,
  leaflet,
  data,
  classes,
  clusterLayer,
  embeded,
) => {
  const {
    marker,
  } = leaflet || {};
  if (!data || !marker || !clusterLayer || !classes) {
    return;
  }

  const useContrast = theme === 'dark';

  // Handle unit markers
  const tooltipOptions = (unit, markerCount) => ({
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
        const markerElem = marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(useContrast),
            customUnitData: unit,
            keyboard: false,
          },
        ).bindTooltip(
          `<p class="${classes.unitTooltipTitle}">${unit.name && getLocaleText(unit.name)}</p>${unit.street_address ? `<p  class="${classes.unitTooltipSubtitle}">${getLocaleText(unit.street_address)}</p>` : ''}`,
          tooltipOptions(unit, unitListFiltered.length),
        );

        if (unitListFiltered.length > 1) {
          markerElem.on('click', () => {
            if (navigator && !embeded) {
              navigator.push('unit', { id: unit.id });
            }
          });
        }

        clusterLayer.addLayer(markerElem);
      }
    });
  }
};


// Connector (closure) function used to add state values in redux connect
export const markerClusterConnector = (settings, getLocaleText, navigator) => (
  leaflet, map, classes, popupTitle,
) => (
  createMarkerClusterLayer(leaflet, map, classes, popupTitle, settings, getLocaleText, navigator)
);

// Connector (closure) function used to add state values in redux connect
export const renderMarkerConnector = (settings, getLocaleText, navigator, theme) => (
  leaflet, data, classes, clusterLayer, embeded,
) => renderUnitMarkers(
  settings,
  getLocaleText,
  navigator,
  theme,
  leaflet,
  data,
  classes,
  clusterLayer,
  embeded,
);
