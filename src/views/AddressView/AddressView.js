/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Divider, List, ButtonBase,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Map } from '@material-ui/icons';
import Helmet from 'react-helmet';
import SearchBar from '../../components/SearchBar';
import { focusToPosition } from '../MapView/utils/mapActions';
import fetchAdministrativeDistricts from './utils/fetchAdministrativeDistricts';
import TitleBar from '../../components/TitleBar';
import { AddressIcon } from '../../components/SMIcon';

import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import SMButton from '../../components/ServiceMapButton';
import TabLists from '../../components/TabLists';
import { getAddressText, addressMatchParamsToFetchOptions } from '../../utils/address';
import DesktopComponent from '../../components/DesktopComponent';
import MobileComponent from '../../components/MobileComponent';
import DivisionItem from '../../components/ListItems/DivisionItem';
import { parseSearchParams } from '../../utils';


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
  const [error, setError] = useState(null);

  const {
    addressData,
    adminDistricts,
    classes,
    embed,
    intl,
    match,
    getAddressNavigatorParams,
    getDistance,
    getLocaleText,
    map,
    setAddressData,
    setAddressLocation,
    setAddressUnits,
    setDistrictAddressData,
    setAdminDistricts,
    setToRender,
    navigator,
    location,
    units,
  } = props;

  const fetchAddressDistricts = (lnglat) => {
    setAdminDistricts(null);
    // Fetch administrative districts data
    fetchAdministrativeDistricts(lnglat)
      .then(response => setAdminDistricts(response));
  };

  const fetchUnits = (lnglat) => {
    fetchAddressUnits(lnglat)
      .then((data) => {
        const units = data.results;
        units.forEach((unit) => {
          unit.object_type = 'unit';
        });
        setAddressUnits(data.results);
      });
  };

  const fetchData = () => {
    if (units) {
      // Remove old data before fetching new
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
          fetchAddressDistricts(coordinates);
          fetchUnits(coordinates);
        } else {
          setError(intl.formatMessage({ id: 'address.error' }));
        }
      });
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
          <ButtonBase
            role="link"
            className={classes.areaLink}
            onClick={() => {
              setDistrictAddressData({ address: addressData });
              navigator.push('area');
            }}
          >
            <Typography align="left" variant="body2">
              <FormattedMessage id="address.area.link" />
            </Typography>
          </ButtonBase>
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
  };

  // Update view data when match props (url) change
  useEffect(() => {
    if (map) {
      fetchData();
    }
  }, [match.url, map]);

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
      ariaLabel: intl.formatMessage({ id: 'address.nearby' }),
      component: renderNearbyList(),
      data: units,
      itemsPerPage: 10,
      title: intl.formatMessage({ id: 'address.nearby' }),
      noOrderer: true, // Remove this when we want result orderer for address unit list
      onClick: () => {
        setToRender('units');
      },
    },
  ];

  useEffect(() => {
    const searchParams = parseSearchParams(location.search);
    const selectedTab = parseInt(searchParams.t, 10) || 0;
    if (tabs[selectedTab].onClick) {
      tabs[selectedTab].onClick();
    }
  }, []);

  if (embed) {
    return null;
  }

  return (
    <div>
      {renderHead(title)}
      {renderTopBar(title)}
      <TabLists
        data={tabs}
        headerComponents={(
          <div className={classes.topArea}>
            {addressData && units && (
              <MobileComponent>
                <SMButton
                  role="link"
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
      {addressData && units && (
        <MobileComponent>
          <SMButton
            role="link"
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
  map: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  getAddressNavigatorParams: PropTypes.func.isRequired,
  getDistance: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  setAddressData: PropTypes.func.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  setAdminDistricts: PropTypes.func.isRequired,
  setDistrictAddressData: PropTypes.func.isRequired,
  setToRender: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
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
  embed: false,
  units: [],
};
