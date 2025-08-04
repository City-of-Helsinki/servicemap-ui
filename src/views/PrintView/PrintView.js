/* eslint-disable no-underscore-dangle */
import styled from '@emotion/styled';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import paths from '../../../config/paths';
import { SMButton } from '../../components';
import { selectMapRef } from '../../redux/selectors/general';
import SettingsUtility from '../../utils/settings';
import useLocaleText from '../../utils/useLocaleText';
import CreateMap from '../MapView/utils/createMap';
import { NumberCircleMaker } from '../MapView/utils/drawIcon';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledWrapper = styled.div(() => ({
  position: 'relative',
  background: 'white',
  color: 'black',
  top: 0,
  left: 0,
  right: 0,
  padding: 24,
  minHeight: '100%',
  zIndex: 10000,
}));

const StyledContainer = styled.div(() => ({
  maxWidth: 900,
  margin: 'auto',
}));

const StyledButtonContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledMap = styled.div(() => ({
  position: 'relative',
  height: 500,
  width: '100%',
  display: 'block',
}));
const StyledTableContainer = styled(TableContainer)(() => ({
  pageBreakAfter: 'always',
  '& thead': {
    fontWeight: 'bold',
  },
}));

function PrintView({ togglePrintView }) {
  const map = useSelector(selectMapRef);
  const intl = useIntl();
  const getLocaleText = useLocaleText();
  const [descriptions, setDescriptions] = useState([]);
  const location = useLocation();
  const dialogRef = useRef();

  const focusToFirstElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[0].focus();
  };

  const focusToLastElement = () => {
    const dialog = dialogRef.current;
    const buttons = dialog.querySelectorAll('button');
    buttons[buttons.length - 1].focus();
  };

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
    document.querySelector('.leaflet-control-zoom').style.display = 'none';
    document.querySelector('.leaflet-control-attribution').style.display =
      'none';
  };

  const getMarkers = () => {
    const layers = map._layers;
    const markers = [];

    Object.keys(layers).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(layers, key)) {
        return;
      }
      const current = layers[key];
      const cl = current?._icon?.classList; // Class list for icon

      if (
        (current instanceof global.L.MarkerCluster ||
          current instanceof global.L.Marker) &&
        // Only unit markers and clusters
        cl &&
        (cl.contains('unitMarker') || cl.contains('unitClusterMarker'))
      ) {
        markers.push(current);
      }
    });

    return markers;
  };

  const getClusteredUnits = (markerCluster) =>
    markerCluster.getAllChildMarkers().map((mm) => mm.options.customUnitData);

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
      isInvalid = !units.find((v) => v.id === unitID);
    } else if (marker?.options?.customUnitData?.id !== unitID) {
      isInvalid = true;
    }

    return isInvalid;
  };

  const getUnitPageUnit = (marker) => {
    if (isUnitPage() && !isInvalidUnitPageMarker(marker)) {
      let unit;

      if (marker instanceof global.L.MarkerCluster) {
        const units = getClusteredUnits(marker);
        unit = units.find((v) => v.id === unitID);
      } else {
        unit = marker.options.customUnitData;
      }
      return unit;
    }
    return null;
  };

  const createCustomIcon = (number) => {
    const iconSize = 30;

    const canvasIcon = document.createElement('canvas');
    canvasIcon.height = iconSize;
    canvasIcon.width = iconSize;
    const ctx = canvasIcon.getContext('2d');
    const drawer = new NumberCircleMaker(iconSize);
    drawer.drawNumberedCircle(ctx, number);

    return new global.L.Icon({
      iconUrl: canvasIcon.toDataURL(),
      iconSize: [iconSize, iconSize],
    });
  };

  const createMap = () => {
    const mapOptions = CreateMap(SettingsUtility.defaultMapType, 'fi');
    const { crs, options } = mapOptions;
    const mapCenter = map.getCenter();
    const mapZoom = map.getZoom();
    const mymap = global.L.map('print-map').setView(mapCenter, mapZoom);

    global.L.tileLayer(options.url, {
      maxZoom: options.maxZoom,
      crs,
    }).addTo(mymap);

    // Layer for markers
    const layer = global.L.featureGroup();
    layer.on('add', () => {
      // Hide all markers from screen readers
      document.querySelectorAll('.leaflet-marker-icon').forEach((item) => {
        item.setAttribute('tabindex', '-1');
        item.setAttribute('aria-hidden', 'true');
      });
    });

    // Add markers
    const markers = getMarkers();
    const mapBounds = map.getBounds();
    mymap.fitBounds(mapBounds);

    let vid = 0;
    const descriptions = [];
    Object.keys(markers).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(markers, key)) {
        const marker = markers[key];
        if (
          marker.options.id === 'userMarker' ||
          !mapBounds.contains(marker.getLatLng())
        ) {
          return;
        }
        if (isUnitPage() && isInvalidUnitPageMarker(marker)) {
          return;
        }
        const unitPageUnit = getUnitPageUnit(marker);

        const description = {};
        if (unitPageUnit) {
          description.units = [unitPageUnit];
        } else if (marker instanceof global.L.MarkerCluster) {
          const units = getClusteredUnits(marker);
          description.units = units;
        } else {
          description.units = [marker.options.customUnitData];
        }

        let coordinates;
        if (unitPageUnit) {
          // eslint-disable-next-line prefer-destructuring
          coordinates = unitPageUnit.location.coordinates;
        }

        vid += 1;
        const customMarker = global.L.marker(
          coordinates ? [coordinates[1], coordinates[0]] : marker.getLatLng(),
          {
            icon: createCustomIcon(vid),
          }
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
    focusToFirstElement();
    // Focus back to ToolMenu button on closing PrintView
    return () => {
      try {
        const e = document.getElementById('ToolMenuButton');
        if (e) {
          e.focus();
        }
      } catch (e) {
        console.warn(`Unable to focus to ToolMenuPanel ${e.message}`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledWrapper ref={dialogRef} role="dialog">
      {/* Empty element that makes keyboard focus loop in dialog */}
      <Typography
        style={visuallyHidden}
        aria-hidden
        tabIndex={0}
        onFocus={focusToLastElement}
      />
      <StyledContainer>
        <StyledButtonContainer>
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
            role="button"
          />
        </StyledButtonContainer>
        <StyledMap
          aria-label={intl.formatMessage({ id: 'map.ariaLabel' })}
          id="print-map"
          tabIndex={-1}
        />
        <div>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    {intl.formatMessage({ id: 'print.table.header.number' })}
                  </StyledTableCell>
                  <StyledTableCell>
                    {intl.formatMessage({ id: 'unit' })}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {descriptions.map((description) => {
                  if (!description?.units || !description.units[0]) {
                    return null;
                  }
                  const { name, street_address: address } =
                    description.units[0];
                  return (
                    <React.Fragment key={description.number}>
                      <StyledTableRow key={description.number}>
                        <StyledTableCell>{description.number}</StyledTableCell>
                        <StyledTableCell>
                          {name && (
                            <Typography variant="subtitle1" component="p">
                              {getLocaleText(name)}
                            </Typography>
                          )}
                          {address && (
                            <Typography variant="body2">
                              {getLocaleText(address)}
                            </Typography>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                      {description.units.slice(1).map((unit) => {
                        const { name, street_address: address } = unit;
                        const key = `${description.number}-${unit.id}`;
                        return (
                          <StyledTableRow key={key}>
                            <StyledTableCell />
                            <StyledTableCell>
                              {name && (
                                <Typography variant="subtitle1" component="p">
                                  {getLocaleText(name)}
                                </Typography>
                              )}
                              {address && (
                                <Typography variant="body2">
                                  {getLocaleText(address)}
                                </Typography>
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </div>
      </StyledContainer>
      {/* Empty element that makes keyboard focus loop in dialog */}
      <Typography
        style={visuallyHidden}
        aria-hidden
        tabIndex="0"
        onFocus={focusToFirstElement}
      />
    </StyledWrapper>
  );
}

PrintView.propTypes = {
  togglePrintView: PropTypes.func.isRequired,
};

export default PrintView;
