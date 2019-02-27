import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import { connect } from 'react-redux';
import { getMapType } from '../../redux/selectors';
import MapView from './MapView';
import CreateMap from '../../utils/createMap';
import { mapOptions } from '../../config/mapConfig';

require('proj4leaflet');

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialMap: null,
    };
  }

  componentDidMount() {
    this.initiateMap();
  }

  initiateMap = () => {
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  render() {
    const { mapType } = this.props;
    const { initialMap } = this.state;
    if (initialMap) {
      return (
        <MapView
          key={mapType ? mapType.crs.code : initialMap.crs.code}
          mapBase={mapType || initialMap}
          mapOptions={mapOptions}
          // TODO: think about better styling location for map
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  const mapType = getMapType(state);
  return {
    mapType,
  };
};

export default connect(
  mapStateToProps,
  { getMapType },
)(MapContainer);

MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
};

MapContainer.defaultProps = {
  mapType: 'servicemap',
};
