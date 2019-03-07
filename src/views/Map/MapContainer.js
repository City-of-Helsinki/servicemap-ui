import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import { connect } from 'react-redux';
import { getMapType } from './redux/selectors';
import MapView from './components/MapView';
import CreateMap from '../../utils/createMap';
import { mapOptions } from '../../config/mapConfig';
import fetchStops from '../../utils/fetchStops';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialMap: null,
      transitStops: [],
    };
  }

  componentDidMount() {
    this.initiateMap();
  }

  initiateMap = () => {
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  fetchTransitStops = (bounds) => {
    fetchStops(bounds)
      .then((data => this.setState({ transitStops: data.data.stopsByBbox })));
  }

  clearTransitStops = () => {
    this.setState({ transitStops: [] });
  }

  render() {
    const { mapType, unitList } = this.props;
    const { initialMap, transitStops } = this.state;
    if (initialMap) {
      return (
        <MapView
          key={mapType ? mapType.crs.code : initialMap.crs.code}
          mapBase={mapType || initialMap}
          unitList={unitList}
          mapOptions={mapOptions}
          fetchTransitStops={this.fetchTransitStops}
          clearTransitStops={this.clearTransitStops}
          transitStops={transitStops}
          // TODO: think about better styling location for map
          style={{ width: '100%', height: '96%', position: 'absolute' }}
        />
      );
    }
    return null;
  }
}
// Listen to redux state
const mapStateToProps = (state) => {
  const mapType = getMapType(state);
  // const unitList = getUnitList(state);
  return {
    mapType,
    // unitList,
  };
};

export default connect(
  mapStateToProps,
  null,
)(MapContainer);


// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
};

MapContainer.defaultProps = {
  mapType: '',
  unitList: [],
};
