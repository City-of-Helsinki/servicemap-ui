/* eslint-disable max-len, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { getMapType } from '../../redux/selectors/map';
import getHighlightedDistrict from '../../redux/selectors/district';
import { setMapRef } from '../../redux/actions/map';
import { setAddressLocation } from '../../redux/actions/address';
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
  }

  initiateMap = () => {
    const initialMap = CreateMap('servicemap');
    this.setState({ initialMap });
  }

  saveMapRef = (ref) => {
    const { setMapRef } = this.props;
    setMapRef(ref);
  }

  render() {
    const {
      mapType,
      highlightedUnit,
      highlightedDistrict,
      getLocaleText, currentPage,
      unitList,
      serviceUnits,
      unitsLoading,
      isMobile,
      intl,
      settings,
      navigator,
      setAddressLocation,
      addressTitle,
      addressUnits,
    } = this.props;
    const { initialMap, transitStops } = this.state;

    const topBar = (
      <>
        {isMobile && currentPage === 'map' && (
          // If on root map page (/map) display search bar.
          <div style={{
            zIndex: 99999999, position: 'fixed', top: 64, width: '100%',
          }}
          >
            <SearchBar hideBackButton placeholder={intl.formatMessage({ id: 'search' })} />
          </div>
        )}
        {isMobile && currentPage === 'unit' && highlightedUnit && (
          // If on unit's map page (/unit?map=true) display title bar
          <div style={{
            zIndex: 99999999, position: 'fixed', top: 0, width: '100%',
          }}
          >
            <TitleBar title={getLocaleText(highlightedUnit.name)} />
          </div>
        )}
        {isMobile && currentPage === 'address' && addressTitle && (
        // If on address's map page (/address?map=true) display title bar
        <div style={{
          zIndex: 99999999, position: 'fixed', top: 0, width: '100%',
        }}
        >
          <TitleBar title={addressTitle} />
        </div>
        )}
      </>
    );

    let mapUnits = [];
    let unitGeometry = null;

    if (currentPage === 'search') {
      mapUnits = unitList;
    }

    if (currentPage === 'address') {
      mapUnits = addressUnits;
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
            highlightedDistrict={highlightedDistrict}
            unitGeometry={unitGeometry}
            saveMapRef={this.saveMapRef}
            mapOptions={mapOptions}
            currentPage={currentPage}
            mobile={isMobile}
            fetchTransitStops={this.fetchTransitStops}
            clearTransitStops={this.clearTransitStops}
            transitStops={transitStops}
            getLocaleText={textObject => getLocaleText(textObject)}
            navigator={navigator}
            setAddressLocation={setAddressLocation}
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
  const { units, settings } = state;
  const { data } = units;
  const unitsLoading = state.service.isFetching;
  const serviceUnits = state.service.units;
  const mapType = getMapType(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const currentPage = state.user.page;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  const { addressTitle, addressUnits } = state.address;
  return {
    mapType,
    state,
    highlightedDistrict,
    highlightedUnit,
    getLocaleText,
    unitList: data,
    serviceUnits,
    unitsLoading,
    currentPage,
    settings,
    navigator,
    addressTitle,
    addressUnits,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation },
)(MapContainer));


// Typechecking
MapContainer.propTypes = {
  mapType: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.any), PropTypes.string]),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  serviceUnits: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  unitsLoading: PropTypes.bool,
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  currentPage: PropTypes.string.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  intl: intlShape.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setAddressLocation: PropTypes.func.isRequired,
  addressTitle: PropTypes.string,
  addressUnits: PropTypes.arrayOf(PropTypes.any),
};

MapContainer.defaultProps = {
  mapType: '',
  unitList: [],
  serviceUnits: [],
  addressUnits: [],
  unitsLoading: false,
  highlightedUnit: null,
  highlightedDistrict: null,
  navigator: null,
  isMobile: false,
  addressTitle: null,
};
