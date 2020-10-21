import React from 'react';
import PropTypes from 'prop-types';


const UnitGeometry = ({
  geometryData,
}) => {
  const { Polyline } = global.rL;
  return (
    <>
      {
        geometryData
        && (
          <Polyline
            positions={[
              geometryData,
            ]}
            color="#ff8400"
          />
        )
      }
    </>
  );
};

UnitGeometry.propTypes = {
  geometryData: PropTypes.arrayOf(PropTypes.array).isRequired,
};


export default UnitGeometry;
