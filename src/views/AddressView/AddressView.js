/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import SearchBar from '../../components/SearchBar';
import { focusDistrict, focusUnit } from '../MapView/utils/mapActions';
import fetchDistricts from './utils/fetchDistricts';
import { MobileComponent, DesktopComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import TitleBar from '../../components/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import { AddressIcon, MapIcon } from '../../components/SMIcon';
import HeadModifier from '../../utils/headModifier';

import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import ServiceMapButton from '../../components/ServiceMapButton';
import DistritctItem from './components/DistrictItem';
import TabLists from '../../components/TabLists';


const AddressView = (props) => {
  const [districts, setDistricts] = useState(null);
  const [units, setUnits] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [error, setError] = useState(null);

  const {
    classes,
    embed,
    highlightedDistrict,
    intl,
    match,
    getLocaleText,
    map,
    setAddressLocation,
    setHighlightedDistrict,
    setAddressUnits,
    navigator,
  } = props;

  const unmountCleanup = () => {
    setHighlightedDistrict(null);
  };

  const fetchAddressDistricts = (lnglat) => {
    setDistricts(null);
    fetchDistricts(lnglat)
      .then(response => setDistricts(response));
  };

  const fetchUnits = (lnglat) => {
    if (embed) {
      return;
    }
    fetchAddressUnits(lnglat)
      .then((data) => {
        const units = data.results;
        units.forEach((unit) => {
          // eslint-disable-next-line no-param-reassign
          unit.object_type = 'unit';
        });
        setUnits(units);
        setAddressUnits(data.results);
      });
  };

  const fetchData = (match) => {
    if (districts || units) {
      // Remove old data before fetching new
      setDistricts(null);
      setUnits(null);
    }
    fetchAddressData(match)
      .then((data) => {
        const address = data;
        if (address) {
          // If address data has letters as well, combine them with address number
          if (address.letter) {
            address.number += address.letter;
          }
          setAddressLocation({ addressCoordinates: address.location.coordinates });
          setAddressData(address);
          const { coordinates } = address.location;

          focusUnit(map, [coordinates[0], coordinates[1]]);
          if (embed) {
            return;
          }
          fetchAddressDistricts(coordinates);
          fetchUnits(coordinates);
        } else {
          setError(intl.formatMessage({ id: 'address.error' }));
        }
      });
  };

  const showDistrictOnMap = (district, mobile) => {
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
      // mobileShowOnMap(title);
      navigator.openMap();
    }
  };

  const renderHead = (title) => {
    if (addressData) {
      return (
        <HeadModifier>
          <title>
            {`${title} | ${intl.formatMessage({ id: 'app.title' })}`}
          </title>
        </HeadModifier>
      );
    } return null;
  };

  const renderTopBar = title => (
    <div className={`${classes.topBar} sticky`}>
      <DesktopComponent>
        <SearchBar />
        <TitleBar icon={<AddressIcon className={classes.titleIcon} />} title={error || title} primary />
      </DesktopComponent>
      <MobileComponent>
        <TitleBar icon={<AddressIcon />} title={title} primary backButton />
      </MobileComponent>
    </div>
  );

  const renderNearbyList = () => {
    if (!units) {
      return <Typography><FormattedMessage id="general.loading" /></Typography>;
    } if (units && !units.length) {
      return <Typography><FormattedMessage id="general.noData" /></Typography>;
    }
    return null;
  };


  const renderDistrictsList = () => {
    if (districts) {
      if (Object.entries(districts).length !== 0) {
        return (
          Object.entries(districts).map(districtList => (
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
                    showDistrictOnMap={showDistrictOnMap}
                  />
                );
              })}
            </TitledList>
            )
          )));
      } return <Typography><FormattedMessage id="general.noData" /></Typography>;
    } return <Typography><FormattedMessage id="general.loading" /></Typography>;
  };

  // Clean up when component unmounts
  useEffect(() => () => unmountCleanup(), [map]);

  // Update view data when match props (url) change
  useEffect(() => {
    if (map) {
      fetchData(match);
      if (highlightedDistrict) {
        // Clear any drawn districts from map
        setHighlightedDistrict(null);
      }
    }
  }, [match.url, map]);

  if (embed) {
    return null;
  }

  // Render component
  const title = addressData ? `${getLocaleText(addressData.street.name)} ${addressData.number}, ${match.params.municipality}` : '';
  const tabs = [
    {
      ariaLabel: intl.formatMessage({ id: 'address.nearby' }),
      component: renderNearbyList(),
      data: units,
      itemsPerPage: 10,
      title: intl.formatMessage({ id: 'address.nearby' }),
      noOrderer: true, // Remove this when we want result orderer for address unit list
    },
    {
      ariaLabel: intl.formatMessage({ id: 'address.districts' }),
      component: renderDistrictsList(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'address.districts' }),
    },
  ];
  return (
    <div>
      {renderHead(title)}
      <TabLists
        data={tabs}
        headerComponents={(
          <>
            {renderTopBar(title)}
          </>
        )}
      />
      {addressData && units && districts && (
      <MobileComponent>
        <ServiceMapButton
          className={classes.mapButton}
          onClick={() => {
            if (navigator) {
              focusUnit(map, addressData.location.coordinates);
              navigator.openMap();
            }
          }}
        >
          <MapIcon className={classes.mapIcon} />
          <Typography variant="button">
            <FormattedMessage id="general.showOnMap" />
          </Typography>
        </ServiceMapButton>
      </MobileComponent>
      )}
    </div>
  );
};

export default AddressView;

AddressView.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  setHighlightedDistrict: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  embed: PropTypes.bool,
};

AddressView.defaultProps = {
  match: {},
  map: null,
  navigator: null,
  highlightedDistrict: null,
  embed: false,
};
