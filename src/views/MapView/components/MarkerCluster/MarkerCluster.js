import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { drawMarkerIcon } from '../../utils/drawIcon';
import { generatePath, isEmbed } from '../../../../utils/path';
import { createMarkerClusterLayer, createMarkerContent } from './clusterUtils';
import { mapTypes } from '../../config/mapConfig';
import { keyboardHandler } from '../../../../utils';
import { fitUnitsToMap } from '../../utils/mapActions';

// Handle unit markers
const tooltipOptions = (markerCount, classes) => ({
  className: classes.unitTooltipContainer,
  direction: 'top',
  permanent: markerCount === 1,
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

const MarkerCluster = ({
  classes,
  currentPage,
  data,
  getDistance,
  getLocaleText,
  map,
  navigator,
  settings,
  theme,
}) => {
  const embeded = isEmbed();
  const intl = useIntl();
  const [cluster, setCluster] = useState(null);

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
    const listContent = (
      <>
        <p className={classes.unitPopupTitle}>{popupTexts.title}</p>
        <ul className={classes.unitPopupList}>
          {
            units.map((unit) => {
              const distance = getDistance(unit, intl);
              return (
                <React.Fragment key={unit.id}>
                  <li>
                    <span
                      role="link"
                      tabIndex="0"
                      onClick={() => onClusterItemClick(unit)}
                      onKeyDown={keyboardHandler(() => onClusterItemClick(unit), ['enter', 'space'])}
                    >
                      <p className={classes.unitPopupItem}>{getLocaleText(unit.name)}</p>
                      {
                        distance
                        && (
                          <p className={`${classes.unitPopupDistance} popup-distance`}>
                            {distance.distance}
                            {distance.type}
                          </p>
                        )
                      }
                    </span>
                  </li>
                  <li aria-hidden className="popup-divider"><hr /></li>
                </React.Fragment>
              );
            })
          }
        </ul>
      </>
    );

    // Content when not showing list of units
    const simpleContent = (
      <p className={classes.unitTooltipTitle}>{popupTexts.info(units.length)}</p>
    );

    return (
      ReactDOMServer.renderToStaticMarkup(
        <div className={classes.unitTooltipContainer} aria-hidden>
          {
            showListOfUnits()
              ? listContent
              : simpleContent
          }
        </div>,
      )
    );
  };

  const clusterMouseout = () => {
    if (embeded) {
      return;
    }
    if (!showListOfUnits()) {
      map.closePopup();
    }
  };

  // Create marker cluster layer on mount
  useEffect(() => {
    const mcg = createMarkerClusterLayer(
      createClusterCustomIcon,
      clusterPopupContent(),
      null,
      clusterMouseout,
      null,
      maxClusterRadius,
    );
    map.addLayer(mcg);
    setCluster(mcg);
  }, []);

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

    // Add unit markers to clusterlayer
    unitListFiltered.forEach((unit) => {
      // Show markers with location
      if (unit && unit.location) {
        // Distance
        const distance = getDistance(unit, intl);
        const tooltipContent = createMarkerContent(unit, classes, getLocaleText, distance);

        const markerElem = global.L.marker(
          [unit.location.coordinates[1], unit.location.coordinates[0]],
          {
            icon: drawMarkerIcon(useContrast),
            customUnitData: unit,
            keyboard: false,
          },
        ).bindTooltip(
          tooltipContent,
          tooltipOptions(unitListFiltered.length, classes),
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

        cluster.addLayer(markerElem);
      }
    });

    document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
      item.setAttribute('tabindex', '-1');
      item.setAttribute('aria-hidden', 'true');
    });

    if (map && data.units.length && !(currentPage === 'address' || currentPage === 'area')) {
      // TODO: this should be revisited once new map focusing is implemented
      /* Zoom out map to fit all unit markers when unit data changes.
      Do not do this on area view and address view */
      fitUnitsToMap(data.units, map);
    }

    // optionally center the map around the markers
    // map.fitBounds(mcg.getBounds());
    // // add the marker cluster group to the map
  }, [cluster, data]);

  return null;
};

MarkerCluster.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
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
