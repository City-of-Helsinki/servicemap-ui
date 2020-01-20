import isClient from '../../../utils';
import { mapTypes } from '../config/mapConfig';
import { drawMarkerIcon } from './drawIcon';


const createMarkerClusterLayer = (leaflet, map, classes, settings, getLocaleText, navigator) => {
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

  // Function for creating custom icon for clustere group
  // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster) {
    const icon = divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: classes.unitClusterMarker,
      iconSize: point(40, 40, true),
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
      const list = document.createElement('ul');
      list.className = classes.unitPopupList;

      units.forEach((unit) => {
        const listItem = document.createElement('li');
        listItem.onclick = () => {
          if (onClusterItemClick) {
            onClusterItemClick(unit);
          }
        };

        let content = '';
        if (unit && unit.name) {
          content += `<p class="${classes.unitPopupTitle}">${getLocaleText(unit.name)}</p>`;
        }
        listItem.innerHTML = content;
        list.appendChild(listItem);
      });
      a.layer.bindPopup(list).openPopup();
    }
  });

  return markers;
};

const renderUnitMarkers = (
  settings,
  getLocaleText,
  navigator,
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
        clusterLayer.addLayer(marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(unit, settings),
            title: unit.name && getLocaleText(unit.name),
            alt: unit.street_address && getLocaleText(unit.street_address),
            customUnitData: unit,
          },
        ).on('click', () => {
          if (navigator && !embeded) {
            navigator.push('unit', { id: unit.id });
          }
        }).bindTooltip(
          `<p class="${classes.unitTooltipTitle}">${unit.name && getLocaleText(unit.name)}</p>${unit.street_address ? `<p  class="${classes.unitTooltipSubtitle}">${getLocaleText(unit.street_address)}</p>` : ''}`,
          tooltipOptions(unit, unitListFiltered.length),
        ));
      }
    });
  }
};


// Connector (closure) function used to add state values in redux connect
export const markerClusterConnector = (settings, getLocaleText, navigator) => (
  leaflet, map, classes,
) => (
  createMarkerClusterLayer(leaflet, map, classes, settings, getLocaleText, navigator)
);

// Connector (closure) function used to add state values in redux connect
export const renderMarkerConnector = (settings, getLocaleText, navigator) => (
  leaflet, data, classes, clusterLayer, embeded,
) => renderUnitMarkers(settings, getLocaleText, navigator, leaflet, data, classes, clusterLayer, embeded);
