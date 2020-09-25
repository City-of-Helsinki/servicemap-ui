import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { generatePath, isEmbed } from '../../../../utils/path';
import { createMarkerClusterLayer, createMarkerContent } from './clusterUtils';
import { mapTypes } from '../../config/mapConfig';
import { keyboardHandler } from '../../../../utils';

// Handle unit markers
const tooltipOptions = (permanent, classes) => ({
  className: classes.unitTooltipContainer,
  direction: 'top',
  permanent,
  opacity: 1,
  offset: [0, -25],
});

// Cluster icon size handler
const getClusterIconSize = (count) => {
  let iconSize;
  if (count >= 1000) iconSize = 45;
  else if (count >= 100) iconSize = 35;
  else iconSize = 30;
  return iconSize;
};

const clusterData = {};

const MarkerCluster = ({
  classes,
  // currentPage,
  data,
  getDistance,
  getLocaleText,
  highlightedUnit,
  map,
  navigator,
  settings,
  theme,
}) => {
  const embeded = isEmbed();
  const intl = useIntl();
  const [cluster, setCluster] = useState(null);

  // Update highlightedUnit to clusterData object for reference
  useEffect(() => {
    clusterData.highlightedUnit = highlightedUnit;
  }, [highlightedUnit]);

  // Function for creating custom icon for cluster group
  // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster) {
    const cCount = cluster.getChildCount();
    const iconSize = getClusterIconSize(cCount);
    const icon = global.L.divIcon({
      html: `<span aria-hidden="true" tabindex="-1">${cCount}</span>`,
      className: `unitClusterMarker ${classes.unitClusterMarker}`,
      iconSize: global.L.point(iconSize, iconSize, true),
    });

    // Add cluster tooltip for highlightedUnit
    if (clusterData.highlightedUnit) {
      const markers = cluster.getAllChildMarkers();
      const marker = markers.find(
        obj => obj.options.customUnitData.id === clusterData.highlightedUnit.id,
      );
      if (marker) {
        const distance = getDistance(clusterData.highlightedUnit, intl);
        const tooltipContent = createMarkerContent(
          clusterData.highlightedUnit, classes, getLocaleText, distance,
        );
        cluster.bindTooltip(tooltipContent, tooltipOptions(true, classes));
      }
    }
    return icon;
  };


  const { clusterPopupVisibility, maxZoom, minZoom } = mapTypes[settings.mapType || 'servicemap'];
  const popupTexts = {
    title: intl.formatMessage({ id: 'unit.plural' }),
    info: count => intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count }),
  };
  const maxClusterRadius = (zoom) => {
    const normalizedZoom = (zoom - minZoom) / (maxZoom - minZoom);
    return Math.round(100 * (1 - normalizedZoom));
  };
  const onClusterItemClick = (unit) => {
    if (navigator && unit) {
      navigator.push('unit', { id: unit.id });
    }
  };
  // eslint-disable-next-line no-underscore-dangle
  const showListOfUnits = () => (map._zoom > clusterPopupVisibility);

  // Cluster popup content
  const clusterPopupContent = () => (units) => {
    // Create container and title
    const container = document.createElement('div');
    container.className = classes.unitTooltipContainer;
    container.setAttribute('aria-hidden', 'true');

    // Render simple info popup
    if (!showListOfUnits()) {
      const title = document.createElement('p');
      title.innerText = popupTexts.info(units.length);
      title.className = classes.unitTooltipTitle;
      container.appendChild(title);

      return container;
    }

    /**
     * Render element with list of units in cluster
     * */
    const title = document.createElement('p');
    title.innerText = popupTexts.title;
    title.className = classes.unitPopupTitle;
    container.appendChild(title);

    // Add list element
    const list = document.createElement('ul');
    list.className = classes.unitPopupList;

    // Add units to list
    units.forEach((unit) => {
      if (unit?.name) {
        const listItem = document.createElement('li');
        // Create span for interactive list item content
        const span = document.createElement('span');
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'link');
        span.onkeydown = keyboardHandler(() => onClusterItemClick(unit), ['enter', 'space']);
        span.onclick = () => {
          if (onClusterItemClick) {
            onClusterItemClick(unit);
          }
        };

        // Create span content
        let content = `<p class="${classes.unitPopupItem}">${getLocaleText(unit.name)}</p>`;
        // Distance
        const distance = getDistance(unit, intl);
        if (distance) {
          content += `<p class="${classes.unitPopupDistance} popup-distance">${distance.distance}${distance.type}</p>`;
        }
        span.innerHTML = content;
        // Append span to listItem
        listItem.append(span);
        // Append listItem to list
        list.appendChild(listItem);

        // Divider element
        const divider = document.createElement('li');
        divider.setAttribute('aria-hidden', 'true');
        divider.className = 'popup-divider';
        divider.innerHTML = '<hr />';
        list.appendChild(divider);
      }
    });
    container.appendChild(list);

    return container;
  };

  // Function for cluster mouseout event
  const clusterMouseout = () => {
    if (embeded) {
      return;
    }
    if (!showListOfUnits()) {
      map.closePopup();
    }
  };

  const clusterMouseover = (a) => {
    if (clusterData.highlightedUnit) {
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
    const elem = clusterPopupContent()(units);
    // Bind and open popup with content to cluster
    a.layer.bindPopup(elem, {
      closeButton: true,
      offset: [4, -14],
    }).openPopup();
  };

  // Create and initialize marker cluster layer on mount
  useEffect(() => {
    const mcg = createMarkerClusterLayer(
      createClusterCustomIcon,
      clusterMouseover,
      clusterMouseout,
      null,
      maxClusterRadius,
    );
    // Add cluster to map
    map.addLayer(mcg);
    // Set cluster to state
    setCluster(mcg);
  }, []);

  /**
   * This effect handles marker rendering using clusterlayer
   * Triggered by changes in data prop and cluster initialization
   */
  useEffect(() => {
    // Clear cluster
    if (!cluster) {
      return;
    }
    cluster.clearLayers();
    if (!data.units.length) {
      return;
    }
    // Filter units of object_type unit
    const unitListFiltered = data.units.filter(unit => unit.object_type === 'unit');
    if (!unitListFiltered.length) {
      return;
    }

    const useContrast = theme === 'dark';
    const markers = [];

    // Add unit markers to clusterlayer
    unitListFiltered.forEach((unit) => {
      // Show markers with location
      if (unit && unit.location) {
        // Distance
        const distance = getDistance(unit, intl);
        const tooltipContent = createMarkerContent(unit, classes, getLocaleText, distance);
        const tooltipPermanent = highlightedUnit && highlightedUnit.id === unit.id;

        const markerElem = global.L.marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(useContrast),
            customUnitData: unit,
            keyboard: false,
          },
        ).bindTooltip(
          tooltipContent,
          tooltipOptions(tooltipPermanent, classes),
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

        markers.push(markerElem);
      }
    });

    // Add markers in bulk
    cluster.addLayers(markers);

    // Hide all markers from screen readers
    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });

    // if (map && data.units.length && !(currentPage === 'address' || currentPage === 'area')) {
    //   // TODO: this should be revisited once new map focusing is implemented
    //   /* Zoom out map to fit all unit markers when unit data changes.
    //   Do not do this on area view and address view */
    //   // fitUnitsToMap(data.units, map);
    // }
  }, [cluster, data]);

  return null;
};

MarkerCluster.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  // currentPage: PropTypes.string.isRequired,
  data: PropTypes.shape({
    units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      }),
    ),
    unitGeometry: PropTypes.array,
  }).isRequired,
  getDistance: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.string.isRequired,
};

export default MarkerCluster;
