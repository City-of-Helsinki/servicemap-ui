/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, List } from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import { Map } from '@material-ui/icons';
import Helmet from 'react-helmet';
import SearchBar from '../../components/SearchBar';
import { focusDistrict, focusToPosition } from '../MapView/utils/mapActions';
import fetchDistricts, { fetchAdministrativeDistricts } from './utils/fetchDistricts';
import TitleBar from '../../components/TitleBar';
import TitledList from '../../components/Lists/TitledList';
import { AddressIcon } from '../../components/SMIcon';

import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import SMButton from '../../components/ServiceMapButton';
import DistrictItem from './components/DistrictItem';
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
        return 26104; // Haartman
      }
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:marian_päivystysalue': {
        return 26107; // Malmi
      }
      // The next ID anticipates a probable change in the division name
      case 'ocd-division/country:fi/kunta:helsinki/päivystysalue:malmin_päivystysalue': {
        return 26107; // Malmi
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
  const [error, setError] = useState(null);

  const {
    addressData,
    adminDistricts,
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
    setAdminDistricts,
    setToRender,
    navigator,
    units,
  } = props;

  const unmountCleanup = () => {
    setHighlightedDistrict(null);
  };

  const fetchAddressDistricts = (lnglat) => {
    setDistricts(null);
    setAdminDistricts(null);
    // Fetch district data
    fetchDistricts(lnglat)
      .then(response => setDistricts(response));
    // Fetch administrative districts data
    fetchAdministrativeDistricts(lnglat)
      .then(response => setAdminDistricts(response));
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
        setAddressUnits(data.results);
      });
  };

  const fetchData = () => {
    if (districts || units) {
      // Remove old data before fetching new
      setDistricts(null);
      setAddressUnits([]);
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
        <Helmet>
          <title>
            {`${title} | ${intl.formatMessage({ id: 'app.title' })}`}
          </title>
        </Helmet>
      );
    } return null;
  };

  const renderTopBar = title => (
    <>
      <DesktopComponent>
        <SearchBar margin />
        <TitleBar
          sticky
          icon={<AddressIcon className={classes.titleIcon} />}
          title={error || title}
          titleComponent="h3"
          primary
        />
      </DesktopComponent>
      <MobileComponent>
        <TitleBar
          sticky
          icon={<AddressIcon />}
          title={title}
          titleComponent="h3"
          primary
          backButton
        />
      </MobileComponent>
    </>
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
                    const unitName = district.unit ? getLocaleText(district.unit.name) : '?';
                    const title = district.name
                      ? getLocaleText(district.name) : unitName;
                    const period = district.start && district.end
                      ? `${district.start.substring(0, 4)}-${district.end.substring(0, 4)}` : null;

                    return (
                      <DistrictItem
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
    if (!adminDistricts) {
      return <Typography><FormattedMessage id="general.loading" /></Typography>;
    }
    // Get divisions with units
    const divisionsWithUnits = adminDistricts
      .filter(d => d.unit)
      .filter(d => !hiddenDivisions[d.type]);
    // Get emergency division
    const emergencyDiv = adminDistricts.find(x => x.type === 'emergency_care_district');

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
        <List>
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
        </List>
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
      onClick: () => {
        setToRender('adminDistricts');
      },
    },
    {
      ariaLabel: intl.formatMessage({ id: 'address.districts' }),
      component: renderDistrictsList(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'address.districts' }),
      onClick: () => {
        setToRender('district');
      },
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
        setToRender('units');
      },
    },
  ];
  return (
    <div>
      {renderHead(title)}
      {renderTopBar(title)}
      <TabLists
        data={tabs}
        headerComponents={(
          <div className={classes.topArea}>
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
  adminDistricts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
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
  setAdminDistricts: PropTypes.func.isRequired,
  setToRender: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  embed: PropTypes.bool,
  units: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })),
};

AddressView.defaultProps = {
  addressData: null,
  adminDistricts: null,
  match: {},
  map: null,
  navigator: null,
  highlightedDistrict: null,
  embed: false,
  units: [],
};
