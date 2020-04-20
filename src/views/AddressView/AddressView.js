/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import { Map } from '@material-ui/icons';
import SearchBar from '../../components/SearchBar';
import { focusDistrict, focusToPosition } from '../MapView/utils/mapActions';
import fetchDistricts, { fetchAdministrativeDistricts } from './utils/fetchDistricts';
import TitleBar from '../../components/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import { AddressIcon } from '../../components/SMIcon';
import HeadModifier from '../../components/HeadModifier';

import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import SMButton from '../../components/ServiceMapButton';
import DistritctItem from './components/DistrictItem';
import TabLists from '../../components/TabLists';
import { getAddressText, addressMatchParamsToFetchOptions } from '../../utils/address';
import DesktopComponent from '../../components/DesktopComponent';
import MobileComponent from '../../components/MobileComponent';
import DivisionItem from '../../components/ListItems/DivisionItem';


const hiddenDivisions = {
  emergency_care_district: true,
};

const getEmergencyCareUnit = (division) => {
  if (division && division.type === 'emergency_care_district') {
    switch (division.ocd_id) {
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:haartmanin_päivystysalue': {
        return 11828; // Haartman
      }
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:marian_päivystysalue': {
        return 4060; // Malmi
      }
      // The next ID anticipates a probable change in the division name
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:malmin_päivystysalue': {
        return 4060; // Malmi
      }
      default: {
        return null;
      }
    }
  }
  return null;
};

const AddressView = (props) => {
  const [districts, setDistricts] = useState(null);
  const [administrativeDistricts, setAdministrativeDistricts] = useState([]);
  const [units, setUnits] = useState(null);
  const [error, setError] = useState(null);

  const {
    addressData,
    classes,
    embed,
    highlightedDistrict,
    intl,
    match,
    getAddressNavigatorParams,
    getDistance,
    getLocaleText,
    map,
    setAddressData,
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
    fetchAdministrativeDistricts(lnglat)
      .then(response => setAdministrativeDistricts(response));
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

  const fetchData = () => {
    if (districts || units) {
      // Remove old data before fetching new
      setDistricts(null);
      setUnits(null);
    }

    const options = match ? addressMatchParamsToFetchOptions(match) : {};

    fetchAddressData(options)
      .then((data) => {
        const address = data;
        if (address) {
          // Check if address data is in different language
          // and move navigation to address page with correct language
          const { params } = match;

          if (params.street.toLowerCase() !== getLocaleText(address.street.name).toLowerCase()) {
            navigator.replace('address', {
              ...getAddressNavigatorParams(address),
              embed,
            });
          }
          setAddressData(address);
          setAddressLocation({ addressCoordinates: address.location.coordinates });
          const { coordinates } = address.location;

          focusToPosition(map, [coordinates[0], coordinates[1]]);
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
      // Use this code if we want to show district title on mobile map
      // const districtName = district.name || district.unit.name;
      // const title = `${getLocaleText(districtName)} ${intl.formatMessage({ id: `address.list.${district.type}` })}`;
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
    <div>
      <DesktopComponent>
        <SearchBar margin />
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
              <div key={districtList[0]} className={classes.districtListcontainer}>
                <TitledList title={intl.formatMessage({ id: `address.list.${districtList[0]}` })} titleComponent="h4">
                  {districtList[1].map((district) => {
                    const title = district.name
                      ? getLocaleText(district.name) : (district.unit ? getLocaleText(district.unit.name) : '?');
                    const period = district.start && district.end
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
              </div>
            )
          )));
      } return <Typography><FormattedMessage id="general.noData" /></Typography>;
    } return <Typography><FormattedMessage id="general.loading" /></Typography>;
  };

  const renderClosebyServices = () => {
    if (!administrativeDistricts) {
      return null;
    }

    // Get divisions with units
    const divisionsWithUnits = administrativeDistricts
      .filter(d => d.unit)
      .filter(d => !hiddenDivisions[d.type]);
    // Get emergency division
    const emergencyDiv = administrativeDistricts.find(x => x.type === 'emergency_care_district');

    const units = divisionsWithUnits.map((x) => {
      const { unit } = x;
      const unitData = unit;
      unitData.area = x;
      if (x.type === 'health_station_district') {
        unitData.emergencyUnitId = getEmergencyCareUnit(emergencyDiv);
      }
      return unitData;
    });

    return (
      <>
        <div className={classes.servicesTitle}>
          <Typography align="left" variant="body2"><FormattedMessage id="address.services.info" /></Typography>
        </div>
        <Divider aria-hidden />
        {
          units.map((data) => {
            const key = `${data.area.id}`;
            const distance = getDistance(data);
            return (
              <DivisionItem
                data={data}
                distance={distance}
                divider
                key={key}
              />
            );
          })
        }
      </>
    );
  }

  // Clean up when component unmounts
  useEffect(() => () => unmountCleanup(), [map]);

  // Update view data when match props (url) change
  useEffect(() => {
    if (map) {
      fetchData();
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
  const title = getAddressText(addressData, getLocaleText);
  const tabs = [
    {
      ariaLabel: intl.formatMessage({ id: 'service.nearby' }),
      component: renderClosebyServices(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'service.nearby' }),
    },
    {
      ariaLabel: intl.formatMessage({ id: 'address.districts' }),
      component: renderDistrictsList(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'address.districts' }),
    },
    {
      ariaLabel: intl.formatMessage({ id: 'address.nearby' }),
      component: renderNearbyList(),
      data: units,
      itemsPerPage: 10,
      title: intl.formatMessage({ id: 'address.nearby' }),
      noOrderer: true, // Remove this when we want result orderer for address unit list
      onClick: () => {
        if (highlightedDistrict) {
          setHighlightedDistrict(null);
        }
      },
    },
  ];
  return (
    <div>
      {renderHead(title)}
      <TabLists
        data={tabs}
        headerComponents={(
          <div className={`${classes.topArea} sticky`}>
            {renderTopBar(title)}
            {addressData && units && districts && (
            <MobileComponent>
              <SMButton
                margin
                messageID="general.showOnMap"
                icon={<Map />}
                className={classes.mapButton}
                onClick={() => {
                  if (navigator) {
                    focusToPosition(map, addressData.location.coordinates);
                    navigator.openMap();
                  }
                }}
              />
            </MobileComponent>
            )}
          </div>
        )}
      />
      {addressData && units && districts && (
      <MobileComponent>
        <SMButton
          messageID="general.showOnMap"
          icon={<Map />}
          className={classes.mapButton}
          onClick={() => {
            if (navigator) {
              focusToPosition(map, addressData.location.coordinates);
              navigator.openMap();
            }
          }}
        />
      </MobileComponent>
      )}
    </div>
  );
};

export default AddressView;

AddressView.propTypes = {
  addressData: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  setHighlightedDistrict: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getAddressNavigatorParams: PropTypes.func.isRequired,
  getDistance: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  setAddressData: PropTypes.func.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  embed: PropTypes.bool,
};

AddressView.defaultProps = {
  addressData: null,
  match: {},
  map: null,
  navigator: null,
  highlightedDistrict: null,
  embed: false,
};
