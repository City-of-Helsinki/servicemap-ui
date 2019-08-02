/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { renderToStaticMarkup } from 'react-dom/server';
import { intlShape, FormattedMessage } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import { focusDistrict, focusUnit } from '../MapView/utils/mapActions';
import fetchDistricts from './utils/fetchDistricts';
import { MobileComponent, DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import TitleBar from '../../components/TitleBar/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import { AddressIcon, MapIcon } from '../../components/SMIcon';
import UnitItem from '../../components/ListItems/UnitItem';
import HeadModifier from '../../utils/headModifier';

import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import ServiceMapButton from '../../components/ServiceMapButton';
import DistritctItem from './components/DistrictItem';

let addressMarker = null;

class AddressView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      districts: null,
      units: null,
      addressData: null,
      icon: null,
      error: null,
      fetching: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { divIcon } = require('leaflet');
    this.fetchData(match);

    // Create icon that can be added to map
    const addressIcon = divIcon({
      html: renderToStaticMarkup(
        <span style={{ fontSize: 36 }} className="icon-icon-address" />,
      ),
      iconSize: [45, 45],
      iconAnchor: [22, 42],
    });
    this.setState({ icon: addressIcon });
  }

  componentDidUpdate() {
    const {
      match, setHighlightedDistrict, highlightedDistrict, getLocaleText,
    } = this.props;
    const { addressData, error, fetching } = this.state;
    /* If new address is picked from the map while old address page is open,
    new data needs to be fetched. Fetch if url params dont match component state data */
    if (!fetching && !error && !(
      addressData
      && match.params.street === getLocaleText(addressData.street.name)
      && match.params.number === addressData.number
      && match.params.municipality === addressData.street.municipality)
    ) {
      this.fetchData(match);
      if (highlightedDistrict) {
        // Clear any drawn districts from map
        setHighlightedDistrict(null);
      }
    }
  }

  componentWillUnmount() {
    const {
      setHighlightedDistrict, setAddressTitle, map, getLocaleText,
    } = this.props;
    const { addressData } = this.state;
    if (addressMarker) {
      map.removeLayer(addressMarker);
    }
    setHighlightedDistrict(null);
    // Add addess name as title to redux, so that when returning to page, correct title is shown
    const title = addressData && `${getLocaleText(addressData.street.name)} ${addressData.number}, ${addressData.street.municipality}`;
    setAddressTitle(title);
  }

  addMarkerToMap = (coordinates, id) => {
    const { map, addressState } = this.props;
    const { icon } = this.state;
    const { clickCoordinates, addressId } = addressState;
    if (map) {
      const L = require('leaflet');
      /* If no user click location on redux or if the data is for old address,
      use the exact coordinates of the address instead of the user's click location */
      const position = !clickCoordinates || addressId !== id
        ? [coordinates[1], coordinates[0]] : clickCoordinates;

      if (addressMarker) {
        map.removeLayer(addressMarker);
      }
      addressMarker = new L.Marker(
        position,
        { icon },
      ).addTo(map);

      focusUnit(map, [position[1], position[0]]);
    }
  }

  fetchData = (match) => {
    const { intl, setAddressTitle, getLocaleText } = this.props;
    const { districts, units, fetching } = this.state;
    if (districts || units) {
      // Remove old data before fetching new
      this.setState({ districts: null, units: null });
    }
    if (!fetching) {
      this.setState({ fetching: true });
    }
    fetchAddressData(match)
      .then((data) => {
        const address = data;
        if (address) {
          // If address data has letters as well, combine them with address number
          if (address.letter) {
            address.number += address.letter;
          }
          this.setState({ addressData: address, fetching: false });
          const addressName = `${getLocaleText(address.street.name)} ${address.number}, ${address.street.municipality}`;
          setAddressTitle(addressName);
          const { coordinates } = address.location;
          this.addMarkerToMap(coordinates, address.street.id);
          this.fetchAddressDistricts(coordinates);
          this.fetchUnits(coordinates);
        } else {
          this.setState({ error: intl.formatMessage({ id: 'address.error' }), fetching: false });
        }
      });
  }

  fetchAddressDistricts = (lnglat) => {
    this.setState({ districts: null });
    fetchDistricts(lnglat)
      .then(response => this.setState({ districts: response }));
  }

  fetchUnits = (lnglat) => {
    const { setAddressUnits } = this.props;
    fetchAddressUnits(lnglat)
      .then((data) => {
        this.setState({ units: data.results });
        setAddressUnits(data.results);
      });
  }

  showOnMap = (title) => {
    const { match, navigator, setAddressTitle } = this.props;
    const { params } = match;
    // Set correct title (address or district name) for map title bar to display
    setAddressTitle(title);
    navigator.push('address', {
      municipality: params.municipality,
      street: params.street,
      number: params.number,
      query: '?map=true',
    });
  }

  showDistrictOnMap = (district, mobile) => {
    const {
      map,
      setHighlightedDistrict,
      getLocaleText,
      intl,
      highlightedDistrict,
    } = this.props;

    // On desktop mode if clicked on an already highlihted district, we want to toggle it off.
    if (!mobile && highlightedDistrict && highlightedDistrict.id === district.id) {
      setHighlightedDistrict(null);
    } else {
      setHighlightedDistrict(district);
    }

    const { coordinates } = district.boundary;
    focusDistrict(map, coordinates);
    // On mobile, show map when a district is clicked on the list
    if (mobile && navigator) {
      const districtName = district.name || district.unit.name;
      const title = `${getLocaleText(districtName)} ${intl.formatMessage({ id: `address.list.${district.type}` })}`;
      this.showOnMap(title);
    }
  }

  render() {
    const {
      match, intl, getLocaleText, map, classes,
    } = this.props;
    const {
      addressData, districts, units, error,
    } = this.state;

    if (units) {
      units.forEach((unit) => {
        // eslint-disable-next-line no-param-reassign
        unit.object_type = 'unit';
      });
    }

    const title = addressData ? `${getLocaleText(addressData.street.name)} ${addressData.number}, ${match.params.municipality}` : '';

    const head = addressData && (
      <HeadModifier>
        <title>
          {`${title} | ${intl.formatMessage({ id: 'app.title' })}`}
        </title>
      </HeadModifier>
    );

    const TopBar = (
      <div>
        <DesktopComponent>
          <SearchBar placeholder={intl.formatMessage({ id: 'search' })} />
        </DesktopComponent>
        <TitleBar icon={<AddressIcon />} title={error || title} />
      </div>
    );

    return (
      <div>
        {head}
        {TopBar}
        {districts && Object.entries(districts).map(districtList => (
          districtList[1].length > 0 && (
            <TitledList title={intl.formatMessage({ id: `address.list.${districtList[0]}` })} titleComponent="h4" key={districtList[0]}>
              {districtList[1].map((district) => {
                const title = district.name
                  ? getLocaleText(district.name) : getLocaleText(district.unit.name);
                const period = district.unit && district.start && district.end
                  ? `${district.start.substring(0, 4)}-${district.end.substring(0, 4)}` : null;

                return (
                  <DistritctItem
                    key={district.id}
                    district={district}
                    title={title}
                    period={period}
                    showDistrictOnMap={this.showDistrictOnMap}
                  />
                );
              })}
            </TitledList>
          )
        ))}
        {units && (
          <TitledList title={intl.formatMessage({ id: 'address.nearby' })} titleComponent="h4">
            {units.map(unit => (
              <UnitItem key={unit.id} unit={unit} />
            ))}
          </TitledList>
        )}
        {addressData && (
          <MobileComponent>
            <ServiceMapButton
              className={classes.mapButton}
              onClick={() => {
                if (navigator) {
                  focusUnit(map, addressData.location.coordinates);
                  const title = `${getLocaleText(addressData.street.name)} ${addressData.number}, ${addressData.street.municipality}`;
                  this.showOnMap(title);
                }
              }}
            >
              <MapIcon className={classes.icon} />
              <Typography variant="button">
                <FormattedMessage id="general.showOnMap" />
              </Typography>
            </ServiceMapButton>
          </MobileComponent>
        )}
      </div>
    );
  }
}

export default AddressView;

AddressView.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  setHighlightedDistrict: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  setAddressTitle: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  addressState: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

AddressView.defaultProps = {
  match: {},
  map: null,
  navigator: null,
  highlightedDistrict: null,
  addressState: null,
};
