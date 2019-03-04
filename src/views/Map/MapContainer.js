import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import { connect } from 'react-redux';
import { getMapType, getUnits } from './redux/selectors';
import setMapType from './redux/actions';
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
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  changeMap = () => {
    // A test function to change maptype to aerial image through redux
    const { setMapType } = this.props;
    setMapType('ortoImage');
  }

  render() {
    const { mapType, unitList } = this.props;
    const { initialMap } = this.state;
    if (initialMap) {
      return (
        <MapView
          key={mapType ? mapType.crs.code : initialMap.crs.code}
          mapBase={mapType || initialMap}
          unitList={unitList}
          mapOptions={mapOptions}
          changeMap={this.changeMap}
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
  const unitList = getUnits(state);
  return {
    mapType,
    unitList,
  };
};

export default connect(
  mapStateToProps,
  { getMapType, setMapType, getUnits },
)(MapContainer);


// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  unitList: PropTypes.arrayOf(PropTypes.object),
  setMapType: PropTypes.func,
};

MapContainer.defaultProps = {
  mapType: '',
  setMapType: '',
  unitList: [{
    name: 'Marker 1', id: 58560, node: 986, lat: 60.174722, lng: 24.957097,
  },
  {
    name: 'Marker 2', id: 58537, node: 783, lat: 60.169305, lng: 24.947600,
  }],
};
