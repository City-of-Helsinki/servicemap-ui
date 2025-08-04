/* eslint-disable global-require */
import styled from '@emotion/styled';
import { Map } from '@mui/icons-material';
import { ButtonBase, Divider, List, Typography } from '@mui/material';
import PropTypes from 'prop-types';
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';

import config from '../../../config';
import {
  DesktopComponent,
  DistrictItem,
  DivisionItem,
  MobileComponent,
  SearchBar,
  SMButton,
  TabLists,
} from '../../components';
import AddressInfo from '../../components/AddressInfo/AddressInfo';
import {
  setAddressData,
  setAddressLocation,
  setAddressUnits,
  setAdminDistricts,
  setToRender,
} from '../../redux/actions/address';
import { setDistrictAddressData } from '../../redux/actions/district';
import {
  selectAddressAdminDistricts,
  selectAddressData,
  selectAddressUnits,
} from '../../redux/selectors/address';
import { selectMapRef, selectNavigator } from '../../redux/selectors/general';
import { selectResultsData } from '../../redux/selectors/results';
import {
  calculateDistance,
  getCurrentlyUsedPosition,
} from '../../redux/selectors/unit';
import { formatDistanceObject, parseSearchParams } from '../../utils';
import { getAddressText } from '../../utils/address';
import useLocaleText from '../../utils/useLocaleText';
import { getCategoryDistricts } from '../AreaView/utils/districtDataHelper';
import {
  focusToPosition,
  useMapFocusDisabled,
} from '../MapView/utils/mapActions';
import fetchAddressData from './utils/fetchAddressData';
import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAdministrativeDistricts from './utils/fetchAdministrativeDistricts';

const hiddenDivisions = {
  emergency_care_district: true,
};

const getEmergencyCareUnit = (division) => {
  if (division?.type === 'emergency_care_district') {
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
function AddressView({ embed = false }) {
  const intl = useIntl();
  // This is not nice that we have 3 isFetching variables
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isFetchingUnits, setIsFetchingUnits] = useState(false);
  const [isFetchingDistricts, setIsFetchingDistricts] = useState(false);
  const getLocaleText = useLocaleText();
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchResults = useSelector(selectResultsData);
  const navigator = useSelector(selectNavigator);
  const map = useSelector(selectMapRef);
  const units = useSelector(selectAddressUnits);
  const adminDistricts = useSelector(selectAddressAdminDistricts);
  const addressData = useSelector(selectAddressData);
  const currentPosition = useSelector(getCurrentlyUsedPosition);
  const getDistance = (unit) =>
    formatDistanceObject(intl, calculateDistance(unit, currentPosition));

  const mapFocusDisabled = useMapFocusDisabled();

  const fetchAddressDistricts = (lnglat) => {
    // Fetch administrative districts data
    setIsFetchingDistricts(true);
    fetchAdministrativeDistricts(lnglat).then((response) => {
      dispatch(setAdminDistricts(response));
      setIsFetchingDistricts(false);
    });
  };

  const fetchUnits = (lnglat, distance = 100) => {
    // By default, fetch units within 100 meters but if there are less than 50 units,
    // fetch units within 500 meters
    setIsFetchingUnits(true);
    fetchAddressUnits(lnglat, distance).then((data) => {
      const units = data?.results || [];
      units.forEach((unit) => {
        unit.object_type = 'unit';
      });
      dispatch(setAddressUnits(units));
      setIsFetchingUnits(false);

      if (units.length < 50 && distance === 100) {
        fetchUnits(lnglat, 500);
      }
    });
  };

  const handleAddressData = (address) => {
    dispatch(setAddressData(address));
    dispatch(
      setAddressLocation({ addressCoordinates: address.location.coordinates })
    );
    const { coordinates } = address.location;

    if (!mapFocusDisabled) {
      focusToPosition(map, [coordinates[0], coordinates[1]]);
    }
    fetchAddressDistricts(coordinates);
    fetchUnits(coordinates);
  };

  const fetchData = () => {
    const { municipality, street } = match.params;

    dispatch(setAddressUnits([]));

    setIsFetchingAddress(true);
    fetchAddressData(municipality, street).then((address) => {
      if (address?.length) {
        handleAddressData(address[0]);
      }
      setIsFetchingAddress(false);
    });
  };

  // Gets address data from previously fetched search results
  const getAddressFromSearch = () => {
    if (!searchResults.length) return null;
    const addressNameFromParams = match.params.street;
    const municipalityFromParams = match.params.municipality.toLowerCase();
    return searchResults.find(
      (item) =>
        addressNameFromParams === getLocaleText(item.name) &&
        municipalityFromParams === item.municipality.id
    );
  };

  const renderHead = () => {
    const title = getAddressText(addressData, getLocaleText);
    return (
      <Helmet>
        <title>{`${title} | ${intl.formatMessage({ id: 'app.title' })}`}</title>
      </Helmet>
    );
  };

  const renderTopBar = () => {
    if (isFetchingDistricts) {
      return null;
    }
    return (
      <>
        <DesktopComponent>
          <SearchBar margin />
          <AddressInfo address={addressData} districts={adminDistricts} />
        </DesktopComponent>
        <MobileComponent>
          <AddressInfo address={addressData} districts={adminDistricts} />
        </MobileComponent>
      </>
    );
  };

  const renderNearbyList = () => {
    if (isFetchingAddress || isFetchingUnits || !units) {
      return (
        <Typography data-sm="LoadingMessage">
          <FormattedMessage id="general.loading" />
        </Typography>
      );
    }
    if (!units.length) {
      return (
        <Typography data-sm="NoDataMessage">
          <FormattedMessage id="general.noData" />
        </Typography>
      );
    }
    return null;
  };

  const renderClosebyServices = () => {
    if (
      !addressData ||
      isFetchingAddress ||
      isFetchingDistricts ||
      !adminDistricts
    ) {
      return (
        <Typography>
          <FormattedMessage id="general.loading" />
        </Typography>
      );
    }
    // Get emergency division
    const emergencyDiv = adminDistricts.find(
      (x) => x.type === 'emergency_care_district'
    );

    // Also add rescue areas that have no units
    const rescueAreaIDs = getCategoryDistricts('protection');
    const rescueAreas = adminDistricts.filter((obj, i) => {
      if (rescueAreaIDs.includes(obj.type)) {
        if (!obj.unit) {
          return true;
        }
        // Move rescue areas to the end of unit list
        adminDistricts.push(adminDistricts.splice(i, 1)[0]);
        return false;
      }
      return false;
    });

    const getCustomRescueAreaTitle = (area) =>
      `${area.origin_id} - ${getLocaleText(area.name)}`;
    const majorDistricts = adminDistricts.filter(
      (x) => x.type === 'major_district'
    );
    const unitlessDistricts = [...rescueAreas, ...majorDistricts];

    function collectUnitsFromDistrict(district) {
      return [district.unit, ...(district.units || [])]
        .filter((x) => !!x)
        .filter(
          (unit, index, self) =>
            index === self.findIndex((x) => x.id === unit.id)
        ); // Distinct by id
    }

    const setsOfUnitsFromDistricts = adminDistricts
      .filter((d) => !hiddenDivisions[d.type])
      .map((district) => ({
        district,
        units: collectUnitsFromDistrict(district),
      }))
      .filter(({ units }) => units.length)
      .map(({ district, units }) =>
        units.map((unit) => {
          const newUnit = { ...unit, area: district };
          if (district.type === 'health_station_district') {
            newUnit.emergencyUnitId = getEmergencyCareUnit(emergencyDiv);
          }
          return newUnit;
        })
      );

    return (
      <>
        <StyledServicesTitle>
          <Typography align="left" variant="body2">
            <FormattedMessage id="address.services.info" />
          </Typography>
          <StyledButtonBase
            role="link"
            onClick={() => {
              dispatch(setDistrictAddressData({ address: addressData }));
              navigator.push('area');
            }}
            id="areaViewLink"
          >
            <Typography align="left" variant="body2">
              <FormattedMessage id="address.area.link" />
            </Typography>
          </StyledButtonBase>
        </StyledServicesTitle>
        <Divider aria-hidden />
        <List>
          {setsOfUnitsFromDistricts.flatMap((units) =>
            units.map((data, index) => {
              const key = `${data.area.id}-${data.id}`;
              const distance = getDistance(data);
              const customTitle = rescueAreaIDs.includes(data.area.type)
                ? `${intl.formatMessage({ id: `area.list.${data.area.type}` })} ${getCustomRescueAreaTitle(data.area)}`
                : null;
              return (
                <DivisionItem
                  data={data}
                  distance={distance}
                  divider={index === units.length - 1}
                  hideTitle={index !== 0}
                  key={key}
                  customTitle={customTitle}
                />
              );
            })
          )}
          {unitlessDistricts.map((area) => (
            <DistrictItem key={area.id} area={area} />
          ))}
        </List>
      </>
    );
  };

  // Render component
  const tabs = [
    {
      ariaLabel: intl.formatMessage({ id: 'address.nearby' }),
      component: renderNearbyList(),
      data: units,
      itemsPerPage: 10,
      title: intl.formatMessage({ id: 'address.nearby' }),
      noOrderer: true, // Remove this when we want result orderer for address unit list
      onClick: () => {
        dispatch(setToRender('units'));
      },
    },
  ];

  // Show/Hide nearby service tab dynamically, show only if area selection is shown
  if (config.showAreaSelection) {
    const nearbyServicesTab = {
      ariaLabel: intl.formatMessage({ id: 'address.services.header' }),
      component: renderClosebyServices(),
      data: null,
      itemsPerPage: null,
      title: intl.formatMessage({ id: 'address.services.header' }),
      onClick: () => {
        dispatch(setToRender('adminDistricts'));
      },
    };
    tabs.unshift(nearbyServicesTab);
  }

  useEffect(() => {
    const searchParams = parseSearchParams(location.search);
    const selectedTab = parseInt(searchParams.t, 10) || 0;
    if (tabs[selectedTab].onClick) {
      tabs[selectedTab].onClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update view data when match props (url) change
  useEffect(() => {
    if (map) {
      // If navigating from search page, address data should already be in search results
      const addressFromSearch = getAddressFromSearch();
      if (addressFromSearch) {
        handleAddressData(addressFromSearch);
      } else {
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.url, map]);

  if (embed || isFetchingAddress || !addressData) {
    return null;
  }

  return (
    <div>
      {renderHead()}
      {renderTopBar()}
      <TabLists
        data={tabs}
        headerComponents={
          <StyledTopArea>
            {addressData && units && (
              <MobileComponent>
                <StyledSMButton
                  aria-hidden
                  margin
                  messageID="general.showOnMap"
                  icon={<Map />}
                  onClick={() => {
                    if (navigator) {
                      focusToPosition(map, addressData.location.coordinates);
                      navigator.openMap();
                    }
                  }}
                />
              </MobileComponent>
            )}
          </StyledTopArea>
        }
      />
    </div>
  );
}

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  color: theme.palette.link.main,
  textDecoration: 'underline',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  '&:hover': {
    opacity: '0.7',
  },
}));

const StyledSMButton = styled(SMButton)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginLeft: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const StyledServicesTitle = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1, 2),
  textAlign: 'left',
}));

const StyledTopArea = styled('div')(() => ({
  backgroundColor: '#fff',
  textAlign: 'left',
}));

export default AddressView;

AddressView.propTypes = {
  embed: PropTypes.bool,
};
