import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useIntl } from 'react-intl';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';

import { selectNavigator } from '../../../../redux/selectors/general';
import { selectMapType } from '../../../../redux/selectors/settings';
import {
  calculateDistance,
  getCurrentlyUsedPosition,
} from '../../../../redux/selectors/unit';
import {
  getLocale,
  getPage,
  selectThemeMode,
} from '../../../../redux/selectors/user';
import isClient, {
  formatDistanceObject,
  keyboardHandler,
} from '../../../../utils';
import { getAddressFromUnit } from '../../../../utils/address';
import formatEventDate from '../../../../utils/events';
import useMobileStatus from '../../../../utils/isMobile';
import { orderUnits } from '../../../../utils/orderUnits';
import { isEmbed } from '../../../../utils/path';
import SettingsUtility from '../../../../utils/settings';
import UnitHelper from '../../../../utils/unitHelper';
import useLocaleText from '../../../../utils/useLocaleText';
import { mapTypes } from '../../config/mapConfig';
import { drawMarkerIcon } from '../../utils/drawIcon';

const tooltipOptions = (permanent, className) => ({
  className,
  direction: 'top',
  permanent,
  opacity: 1,
  offset: [0, -25],
});

const popupOptions = (isMobile) => ({
  autoClose: false,
  autoPan: !!isMobile,
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

function MarkerCluster({
  data,
  highlightedUnit,
  measuringMode,
  disableInteraction,
}) {
  const theme = useTheme();
  const intl = useIntl();
  const distanceCoordinates = useSelector(getCurrentlyUsedPosition);
  const navigator = useSelector(selectNavigator);
  const mapType = useSelector(selectMapType) || SettingsUtility.defaultMapType;
  const currentPage = useSelector(getPage);
  const useContrast = useSelector(selectThemeMode) === 'dark';
  const map = useMap();
  const getLocaleText = useLocaleText();
  const embeded = isEmbed();
  const isMobile = useMobileStatus();
  const locale = useSelector(getLocale);
  const getDistance = (unit) =>
    formatDistanceObject(intl, calculateDistance(unit, distanceCoordinates));
  const [cluster, setCluster] = useState(null);
  // for some reason theme was empty in emotion styled so the emotion/css is used here
  // to access theme
  const unitTooltipTitleClass = css({
    ...theme.typography.subtitle1,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
  });
  const unitTooltipSubtitleClass = css({
    ...theme.typography.body2,
    margin: theme.spacing(0, 1),
  });

  const unitTooltipWrapperClass = css({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2.5),
  });

  const unitTooltipCaptionClass = css({
    fontSize: '0.7725rem',
    lineHeight: '1rem',
    letterSpacing: '0.025rem',
  });

  const unitTooltipEventContainerClass = css({
    paddingLeft: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  });

  const unitTooltipLinkClass = css({
    ...theme.typography.body2,
    paddingTop: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.link.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  });

  const markerCircleClass = css({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '50%',
  });

  const bgCircleClass = css({
    backgroundColor: theme.palette.white.main,
    width: 40,
    height: 40,
    '&.markerHighlighted': {
      ...theme.focusIndicator,
    },
  });

  const outerCircleClass = css({
    background: 'rgba(0, 22, 183, 0.25)',
    width: 40,
    height: 40,
    '&.dark': {
      background: theme.palette.white.main,
    },
  });

  const midCircleClass = css({
    background: 'rgba(0, 22, 183, 0.50)',
    width: 35,
    height: 35,
    '&.dark': {
      background: theme.palette.white.dark,
    },
  });

  const innerCircleClass = css({
    fontFamily: 'Lato',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    background: 'rgba(0, 22, 183)',
    width: 30,
    height: 30,
    '&.dark': {
      background: theme.palette.primary.main,
    },
  });
  const unitTooltipContainerClass = css({
    padding: theme.spacing(2),
    textAlign: 'left',
  });
  const unitPopupTitleClass = css({
    ...theme.typography.subtitle1,
    margin: `${theme.spacing(1, 2)} !important`,
    fontWeight: 'bold',
    textAlign: 'center',
  });
  const unitPopupListClass = css({
    listStyleType: 'none',
    padding: 0,
    overflow: 'auto',
    maxHeight: '25vh',
    '& .popup-distance': {
      fontWeight: 'normal',
      fontSize: '0.875rem',
    },
    '& li': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      '& p': {
        margin: theme.spacing(0, 1),
      },
      '& hr': {
        height: 1,
        margin: 0,
        border: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        paddingTop: 0,
        paddingBottom: 0,
        width: '100%',
      },
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.white.light,
      },
      '&:focus': {
        backgroundColor: theme.palette.white.light,
      },
    },
    '& .popup-divider': {
      cursor: 'unset',
      padding: theme.spacing(0, 2),
    },
  });
  const unitPopupItemClass = css({
    ...theme.typography.body2,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
    wordBreak: 'break-word',
  });
  const unitPopupDistanceClass = css({
    ...theme.typography.body2,
    margin: theme.spacing(0.5, 1),
    fontWeight: 'bold',
  });
  const unitMarkerClass = css({
    borderRadius: '50%',
    '&.markerHighlighted': {
      boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.6)',
      '&.dark': {
        boxShadow: '0px 4px 4px 0px rgba(255,255,255,0.8)',
      },
    },
  });

  const unitMarkerEventClass = css({
    borderRadius: 0,
  });
  // Get highlighted unit's marker or cluster marker
  const getHighlightedMarker = (layerSet) => {
    const layers = layerSet || cluster?._featureGroup?._layers;
    const { highlightedUnit } = clusterData;
    if (layers && highlightedUnit?.id) {
      const mIndex = Object.keys(layers).find((m) => {
        const current = layers[m];
        if (current instanceof global.L.MarkerCluster) {
          const clusterMarkers = current.getAllChildMarkers();
          return clusterMarkers.some(
            (marker) =>
              marker?.options?.customUnitData?.id === highlightedUnit.id
          );
        }
        return current?.options?.customUnitData?.id === highlightedUnit.id;
      });
      return layers[mIndex];
    }

    return null;
  };

  const createPopupContent = (unit, distance) =>
    ReactDOMServer.renderToStaticMarkup(
      <div className={unitTooltipWrapperClass}>
        <p className={unitTooltipTitleClass}>
          {unit.name && getLocaleText(unit.name)}
        </p>
        {unit.street_address && (
          <p className={unitTooltipSubtitleClass}>
            {getAddressFromUnit(unit, getLocaleText, intl)}
          </p>
        )}
        {distance && (
          <p
            data-sm="kyyy"
            className={`${unitTooltipSubtitleClass} ${unitTooltipCaptionClass}`}
          >
            {intl.formatMessage({ id: 'unit.distance' })}
            {distance.distance}
            {distance.type}
          </p>
        )}
        {unit.events?.length ? (
          <div className={unitTooltipEventContainerClass}>
            <StyledUnitTooltipDivider />
            <p className={unitTooltipSubtitleClass}>{unit.events[0].name.fi}</p>
            <p
              className={`${unitTooltipSubtitleClass} ${unitTooltipCaptionClass}`}
            >
              {formatEventDate(unit.events[0], intl)}
            </p>
          </div>
        ) : null}
        {isMobile && (
          <p className={unitTooltipLinkClass}>
            {intl.formatMessage({ id: 'unit.showInformation' })}
          </p>
        )}
      </div>
    );

  // Closure function for handling unit based popup content
  const getUnitPopupContent = (unit) => {
    const distance = getDistance(unit);
    return createPopupContent(unit, distance);
  };

  // Open highlighted units' popup
  const openHighlightUnitPopup = (mapLayers) => {
    if (disableInteraction) return;
    const highlightedMarker = getHighlightedMarker(mapLayers);
    if (highlightedMarker && UnitHelper.isUnitPage()) {
      // Close all open popups
      map.eachLayer((layer) => {
        layer.closePopup();
      });
      if (highlightedMarker instanceof global.L.MarkerCluster) {
        const tooltipContent = getUnitPopupContent(clusterData.highlightedUnit);
        highlightedMarker.bindPopup(tooltipContent, popupOptions()).openPopup();
      } else {
        highlightedMarker.openPopup();
      }
    }
  };

  const createMarkerClusterLayer = (
    createClusterCustomIcon,
    clusterMouseover,
    clusterMouseout,
    clusterAnimationend,
    showListOfUnits
  ) => {
    if (!isClient()) {
      return null;
    }

    const clusterLayer = global.L.markerClusterGroup({
      animate: true,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      iconCreateFunction: createClusterCustomIcon,
      maxClusterRadius: 40,
      removeOutsideVisibleBounds: true,
      zoomToBoundsOnClick: true,
    });

    clusterLayer.on('clustermouseover', (a) => {
      if (clusterMouseover && !isEmbed()) clusterMouseover(a);
    });
    // Add click events as alternative way to trigger hover events on mobile
    clusterLayer.on('clusterclick', (a) => {
      if (clusterMouseover && showListOfUnits()) {
        clusterMouseover(a);
      }
    });

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

  const createTooltipContent = (unit, distance) =>
    ReactDOMServer.renderToStaticMarkup(
      <div>
        <p className={unitTooltipTitleClass}>
          {unit.name && getLocaleText(unit.name)}
        </p>
        <StyledUnitTooltipSubContainer>
          {unit.street_address && (
            <p className={unitTooltipSubtitleClass}>
              {typeof unit.street_address === 'string'
                ? unit.street_address
                : getLocaleText(unit.street_address)}
            </p>
          )}
          {distance && (
            <p className={unitTooltipSubtitleClass}>
              {distance.distance}
              {distance.type}
            </p>
          )}
        </StyledUnitTooltipSubContainer>
      </div>
    );

  // Parse unitData from clusterMarker
  const parseUnitData = (marker) => {
    if (!(marker instanceof global.L.MarkerCluster)) {
      return null;
    }
    return marker
      .getAllChildMarkers()
      .map((marker) => marker?.options?.customUnitData)
      .filter((unitData) => !!unitData);
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
      .map(
        (marker) =>
          marker?.options?.customUnitData?.id &&
          `unit-marker-${marker.options.customUnitData.id}`
      )
      .filter((v) => !!v);
    const iconClasses = unitClasses.join(' ');
    const icon = global.L.divIcon({
      html: `
        <div class="${bgCircleClass} ${markerCircleClass} ${iconClasses}" aria-hidden="true" tabindex="-1">
          <div
            class="${outerCircleClass} ${markerCircleClass} ${useContrast ? 'dark' : ''}"
            aria-hidden="true"
            tabindex="-1"
          >
            <div
              class="${midCircleClass} ${markerCircleClass} ${useContrast ? 'dark' : ''}"
              aria-hidden="true"
              tabindex="-1"
            >
              <div
                class="${innerCircleClass} ${markerCircleClass} ${useContrast ? 'dark' : ''}"
                aria-hidden="true"
                tabindex="-1"
              >
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
    if (
      marker.options.customUnitData.id ===
      highlightedMarker?.options.customUnitData.id
    ) {
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

  const { clusterPopupVisibility } = mapTypes[mapType];
  const popupTexts = {
    title: intl.formatMessage({ id: 'unit.plural' }),
    info: (count) =>
      intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count }),
  };
  const onClusterItemClick = (unit) => {
    UnitHelper.unitElementClick(navigator, unit);
  };
  const showListOfUnits = () => map.getZoom() > clusterPopupVisibility;

  // Cluster popup content
  const clusterPopupContent = (units) => {
    // Create container and title
    const container = document.createElement('div');
    container.className = unitTooltipContainerClass;
    container.setAttribute('aria-hidden', 'true');

    // Render simple info popup
    if (!showListOfUnits()) {
      const title = document.createElement('p');
      title.innerText = popupTexts.info(units.length);
      title.className = unitTooltipTitleClass;
      container.appendChild(title);

      return container;
    }

    /**
     * Render element with list of units in cluster
     * */
    const title = document.createElement('p');
    title.innerText = popupTexts.title;
    title.className = unitPopupTitleClass;
    container.appendChild(title);

    // Add list element
    const list = document.createElement('ul');
    list.className = unitPopupListClass;

    // Add units to list
    units
      .filter((unit) => unit?.name)
      .forEach((unit) => {
        const listItem = document.createElement('li');
        // Create span for interactive list item content
        const span = document.createElement('span');
        listItem.setAttribute('tabindex', '0');
        listItem.setAttribute('role', 'link');
        listItem.onkeydown = keyboardHandler(
          () => onClusterItemClick(unit),
          ['enter', 'space']
        );
        listItem.onclick = () => {
          if (onClusterItemClick) {
            onClusterItemClick(unit);
          }
        };

        // Create span content
        let content = `<p class="${unitPopupItemClass}">${getLocaleText(unit.name)}</p>`;
        // Distance
        const distance = getDistance(unit);
        if (distance) {
          content += `<p class="${unitPopupDistanceClass} popup-distance">${distance.distance}${distance.type}</p>`;
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
    if (!showListOfUnits() && cluster !== clusterData.highlightedCluster) {
      cluster.closePopup();
    }
  };

  const clusterMouseover = (a) => {
    const cluster = a?.layer;
    // Don't open new cluster if cluster already has popup that is open
    if (cluster.isPopupOpen()) {
      return;
    }
    const units = orderUnits(parseUnitData(cluster), {
      locale,
      direction: 'desc',
      order: 'alphabetical',
    });

    // Create popuelement and add events
    const elem = clusterPopupContent(units);
    // Bind and open popup with content to cluster
    a.layer
      .bindPopup(elem, {
        closeButton: true,
        offset: [4, -14],
      })
      .openPopup();
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
      showListOfUnits
    );
    // Add cluster to map
    map.addLayer(mcg);
    // Set cluster to state
    setCluster(mcg);
    return () => {
      mcg.clearLayers();
    };
    // this affects the distance calculation
  }, [distanceCoordinates]);

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
    const unitListFiltered = data.filter((unit) => unit.object_type === 'unit');
    if (!unitListFiltered.length) {
      return;
    }

    const markers = [];

    // Add unit markers to clusterlayer
    unitListFiltered
      .filter((unit) => unit?.location)
      .forEach((unit) => {
        // Distance
        const distance = getDistance(unit);
        const tooltipContent = createTooltipContent(unit, distance);
        const popupContent = createPopupContent(unit, distance);
        const tooltipPermanent =
          highlightedUnit &&
          highlightedUnit.id === unit.id &&
          UnitHelper.isUnitPage();
        const unitHasEvents = tooltipPermanent && unit.events?.length;

        const markerClasses = [
          `unit-marker-${unit.id}`,
          unitMarkerClass,
          unitHasEvents ? unitMarkerEventClass : '',
          useContrast ? ' dark' : '',
        ].join(' ');
        const markerElem = global.L.marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(
              useContrast,
              markerClasses,
              tooltipPermanent && unitHasEvents
            ),
            customUnitData: unit,
            keyboard: false,
          }
        ).bindPopup(popupContent, popupOptions(isMobile));

        if (isMobile) {
          markerElem.on('popupopen', (e) => {
            // Bind click event to popup when popup is opened
            e.popup
              .getElement()
              .addEventListener('click', () =>
                UnitHelper.unitElementClick(navigator, unit)
              );
          });
        }

        // If not highlighted marker add tooltip
        if (!tooltipPermanent && !isMobile) {
          markerElem.bindTooltip(
            tooltipContent,
            tooltipOptions(false, unitTooltipContainerClass)
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
      });

    // Add markers in bulk
    cluster.addLayers(markers);

    // Hide all markers from screen readers
    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
      // Remove marker interaction when using measuring tool or if interactions are disabled
      if (measuringMode || disableInteraction)
        item.classList.remove('leaflet-interactive');
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
}

MarkerCluster.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
};

export default MarkerCluster;

const StyledUnitTooltipSubContainer = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const StyledUnitTooltipDivider = styled.hr(() => ({
  backgroundColor: 'rgba(0, 0, 0, 0.12)',
  height: 1,
  border: 'none',
  marginLeft: -8,
  marginRight: -8,
}));
