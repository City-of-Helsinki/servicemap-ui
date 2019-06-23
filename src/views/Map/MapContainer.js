/* eslint-disable max-len, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { getMapType } from '../../redux/selectors/map';
import getDistricts from '../../redux/selectors/district';
import { fetchDistrictsData } from '../../redux/actions/district';
import { setMapRef } from '../../redux/actions/map';
import MapView from './components/MapView';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import CreateMap from './utils/createMap';
import swapCoordinates from './utils/swapCoordinates';
import { mapOptions } from './constants/mapConstants';

import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar/TitleBar';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialMap: null,
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

  saveMapRef = (ref) => {
    const { setMapRef } = this.props;
    setMapRef(ref);
  }

  render() {
    const {
      mapType, navigator, districts, highlightedUnit, getLocaleText, currentPage, unitList, serviceUnits, unitsLoading, isMobile, intl, settings,
    } = this.props;
    const { initialMap, transitStops } = this.state;

    const topBar = (
      <div style={{
        zIndex: 99999999, position: 'fixed', top: 0, width: '100%',
      }}
      >
        {isMobile && currentPage === 'map' && (
          // If on root map page (/map) display search bar.
          <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
        )}
        {isMobile && currentPage === 'unit' && highlightedUnit && (
          // If on unit's map page (/unit?map=true) display title bar
          <TitleBar title={getLocaleText(highlightedUnit.name)} />
        )}
      </div>
    );

    let mapUnits = [];
    let unitGeometry = null;

    if (currentPage === 'search') {
      mapUnits = unitList;
    }

    if (currentPage === 'service' && serviceUnits && !unitsLoading) {
      mapUnits = serviceUnits;
    }

    if (currentPage === 'unit' && highlightedUnit) {
      mapUnits = [highlightedUnit];
      const { geometry } = highlightedUnit;
      if (geometry && geometry.type === 'MultiLineString') {
        const { coordinates } = geometry;
        unitGeometry = swapCoordinates(coordinates);
      }
    }

    if (initialMap) {
      return (
        <>
          {topBar}
          <MapView
            key={mapType ? mapType.crs.code : initialMap.crs.code}
            mapType={mapType || initialMap}
            unitList={mapUnits}
            districtList={districts}
            unitGeometry={unitGeometry}
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
            settings={settings}
          />
        </>
      );
    }
    return null;
  }
}
// Listen to redux state
const mapStateToProps = (state) => {
  const { units, navigator, settings } = state;
  const { data } = units;
  const unitsLoading = state.service.isFetching;
  const serviceUnits = state.service.units;
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
    settings,
    // unitList,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  // TODO: remove fetchDistrictsData from this class
  { fetchDistrictsData, setMapRef },
)(MapContainer));


// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  navigator: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  serviceUnits: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  unitsLoading: PropTypes.bool,
  districts: PropTypes.arrayOf(PropTypes.object),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  currentPage: PropTypes.string.isRequired,
  fetchDistrictsData: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  intl: intlShape.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

MapContainer.defaultProps = {
  mapType: '',
  navigator: null,
  unitList: [],
  serviceUnits: [],
  unitsLoading: false,
  districts: {},
  highlightedUnit: null,
  isMobile: false,
};
