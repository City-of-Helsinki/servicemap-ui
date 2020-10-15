/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useIntl } from 'react-intl';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NumberCircleMaker } from '../MapView/utils/drawIcon';
import CreateMap from '../MapView/utils/createMap';
import SMButton from '../../components/ServiceMapButton';
import paths from '../../../config/paths';

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const PrintView = ({
  classes,
  getLocaleText,
  map,
  togglePrintView,
}) => {
  const intl = useIntl();
  const [descriptions, setDescriptions] = useState([]);
  const location = useLocation();

  const disableMap = (map) => {
    if (!map) {
      return;
    }
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    document.getElementById('print-map').style.cursor = 'default';
    document.querySelector('.leaflet-control-zoom').style.display = 'none'
    document.querySelector('.leaflet-control-attribution').style.display = 'none'
  };

  const getMarkers = () => {
    const layers = map._layers;
    const featureGroupID = Object.keys(layers).find((key) => {
      if (!Object.prototype.hasOwnProperty.call(layers, key)) {
        return false;
      }
      const current = layers[key];
      return !!current._featureGroup;
    });

    const featureGroup = layers[featureGroupID]?._featureGroup;
    const markers = featureGroup?._layers;
    return markers;
  };


  const getClusteredUnits = markerCluster => (
    markerCluster.getAllChildMarkers().map(mm => mm.options.customUnitData)
  );

  const isUnitPage = () => paths.unit.regex.test(location.pathname);

  const getID = () => {
    const parts = location.pathname.split('/');
    const index = parts.indexOf('unit');
    const id = parseInt(parts[index + 1], 10);
    return id;
  };
  const unitID = getID();

  const isInvalidUnitPageMarker = (marker) => {
    let isInvalid = false;
    if (marker instanceof global.L.MarkerCluster) {
      const units = getClusteredUnits(marker);
      isInvalid = !units.find(v => v.id === unitID);
    } else if (marker.options.customUnitData.id !== unitID) {
      isInvalid = true;
    }

    return isInvalid;
  };

  const createMap = () => {
    const mapOptions = CreateMap('servicemap', 'fi');
    const { crs, options } = mapOptions;
    const mapCenter = map.getCenter();
    const mapZoom = map.getZoom();
    const mymap = global.L.map('print-map')
      .setView(mapCenter, mapZoom);

    global.L.tileLayer(options.url, {
      maxZoom: options.maxZoom,
      crs,
    }).addTo(mymap);

    // Layer for markers
    const layer = global.L.featureGroup();

    // Add markers
    const markers = getMarkers();
    const mapBounds = map.getBounds();
    mymap.fitBounds(mapBounds);


    let vid = 0;
    const descriptions = [];
    Object.keys(markers).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(markers, key)) {
        const marker = markers[key];
        if (!mapBounds.contains(marker.getLatLng())) {
          return;
        }
        if (isUnitPage() && isInvalidUnitPageMarker(marker)) {
          return;
        }
        let unitPageUnit;

        const description = {};
        if (marker instanceof global.L.MarkerCluster) {
          const units = getClusteredUnits(marker);
          if (isUnitPage()) {
            unitPageUnit = units.find(v => v.id === unitID);
            description.units = [unitPageUnit];
          } else {
            description.units = units;
          }
        } else {
          unitPageUnit = marker.options.customUnitData;
          description.units = [unitPageUnit];
        }
        const iconSize = 40;

        const canvasIcon = document.createElement('canvas');
        canvasIcon.height = iconSize;
        canvasIcon.width = iconSize;
        const ctx = canvasIcon.getContext('2d');
        const drawer = new NumberCircleMaker(iconSize);
        // eslint-disable-next-line no-plusplus
        drawer.drawNumberedCircle(ctx, ++vid);

        const customIcon = new global.L.Icon({
          iconUrl: canvasIcon.toDataURL(),
          iconSize: [iconSize, iconSize],
        });

        const { coordinates } = unitPageUnit.location;

        const customMarker = global.L.marker(
          isUnitPage() ? [coordinates[1], coordinates[0]] : marker.getLatLng(),
          {
            icon: customIcon,
          },
        );
        layer.addLayer(customMarker);


        description.number = vid;

        descriptions.push(description);
      }
    });

    layer.addTo(mymap);

    disableMap(mymap);

    setDescriptions(descriptions);
  };

  useEffect(() => {
    createMap();
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <SMButton
            className="no-print"
            messageID="print.button.close"
            onClick={() => {
              togglePrintView();
            }}
            role="link"
          />
          <SMButton
            className="no-print"
            messageID="print.button.print"
            onClick={() => {
              window.print();
            }}
            role="link"
          />
        </div>
        <div id="print-map" className={classes.map} />
        <div>
          <TableContainer component={Paper} className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {intl.formatMessage({ id: 'print.table.header.number' })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({ id: 'print.table.header.location' })}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  descriptions.map(description => (
                    <React.Fragment key={description.number}>
                      <StyledTableRow key={description.number}>
                        <TableCell>{description.number}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            {getLocaleText(description.units[0].name)}
                          </Typography>
                          <Typography variant="body2">
                            {getLocaleText(description.units[0].street_address)}
                          </Typography>
                        </TableCell>
                      </StyledTableRow>
                      {
                        description.units.slice(1).map((unit) => {
                          const name = getLocaleText(unit.name);
                          const address = getLocaleText(unit.street_address);
                          const key = `${description.number}-${unit.id}`;
                          return (
                            <StyledTableRow key={key}>
                              <TableCell />
                              <TableCell>
                                <Typography variant="subtitle1">{name}</Typography>
                                <Typography variant="body2">{address}</Typography>
                              </TableCell>
                            </StyledTableRow>
                          );
                        })
                      }
                    </React.Fragment>
                  ))
                }
              </TableBody>
            </Table>

          </TableContainer>
        </div>
      </div>
    </div>
  );
};

PrintView.propTypes = {
  classes: PropTypes.shape({
    buttonContainer: PropTypes.string,
    container: PropTypes.string,
    map: PropTypes.string,
    wrapper: PropTypes.string,
  }).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  map: PropTypes.shape({
    getBounds: PropTypes.func,
  }).isRequired,
  togglePrintView: PropTypes.func.isRequired,
};

export default PrintView;
