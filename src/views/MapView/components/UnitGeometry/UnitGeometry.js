import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectNavigator } from '../../../../redux/selectors/general';
import { getPage } from '../../../../redux/selectors/user';
import swapCoordinates from '../../utils/swapCoordinates';
import UnitHelper from '../../../../utils/unitHelper';
import ElevationProfile from '../ElevationProfile/ElevationProfile';
import ElevationProfile2 from '../ElevationProfile2/ElevationProfile2';

const UnitGeometry = ({ data }) => {
  const { Polyline, Polygon } = global.rL;
  const currentPage = useSelector(getPage);
  const navigator = useSelector(selectNavigator);

  const [geometryData, setGeometryData] = useState(null);
  const [geometry3DData, setGeometry3DData] = useState(null);

  useEffect(() => {
    const getUnitGeometry = (unit) => {
      if ((currentPage === 'unit' || currentPage === 'search' || currentPage === 'fullList' || currentPage === 'event')) {
        const { geometry } = unit;
        if (geometry) {
          const { coordinates } = geometry;
          let unitGeometry;
          switch (geometry.type) {
            case 'MultiLineString': {
              unitGeometry = swapCoordinates(coordinates);
              break;
            }
            case 'MultiPolygon': {
              unitGeometry = swapCoordinates(coordinates[0]);
              break;
            }
            default:
              return null;
          }
          return {
            ...geometry,
            coordinates: unitGeometry,
          };
        }
      }
      return null;
    };

    setGeometryData(getUnitGeometry(data));
  }, [data]);

  useEffect(() => {
    const getUnitGeometry = unit => {
      if (currentPage === 'unit' && unit?.geometry_3d?.type === 'MultiLineString') {
        const { geometry_3d } = unit;
        return {
          ...geometry_3d,
        };
      }
      return null;
    };

    setGeometry3DData(getUnitGeometry(data));
  }, [data]);

  const geometryOnClick = (e) => {
    try {
      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();
      UnitHelper.unitElementClick(navigator, data);
    } catch (e) {
      console.warn('Unable to process UnitGeometry Polygon click event');
    }
  };

  const renderPolyline = () => {
    if (geometryData?.type !== 'MultiLineString' || !geometryData?.coordinates) {
      return null;
    }

    return (
      <Polyline
        positions={[
          geometryData.coordinates,
        ]}
        color="#ff8400"
        onClick={geometryOnClick}
      />
    );
  };

  const renderPolylineAndElevation = () => {
    if (geometry3DData?.type !== 'MultiLineString' || !geometry3DData?.coordinates) {
      return null;
    }
    // const center = [25.110242620744813, 60.31393682886327];
    const center = [60.31393682886327, 25.110242620744813];
    const size = 1000;
    return (
      <>
        <ElevationProfile
          track={geometry3DData}
          center={center}
          size={size}
        />
        {/*<ElevationProfile2*/}
        {/*  track={geometry3DData}*/}
        {/*  center={center}*/}
        {/*  size={size}*/}
        {/*/>*/}
      </>
    );
  };

  const renderPolygon = () => {
    if (geometryData?.type !== 'MultiPolygon' || !geometryData?.coordinates) {
      return null;
    }

    return (
      <Polygon
        positions={geometryData.coordinates}
        color="#ff8400"
        pathOptions={{
          fillColor: '#000',
        }}
        onClick={geometryOnClick}
      />
    );
  };
  console.log('geom data', geometryData);
  console.log('geom 3d data', geometry3DData);
  return (
    <>
      {
        renderPolyline()
      }
      {
        renderPolylineAndElevation()
      }
      {
        renderPolygon()
      }
    </>
  );
};

UnitGeometry.propTypes = {
  data: PropTypes.shape({
    geometry: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};


export default UnitGeometry;
