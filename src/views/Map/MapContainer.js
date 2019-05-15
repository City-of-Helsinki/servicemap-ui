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
import { fetchStops, fetchStopData } from './utils/transitFetch';

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

        // Add subway entrances to the list of stops and give them proper schedules
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

          console.log(closest);

          // Create a new stop from the entrance, give it the arrival schedule of the corresponding station and add it to the list of stops
          const newStop = {
            gtfsId: closest.stop.gtfsId,
            secondaryId: otherStop.gtfsId,
            lat: entrance.location.coordinates[1],
            lon: entrance.location.coordinates[0],
            name: entrance.name[locale],
            patterns: closest.stop.patterns,
            // stoptimesWithoutPatterns: arrivalTimes,
            vehicleType: closest.stop.vehicleType,
          };
          console.log(newStop);
          filteredStops.push(newStop);
        });
        this.setState({ transitStops: filteredStops });
      }));
  }

  fetchTransitStopData = (stop) => {
    fetchStopData(stop)
      .then(((stopData) => {
        // Combine the arrival schedules to add them to the subway entrance info
        /* let arrivalTimes = [
          ...closest.stop.stoptimesWithoutPatterns,
          ...otherStop.stoptimesWithoutPatterns,
        ]; */
        console.log('arrival times is:', stopData);

        // Sort arrivals by time and shorten the list
        /* arrivalTimes.sort(
          (a, b) => (a.realtimeArrival + a.serviceDay) - (b.realtimeArrival + b.serviceDay),
        );
        arrivalTimes = arrivalTimes.slice(0, 5); */
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
      mapType, districts, highlightedUnit, getLocaleText, currentPage, unitList, serviceUnits, unitsLoading,
    } = this.props;

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

    const { initialMap, transitStops } = this.state;
    if (initialMap) {
      return (
        <MapView
          key={mapType ? mapType.crs.code : initialMap.crs.code}
          mapBase={mapType || initialMap}
          unitList={mapUnits}
          districtList={districts}
          saveMapRef={this.saveMapRef}
          mapOptions={mapOptions}
          fetchTransitStops={this.fetchTransitStops}
          fetchTransitStopData={stop => this.fetchTransitStopData(stop)}
          clearTransitStops={this.clearTransitStops}
          transitStops={transitStops}
          getLocaleText={textObject => getLocaleText(textObject)}
          // TODO: think about better styling location for map
          style={{ flex: '1 0 auto' }}
        />
      );
    }
    return null;
  }
}
// Listen to redux state
const mapStateToProps = (state) => {
  const { units } = state;
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
};

MapContainer.defaultProps = {
  mapType: '',
  unitList: [],
  serviceUnits: [],
  locale: 'fi',
  unitsLoading: false,
  districts: {},
  highlightedUnit: null,
};
