import React from 'react';
import PropTypes from 'prop-types';


const UnitGeometry = ({
  geometryData,
}) => {
  const { Polyline, Polygon } = global.rL;
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
        fillColor="#000"
      />
    );
  };

  return (
    <>
      {
        renderPolyline()
      }
      {
        renderPolygon()
      }
    </>
  );
};

UnitGeometry.propTypes = {
  geometryData: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.array).isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};


export default UnitGeometry;
