import isClient from '../../../utils';
import { mapTypes } from '../config/mapConfig';


const createMarkerClusterLayer = (leaflet, map, classes, settings, getLocaleText, navigator) => {
  const {
    divIcon, point, markerClusterGroup,
  } = leaflet || {};

  console.group('createMarkerClusterLayer');
  if (
    !divIcon || !point || !markerClusterGroup
    || !map || !classes || !settings || !getLocaleText
    || !navigator || !isClient()
  ) {
    console.log('Failed');
    return null;
  }

  // Function for creating custom icon for clustere group
  // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster) {
    const icon = divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: 'marker-cluster-custom',
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

      units.forEach((unit) => {
        const listItem = document.createElement('li');
        listItem.onclick = () => {
          if (onClusterItemClick) {
            onClusterItemClick(unit);
          }
        };

        let content = '';
        if (unit && unit.name) {
          content += `<p class="${classes.unitTooltipTitle}">${getLocaleText(unit.name)}</p>`;
        }
        listItem.innerHTML = content;
        list.appendChild(listItem);
      });
      a.layer.bindPopup(list).openPopup();
    }
  });

  console.groupEnd('createMarkerClusterLayer');
  return markers;
};

// Connector (closure) function used to add state values once in redux connect function
export const markerClusterConnector = (settings, getLocaleText, navigator) => (
  leaflet, map, classes,
) => (
  createMarkerClusterLayer(leaflet, map, classes, settings, getLocaleText, navigator)
);

const createMarkers = () => {

};


export default { createMarkerClusterLayer, createMarkers };
