/* eslint-disable max-len, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMapType } from '../../redux/selectors/map';
import getDistricts from '../../redux/selectors/district';
import { fetchDistrictsData } from '../../redux/actions/district';
import { setMapRef } from '../../redux/actions/map';
import MapView from './components/MapView';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import CreateMap from './utils/createMap';
import { mapOptions } from './constants/mapConstants';
import { fetchStops } from './utils/transitFetch';

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
    const mockPosition = {
      lat: 60.1715997,
      lng: 24.9381021,
    };
    this.fetchMapDistricts(mockPosition);
  }

  initiateMap = () => {
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  fetchMapDistricts = (position) => {
    const { fetchDistrictsData } = this.props;
    fetchDistrictsData(position);
  }

  fetchTransitStops = (bounds) => {
    const { locale } = this.props;
    fetchStops(bounds)
      .then(((data) => {
        const stops = data[0].data.stopsByBbox;
        const subwayStations = stops.filter(stop => stop.vehicleType === 1);

        // Remove subwaystations from stops list since they will be replaced with subway entrances
        const filteredStops = stops.filter(stop => stop.vehicleType !== 1);

        const entrances = data[1].results;

        // Add subway entrances to the list of stops
        entrances.forEach((entrance) => {
          const closest = {
            distance: null,
            stop: null,
          };
          // Find the subwaystation closest to the entrance
          subwayStations.forEach((stop) => {
            const distance = Math.sqrt(
              ((stop.lat - entrance.location.coordinates[1]) ** 2)
              + ((stop.lon - entrance.location.coordinates[0]) ** 2),
            );
            if (!closest.distance || distance < closest.distance) {
              closest.distance = distance;
              closest.stop = stop;
            }
          });
          // Get the same station's stop for other direction (west/east)
          const otherStop = subwayStations.find(
            station => station.name === closest.stop.name && station.gtfsId !== closest.stop.gtfsId,
          );
          // Create a new stop from the entrance, give it the stop data of the corresponding station and add it to the list of stops
          const newStop = {
            gtfsId: closest.stop.gtfsId,
            secondaryId: otherStop.gtfsId,
            lat: entrance.location.coordinates[1],
            lon: entrance.location.coordinates[0],
            name: entrance.name[locale],
            patterns: closest.stop.patterns,
            vehicleType: closest.stop.vehicleType,
          };
          filteredStops.push(newStop);
        });
        this.setState({ transitStops: filteredStops });
      }));
  }

  clearTransitStops = () => {
    this.setState({ transitStops: [] });
  }

  saveMapRef = (ref) => {
    const { setMapRef } = this.props;
    setMapRef(ref);
  }

  render() {
    const {
      mapType, navigator, districts, highlightedUnit, getLocaleText, currentPage, unitList, serviceUnits, unitsLoading,
    } = this.props;
    const { initialMap, transitStops } = this.state;

    let mapUnits = [];

    if (currentPage === 'search') {
      mapUnits = unitList;
    }

    if (currentPage === 'service' && serviceUnits.units && !unitsLoading) {
      mapUnits = serviceUnits.units.results;
    }

    if (highlightedUnit) {
      mapUnits = [highlightedUnit];
    }

    if (initialMap) {
      return (
        <MapView
          key={mapType ? mapType.crs.code : initialMap.crs.code}
          mapType={mapType || initialMap}
          unitList={mapUnits}
          districtList={districts}
          saveMapRef={this.saveMapRef}
          mapOptions={mapOptions}
          mobile={isMobile}
          navigator={navigator}
          fetchTransitStops={this.fetchTransitStops}
          clearTransitStops={this.clearTransitStops}
          transitStops={transitStops}
          getLocaleText={textObject => getLocaleText(textObject)}
          // TODO: think about better styling location for map
          style={{ height: '100%', flex: '1 0 auto' }}
        />
      );
    }
    return null;
  }
}
// Listen to redux state
const mapStateToProps = (state) => {
  const { units, navigator } = state;
  const { data } = units;
  const unitsLoading = state.service.isFetching;
  const serviceUnits = state.service.data;
  const mapType = getMapType(state);
  const districts = getDistricts(state);
  const highlightedUnit = getSelectedUnit(state);
  const currentPage = state.user.page;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  // const unitList = getUnitList(state);
  return {
    mapType,
    navigator,
    districts,
    state,
    highlightedUnit,
    getLocaleText,
    unitList: data,
    serviceUnits,
    unitsLoading,
    currentPage,
    // unitList,
  };
};

export default connect(
  mapStateToProps,
  // TODO: remove fetchDistrictsData from this class
  { fetchDistrictsData, setMapRef },
)(MapContainer);


// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  navigator: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  serviceUnits: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  locale: PropTypes.string,
  unitsLoading: PropTypes.bool,
  districts: PropTypes.arrayOf(PropTypes.object),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  currentPage: PropTypes.string.isRequired,
  fetchDistrictsData: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

MapContainer.defaultProps = {
  mapType: '',
  navigator: null,
  unitList: [],
  serviceUnits: [],
  locale: 'fi',
  unitsLoading: false,
  districts: {},
  highlightedUnit: null,
  isMobile: false,
};
