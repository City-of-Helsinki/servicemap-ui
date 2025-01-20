import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { getPage } from '../../../../redux/selectors/user';

const ElevationControl = ({ unit, isMobile}) => {
  const intl = useIntl();
  const map = useMap();
  const currentPage = useSelector(getPage);
  const [geometryIndex, setGeometryIndex] = useState(0);
  const [geometry, setGeometry] = useState(null);

  const getUnitGeometry = (unitData) => {
    if (currentPage !== 'unit') {
      return null;
    }
    const { geometry_3d } = unitData;
    if (geometry_3d) {
      const coordinates = geometry_3d?.coordinates;
      if (coordinates && geometry_3d.type === 'MultiLineString') {
        const lineString = coordinates[geometryIndex];
        return {
          coordinates: lineString,
        };
      }
    }
    return null;
  };

  useEffect(() => {
    setGeometry(getUnitGeometry(unit));
  }, [unit, geometryIndex, currentPage]);

  function constructProfileGeoJson(coordinates) {
    return [{
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        },
        'properties': {
          'attributeType': 'flat'
        }}],
        'properties': {
          'summary': 'HeightProfile',
          'label': intl.formatMessage({ id: 'map.heightProfile.title' }),
        }
    }];
  }
  
  useEffect(() => {
    if(!geometry?.coordinates) {
      setGeometryIndex(0);
      return;
    }
    
    const geoJson = constructProfileGeoJson(geometry?.coordinates);

    const onRoute = event => {
      control.mapMousemoveHandler(event, { showMapMarker: true });
    }
    const outRoute = event => {
      control.mapMouseoutHandler(2000);
    }

    const control = L.control.heightgraph({
      position: !isMobile ? 'bottomright' : 'topright',
      mappings: {
        'HeightProfile': {
          'flat': {
            text: intl.formatMessage({ id: 'map.heightProfile.title' }),
            color: '#FD4F00'
          }
        }
      },
      graphStyle: {
        opacity: 0.8,
        'fill-opacity': 0.5,
        'stroke-width': '3px'
      },
      translation: {
        distance: intl.formatMessage({ id: 'map.heightProfile.distance' }),
        elevation: intl.formatMessage({ id: 'map.heightProfile.elevation' }),
        segment_length: intl.formatMessage({ id: 'map.heightProfile.segmentLength' }),
        type: intl.formatMessage({ id: 'map.heightProfile.type' }),
        legend: intl.formatMessage({ id: 'map.heightProfile.legend' }),
      },
      expandControls: true,
      expandCallback: function(expanded) {
        const heightProfileButtons = L.DomUtil.get("height-profile-buttons");
        if (heightProfileButtons) {
          heightProfileButtons.style.visibility = expanded ? "visible" : "hidden";
        }
      }
    });

    const displayGroup = new L.LayerGroup();
    displayGroup.addTo(map);
    control.addTo(map);
    control.addData(geoJson);

    const layer = L.geoJson(geoJson, {
      style: {
        color: '#FD4F00',
        opacity: 0.8,
        weight: 6,
        fillOpacity: 0.5
      }
    });
    layer.on({
      'mousemove': onRoute,
      'mouseout': outRoute,
    }).addTo(displayGroup);
    
    if (isMobile) {
      control.getContainer().style.marginTop = '80px';
      control.getContainer().style.marginRight = '-108px';
      control._button.style.marginRight = '154px';
      control._button.style.marginTop = '210px';
      control.resize({width:370, height:200});
    } else {
      control.resize({width:800, height:300});
    }

    const buttonsDiv = L.DomUtil.create("div", "height-profile-buttons", control.getContainer());
    buttonsDiv.id = "height-profile-buttons";
    const prevButton = L.DomUtil.create("button", "height-profile-prev-button", buttonsDiv);
    const nextButton = L.DomUtil.create("button", "height-profile-next-button", buttonsDiv);
  
    L.DomEvent.on(prevButton, "mousedown dblclick", L.DomEvent.stopPropagation)
      .on(prevButton, "click", (event) => {
      if (geometryIndex > 0) {
        setGeometryIndex(geometryIndex - 1);
      }
    });
  
    L.DomEvent.on(nextButton, "mousedown dblclick", L.DomEvent.stopPropagation)
      .on(nextButton, "click", (event) => {
      if (unit?.geometry_3d && geometryIndex < unit?.geometry_3d?.coordinates?.length - 1) {
        setGeometryIndex(geometryIndex + 1);
      }
    });

    return () => {
      map.removeControl(control);
      map.removeLayer(displayGroup);
    }
  }, [geometry, geometryIndex]);

  return null;
}

ElevationControl.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  isMobile: PropTypes.bool,
};

export default ElevationControl;
