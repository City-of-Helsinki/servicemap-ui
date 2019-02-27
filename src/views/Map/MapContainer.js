import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import { connect } from 'react-redux';
import { getMapType } from '../../redux/selectors';
import { setMapType } from '../../redux/actions';
import MapView from './MapView';
import CreateMap from '../../utils/createMap';
import { mapOptions } from '../../config/mapConfig';

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
    require('proj4leaflet');
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  changeMap = () => {
    const { setMapType } = this.props;
    setMapType('ortoImage');
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
          changeMap={this.changeMap}
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
  { getMapType, setMapType },
)(MapContainer);

// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  setMapType: PropTypes.func,
};

MapContainer.defaultProps = {
  mapType: 'servicemap',
  setMapType: '',
};
