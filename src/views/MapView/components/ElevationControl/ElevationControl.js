import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { getPage } from '../../../../redux/selectors/user';

const ElevationControl = ({ data, isMobile}) => {
  const intl = useIntl();
  const map = useMap();
  const currentPage = useSelector(getPage);
  const [geometryData, setGeometryData] = useState(null);

  useEffect(() => {
    const getUnitGeometry = (unit) => {
      if (currentPage !== 'unit') {
        return null;
      }
      const { geometry_3d } = unit;
      if (geometry_3d) {
        const coordinates = geometry_3d?.coordinates;
        if (coordinates && geometry_3d.type === 'MultiLineString') {
          return {
            ...geometry_3d,
            coordinates: coordinates[0],
          };
        }
      }
      return null;
    };

    setGeometryData(getUnitGeometry(data));
  }, [data]);

  useEffect(() => {
    if(!geometryData || !geometryData.coordinates) {
        return;
    }
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
                }
            }],
            'properties': {
                "summary": 'HeightProfile',
                'label': intl.formatMessage({ id: 'map.heightProfile.title' }),
            }
        }];
    }
    const geoJson = constructProfileGeoJson(geometryData.coordinates);
    
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
        expandControls: true
    });

    const displayGroup = new L.LayerGroup();
    displayGroup.addTo(map);
    control.addTo(map);
    control.addData(geoJson);

    const layer = L.geoJson(geoJson, {
        style: {
            color: '#FD4F00',
            opacity: 0.8,
            weight: 3,
            fillOpacity: 0.5
        }
    });
    layer
        .on({
            'mousemove': onRoute,
            'mouseout': outRoute,
        })
        .addTo(displayGroup);
    
    if (isMobile) {
        control.getContainer().style.marginTop = '80px';
        control.getContainer().style.marginRight = '-108px';
        control._button.style.marginRight = '154px';
        control._button.style.marginTop = '210px';
        control.resize({width:370, height:200});
    } else {
        control.resize({width:800, height:300});
    }

    return () => {
        map.removeControl(control);
        map.removeLayer(displayGroup);
    }
  });

  return null;
}

export default ElevationControl;
