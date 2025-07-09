import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectNavigator } from '../../../../redux/selectors/general';
import { getPage } from '../../../../redux/selectors/user';
import UnitHelper from '../../../../utils/unitHelper';
import swapCoordinates from '../../utils/swapCoordinates';

function UnitGeometry({ data }) {
  const { Polyline, Polygon } = global.rL;
  const currentPage = useSelector(getPage);
  const navigator = useSelector(selectNavigator);

  const [geometryData, setGeometryData] = useState(null);

  useEffect(() => {
    const getUnitGeometry = (unit) => {
      if (
        currentPage === 'unit' ||
        currentPage === 'search' ||
        currentPage === 'fullList' ||
        currentPage === 'event'
      ) {
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
              unitGeometry = coordinates.map((polygon) =>
                swapCoordinates(polygon)
              );
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
    if (
      geometryData?.type !== 'MultiLineString' ||
      !geometryData?.coordinates
    ) {
      return null;
    }

    return (
      <Polyline
        positions={[geometryData.coordinates]}
        color="#ff8400"
        onClick={geometryOnClick}
      />
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

  return (
    <>
      {renderPolyline()}
      {renderPolygon()}
    </>
  );
}

UnitGeometry.propTypes = {
  data: PropTypes.shape({
    geometry: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default UnitGeometry;
