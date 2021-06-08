import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { isEmbed } from '../../../../utils/path';
import { createMarkerClusterLayer, createTooltipContent, createPopupContent } from './clusterUtils';
import { mapTypes } from '../../config/mapConfig';
import { keyboardHandler } from '../../../../utils';
import UnitHelper from '../../../../utils/unitHelper';
import useMobileStatus from '../../../../utils/isMobile';
import useLocaleText from '../../../../utils/useLocaleText';

const tooltipOptions = (permanent, classes) => ({
  className: classes.unitTooltipContainer,
  direction: 'top',
  permanent,
  opacity: 1,
  offset: [0, -25],
});

const popupOptions = () => ({
  autoClose: false,
  autoPan: false,
  closeButton: true,
  closeOnClick: false,
  direction: 'top',
  opacity: 1,
  offset: [2, -20],
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
  currentPage,
  data,
  getDistance,
  highlightedUnit,
  map,
  navigator,
  settings,
  theme,
  measuringMode,
}) => {
  const getLocaleText = useLocaleText();
  const useContrast = theme === 'dark';
  const embeded = isEmbed();
  const isMobile = useMobileStatus();
  const intl = useIntl();
  const [cluster, setCluster] = useState(null);

  // Get highlighted unit's marker or cluster marker
  const getHighlightedMarker = (layerSet) => {
    const layers = layerSet || cluster?._featureGroup?._layers;
    const { highlightedUnit } = clusterData;
    if (layers && highlightedUnit?.id) {
      const mIndex = Object.keys(layers).find((m) => {
        const current = layers[m];
        if (current instanceof global.L.MarkerCluster) {
          const clusterMarkers = current.getAllChildMarkers();
          const marker = clusterMarkers.some(marker => marker?.options?.customUnitData?.id === highlightedUnit.id);
          return marker;
        }
        return current?.options?.customUnitData?.id === highlightedUnit.id;
      });
      return layers[mIndex];
    }

    return null;
  };

  // Closure function for handling unit based popup content
  const getUnitPopupContent = (unit) => {
    const distance = getDistance(unit, intl);
    return createPopupContent(
      unit,
      classes,
      getLocaleText,
      distance,
      intl,
      isMobile,
    );
  };

  // Open highlighted units' popup
  const openHighlightUnitPopup = (mapLayers) => {
    const highlightedMarker = getHighlightedMarker(mapLayers);
    if (highlightedMarker && UnitHelper.isUnitPage()) {
      const tooltipContent = getUnitPopupContent(clusterData.highlightedUnit);
      // Close all open popups
      map.eachLayer((layer) => {
        layer.closePopup();
      });
      if (highlightedMarker instanceof global.L.MarkerCluster) {
        highlightedMarker.bindPopup(tooltipContent, popupOptions()).openPopup();
      } else {
        highlightedMarker.openPopup();
      }
    }
  };

  // Parse unitData from clusterMarker
  const parseUnitData = (marker) => {
    if (marker instanceof global.L.MarkerCluster) {
      const clusterMarkers = marker.getAllChildMarkers();
      const units = clusterMarkers.map((marker) => {
        if (marker && marker.options && marker.options.customUnitData) {
          const data = marker.options.customUnitData;
          return data;
        }
        return null;
      });

      return units;
    }
    return null;
  };

  // Function for creating custom icon for cluster group
  // https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
  // NOTE: iconCreateFunction is running by leaflet, which is not support ES6 arrow func syntax
  // eslint-disable-next-line
  const createClusterCustomIcon = function (cluster) {
    const cCount = cluster.getChildCount();
    const iconSize = getClusterIconSize(cCount);
    const children = cluster.getAllChildMarkers();
    const unitClasses = children
      .map(marker => marker?.options?.customUnitData?.id && `unit-marker-${marker.options.customUnitData.id}`)
      .filter(v => !!v);
    const iconClasses = unitClasses.join(' ');
    const icon = global.L.divIcon({
      html: `
        <div class="${classes.bgCircle} ${classes.markerCircle} ${iconClasses}" aria-hidden="true" tabindex="-1">
          <div class="${classes.outerCircle} ${classes.markerCircle} ${useContrast ? 'dark' : ''}" aria-hidden="true" tabindex="-1">
            <div class="${classes.midCircle} ${classes.markerCircle} ${useContrast ? 'dark' : ''}" aria-hidden="true" tabindex="-1">
              <div class="${classes.innerCircle} ${classes.markerCircle} ${useContrast ? 'dark' : ''}" aria-hidden="true" tabindex="-1">
                ${cCount}
              </div>
            </div>
          </div>
        </div>
      `,
      className: 'unitClusterMarker',
      iconSize: global.L.point(iconSize, iconSize, true),
    });
    return icon;
  };

  // Remove popup from old marker and set new highligted marker
  const setNewHighlightedMarker = (marker) => {
    if (!marker) return;
    const { highlightedMarker } = clusterData;
    // Open popoup on marker click even if it is already highlighted unit.
    if (marker.options.customUnitData.id === highlightedMarker?.options.customUnitData.id) {
      if (marker.isPopupOpen()) {
        marker.openPopup();
      }
    } else {
      // Close popup for highlighterMarker if it exists
      if (highlightedMarker) {
        highlightedMarker.closePopup();
      }
      // Set this marker as highligtedMarker
      clusterData.highlightedMarker = marker;
    }
  };


  const { clusterPopupVisibility } = mapTypes[settings.mapType || 'servicemap'];
  const popupTexts = {
    title: intl.formatMessage({ id: 'unit.plural' }),
    info: count => intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count }),
  };
  const onClusterItemClick = (unit) => {
    UnitHelper.unitElementClick(navigator, unit);
  };
  const showListOfUnits = () => (map.getZoom() > clusterPopupVisibility);

  // Cluster popup content
  const clusterPopupContent = (units) => {
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
        listItem.setAttribute('tabindex', '0');
        listItem.setAttribute('role', 'link');
        listItem.onkeydown = keyboardHandler(() => onClusterItemClick(unit), ['enter', 'space']);
        listItem.onclick = () => {
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
  const clusterMouseout = (a) => {
    if (embeded) {
      return;
    }
    const cluster = a?.layer;
    // Close popup on mouseout if cluster is not highlighted cluster
    // or cluster doesn't show list of units
    if (!showListOfUnits() && cluster !== clusterData.highlightedCluster
    ) {
      cluster.closePopup();
    }
  };

  const clusterMouseover = (a) => {
    const cluster = a?.layer;
    // Don't open new cluster if cluster already has popup that is open
    if (cluster.isPopupOpen()) {
      return;
    }
    const units = parseUnitData(cluster);

    // Create popuelement and add events
    const elem = clusterPopupContent(units);
    // Bind and open popup with content to cluster
    a.layer.bindPopup(elem, {
      closeButton: true,
      offset: [4, -14],
    }).openPopup();
  };

  const clusterAnimationEnd = (a) => {
    // Handle highlighted marker's popup opening when clusters change
    const mapLayers = a?.target?._map?._layers;
    openHighlightUnitPopup(mapLayers);
  };

  // Update highlightedUnit to clusterData object for reference
  useEffect(() => {
    clusterData.highlightedUnit = highlightedUnit;
    if (!highlightedUnit) {
      return;
    }
    if (highlightedUnit && currentPage === 'search' && !isMobile) {
      map.closePopup();
      return;
    }
    openHighlightUnitPopup();
  }, [highlightedUnit, currentPage]);

  // Create and initialize marker cluster layer on mount
  useEffect(() => {
    const mcg = createMarkerClusterLayer(
      createClusterCustomIcon,
      clusterMouseover,
      clusterMouseout,
      clusterAnimationEnd,
      showListOfUnits,
    );
    // Add cluster to map
    map.addLayer(mcg);
    // Set cluster to state
    setCluster(mcg);
    return () => {
      mcg.clearLayers();
    };
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
    // Clear old layers and clusterData
    cluster.clearLayers();

    setNewHighlightedMarker(null);
    clusterData.highlightedCluster = null;
    if (!data.length) {
      return;
    }
    // Filter units of object_type unit
    const unitListFiltered = data.filter(unit => unit.object_type === 'unit');
    if (!unitListFiltered.length) {
      return;
    }

    const markers = [];

    // Add unit markers to clusterlayer
    unitListFiltered.forEach((unit) => {
      // Show markers with location
      if (unit && unit.location) {
        // Distance
        const distance = getDistance(unit, intl);
        const tooltipContent = createTooltipContent(
          unit,
          classes,
          getLocaleText,
          distance,
        );
        const popupContent = createPopupContent(
          unit,
          classes,
          getLocaleText,
          distance,
          intl,
          isMobile,
        );
        const tooltipPermanent = highlightedUnit
          && (highlightedUnit.id === unit.id && UnitHelper.isUnitPage());

        const markerClasses = `unit-marker-${unit.id} ${classes.unitMarker}${useContrast ? ' dark' : ''}`;
        const markerElem = global.L.marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(useContrast, markerClasses),
            customUnitData: unit,
            keyboard: false,
          },
        ).bindPopup(
          popupContent,
          popupOptions(),
        );

        if (isMobile) {
          markerElem.on('popupopen', (e) => {
            // Bind click event to popup when popup is opened
            e.popup.getElement().addEventListener('click',
              () => UnitHelper.unitElementClick(navigator, unit));
          });
        }

        // If not highlighted marker add tooltip
        if (!tooltipPermanent && !isMobile) {
          markerElem.bindTooltip(
            tooltipContent,
            tooltipOptions(false, classes),
          );
        } else {
          // If marker is highlighted save reference
          setNewHighlightedMarker(markerElem);
        }

        if (unitListFiltered.length > 1 || embeded) {
          markerElem.on('click', () => {
            setNewHighlightedMarker(markerElem);
            if (!isMobile) {
              UnitHelper.unitElementClick(navigator, unit);
            }
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
      // Remove marker interaction when using measuring tool
      if (measuringMode) item.classList.remove('leaflet-interactive');
    });
  }, [cluster, data, isMobile, measuringMode]);

  const removeMarkerInteraction = useCallback(() => {
    /* Remove interactions from markers during measuring mode.
     Use callback is used so that cluster.off() works correctly */
    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.classList.remove('leaflet-interactive');
    });
  }, []);

  useEffect(() => {
    if (!cluster) return;
    if (measuringMode) {
      // Add event listener to remove marker interactions when new clusters are generated
      cluster.on('animationend', removeMarkerInteraction);
    } else {
      // Remove event listener when measuring mode is closed
      cluster.off('animationend', removeMarkerInteraction);
    }
  }, [measuringMode]);

  return null;
};

MarkerCluster.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  getDistance: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  theme: PropTypes.string.isRequired,
};

export default MarkerCluster;
