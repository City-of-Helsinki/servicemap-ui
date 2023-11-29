/* eslint-disable global-require */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonBase,
  Divider,
  List,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { Map } from '@mui/icons-material';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  selectAddressAdminDistricts, selectAddressData,
  selectAddressUnits,
} from '../../redux/selectors/address';
import { selectMapRef, selectNavigator } from '../../redux/selectors/general';
import { focusToPosition, useMapFocusDisabled } from '../MapView/utils/mapActions';
import fetchAdministrativeDistricts from './utils/fetchAdministrativeDistricts';
import fetchAddressUnits from './utils/fetchAddressUnits';
import fetchAddressData from './utils/fetchAddressData';
import { getAddressText } from '../../utils/address';
import config from '../../../config';
import useLocaleText from '../../utils/useLocaleText';
import { parseSearchParams } from '../../utils';
import { getCategoryDistricts } from '../AreaView/utils/districtDataHelper';
import {
  AddressIcon,
  DesktopComponent,
  DistrictItem,
  DivisionItem,
  MobileComponent,
  SearchBar,
  SMButton,
  TabLists,
  TitleBar,
} from '../../components';

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

const AddressView = (props) => {
  const intl = useIntl();
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const getLocaleText = useLocaleText();
  const match = useRouteMatch();
  const location = useLocation();
  const searchResults = useSelector(state => state.searchResults.data);
  const navigator = useSelector(selectNavigator);
  const map = useSelector(selectMapRef);
  const units = useSelector(selectAddressUnits);
  const adminDistricts = useSelector(selectAddressAdminDistricts);
  const addressData = useSelector(selectAddressData);

  const {
    embed,
    getDistance,
    setAddressData,
    setAddressLocation,
    setAddressUnits,
    setDistrictAddressData,
    setAdminDistricts,
    setToRender,
  } = props;

  let title = '';

  if (!isFetching) {
    title = getAddressText(addressData, getLocaleText);
  }

  const mapFocusDisabled = useMapFocusDisabled();

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

  const handleAddressData = (address) => {
    setAddressData(address);
    setAddressLocation({ addressCoordinates: address.location.coordinates });
    const { coordinates } = address.location;

    if (!mapFocusDisabled) {
      focusToPosition(map, [coordinates[0], coordinates[1]]);
    }
    fetchAddressDistricts(coordinates);
    fetchUnits(coordinates);
  };

  const fetchData = () => {
    const { municipality, street } = match.params;

    setAddressUnits([]);

    setIsFetching(true);
    fetchAddressData(municipality, street)
      .then((address) => {
        setIsFetching(false);
        if (address?.length) {
          handleAddressData(address[0]);
        } else {
          setError(intl.formatMessage({ id: 'address.error' }));
        }
      });
  };

  // Gets address data from previously fetched search results
  const getAddressFromSearch = () => {
    if (!searchResults.length) return null;
    const addressNameFromParams = match.params.street;
    const municipalityFromParams = match.params.municipality.toLowerCase();
    return searchResults.find(item => (
      addressNameFromParams === getLocaleText(item.name)
      && municipalityFromParams === item.municipality.id
    ));
  };

  const renderHead = () => {
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

  const renderTopBar = () => {
    if (!addressData) {
      return null;
    }
    return (
      <>
        <DesktopComponent>
          <SearchBar margin />
          <TitleBar
            sticky
            icon={<StyledAddressIcon />}
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
          />
        </MobileComponent>
      </>
    );
  };

  const renderNearbyList = () => {
    if (isFetching || !units) {
      return <Typography id="LoadingMessage"><FormattedMessage id="general.loading" /></Typography>;
    }
    if (units && !units.length) {
      return <Typography id="NoDataMessage"><FormattedMessage id="general.noData" /></Typography>;
    }
    return null;
  };


  const renderClosebyServices = () => {
    if (isFetching || !adminDistricts) {
      return <Typography><FormattedMessage id="general.loading" /></Typography>;
    }
    // Get divisions with units
    const divisionsWithUnits = adminDistricts
      .filter(d => d.unit)
      .filter(d => !hiddenDivisions[d.type]);
    // Get emergency division
    const emergencyDiv = adminDistricts.find(x => x.type === 'emergency_care_district');

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

    const getCustomRescueAreaTitle = area => `${area.origin_id} - ${getLocaleText(area.name)}`;
    const majorDistricts = adminDistricts.filter(x => x.type === 'major_district');
    const unitlessDistricts = [...rescueAreas, ...majorDistricts];

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
        <StyledServicesTitle>
          <Typography align="left" variant="body2"><FormattedMessage id="address.services.info" /></Typography>
          <StyledButtonBase
            role="link"
            onClick={() => {
              setDistrictAddressData({ address: addressData });
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
          {
            units.map((data) => {
              const key = `${data.area.id}`;
              const distance = getDistance(data);
              const customTitle = rescueAreaIDs.includes(data.area.type)
                ? `${intl.formatMessage({ id: `area.list.${data.area.type}` })} ${getCustomRescueAreaTitle(data.area)}`
                : null;
              return (
                <DivisionItem
                  data={data}
                  distance={distance}
                  divider
                  key={key}
                  customTitle={customTitle}
                />
              );
            })
          }
          {unitlessDistricts.map(area => (
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
        setToRender('units');
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
        setToRender('adminDistricts');
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
  }, [match.url, map]);

  if (embed) {
    return null;
  }

  return (
    <div>
      {renderHead()}
      {renderTopBar()}
      <TabLists
        data={tabs}
        headerComponents={(
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
        )}
      />
    </div>
  );
};

const StyledAddressIcon = styled(AddressIcon)(() => ({
  fontSize: 28,
  height: 24,
  width: 24,
  marginLeft: 0,
  marginRight: 0,
}));

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
  getDistance: PropTypes.func.isRequired,
  setAddressData: PropTypes.func.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  setAddressUnits: PropTypes.func.isRequired,
  setAdminDistricts: PropTypes.func.isRequired,
  setDistrictAddressData: PropTypes.func.isRequired,
  setToRender: PropTypes.func.isRequired,
  embed: PropTypes.bool,
};

AddressView.defaultProps = {
  embed: false,
};
