import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { Map } from '@material-ui/icons';
import { focusDistrict, focusDistricts } from '../MapView/utils/mapActions';
import TabLists from '../../components/TabLists';
import GeographicalTab from './components/GeographicalTab';
import { parseSearchParams, uppercaseFirst } from '../../utils';
import ServiceTab from './components/ServiceTab';
import { districtFetch } from '../../utils/fetch';
import fetchAddress from '../MapView/utils/fetchAddress';
import TitleBar from '../../components/TitleBar';
import AddressSearchBar from '../../components/AddressSearchBar';
import { dataStructure, geographicalDistricts } from './utils/districtDataHelper';
import { handleOpenItems } from '../../redux/actions/district';
import SMButton from '../../components/ServiceMapButton';
import MobileComponent from '../../components/MobileComponent';
import useLocaleText from '../../utils/useLocaleText';
import SettingsInfo from '../../components/SettingsInfo';


const AreaView = ({
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  setDistrictAddressData,
  setMapState,
  fetchDistrictUnitList,
  fetchAllDistricts,
  unitsFetching,
  districtData,
  districtAddressData,
  selectedDistrictData,
  addressDistrict,
  subdistrictUnits,
  selectedSubdistricts,
  mapState,
  map,
  navigator,
  embed,
  intl,
  classes,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const localAddressData = useSelector(state => state.districts.districtAddressData);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const districtsFetching = useSelector(state => state.districts.districtsFetching);
  const getLocaleText = useLocaleText();
  const openItems = useSelector(state => state.districts.openItems);

  const searchParams = parseSearchParams(location.search);
  const selectedArea = searchParams.selected;
  // Get area parameter without year data
  const selectedAreaType = selectedArea?.split(/([0-9]+)/)[0];

  const getInitialOpenItems = () => {
    if (selectedAreaType) {
      const category = dataStructure.find(
        data => data.districts.includes(selectedAreaType),
      );
      return [category?.id];
    } return openItems;
  };

  // State
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [initialOpenItems] = useState(getInitialOpenItems);
  // Pending request to focus map to districts. Executed once district data is loaded
  const [focusTo, setFocusTo] = useState(null);

  const formAddressString = useCallback(
    address => (address
      ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
      : ''),
    [],
  );

  const focusMapToDistrict = (district) => {
    if (map?.leafletElement && district?.boundary) {
      focusDistrict(map.leafletElement, district.boundary.coordinates);
    }
  };

  const fetchAddressDistricts = async () => {
    const options = {
      lat: `${selectedAddress.location.coordinates[1]}`,
      lon: `${selectedAddress.location.coordinates[0]}`,
      page: 1,
      page_size: 200,
      type: `${dataStructure.map(item => item.districts).join(',')}`,
      geometry: true,
      unit_include: 'name,location',
    };
    await districtFetch(options)
      .then((data) => {
        setDistrictAddressData({
          address: selectedAddress,
          districts: data.results,
        });
      });
  };


  const getViewState = () => ({
    center: map.leafletElement.getCenter(),
    zoom: map.leafletElement.getZoom(),
  });

  const clearRadioButtonValue = useCallback(() => {
    setSelectedDistrictType(null);
    setSelectedDistrictServices([]);
    setSelectedSubdistricts([]);
  }, []);

  useEffect(() => () => {
    if (map) {
      // On unmount, save map position
      setMapState(getViewState());
    }
  }, [map]);


  useEffect(() => {
    // Focus map to local district when new address is selected
    if (selectedAddress && addressDistrict) {
      const district = localAddressData.districts.find(obj => obj.id === addressDistrict.id);
      focusMapToDistrict(district);
    }
  }, [addressDistrict, map]);


  useEffect(() => {
    if (selectedAddress) {
      if (!selectedAddress.districts
        || formAddressString(districtAddressData.address) !== formAddressString(selectedAddress)
      ) {
        fetchAddressDistricts();
      }
    } else {
      setDistrictAddressData(null);
    }
  }, [selectedAddress]);


  useEffect(() => {
    selectedSubdistricts.forEach((district) => {
      // Fetch geographical districts unless currently fetching or already fetched
      if (!unitsFetching.includes(district)
        && !subdistrictUnits.some(unit => unit.division_id === district)) {
        fetchDistrictUnitList(district);
      }
    });
  }, [selectedSubdistricts]);


  useEffect(() => {
    // If pending district focus, focus to districts when distitct data is loaded
    if (focusTo && selectedDistrictData.length) {
      if (focusTo === 'districts') {
        if (selectedDistrictData[0]?.boundary) {
          setFocusTo(null);
          focusDistricts(map.leafletElement, selectedDistrictData);
        }
      } else if (focusTo === 'subdistricts') {
        if (selectedDistrictData[0]?.boundary) {
          const filtetedDistricts = selectedDistrictData.filter(
            i => selectedSubdistricts.includes(i.ocd_id),
          );
          setFocusTo(null);
          focusDistricts(map.leafletElement, filtetedDistricts);
        }
      }
    }
  }, [selectedDistrictData, focusTo]);


  useEffect(() => {
    if (selectedAreaType) { // Arriving to page, with url parameters
      if (!embed) {
        /* Remove selected area parameter from url, otherwise it will override
        user area selection when returning to area view */
        history.replace();
        // Switch to geographical tab if geographical area
        if (geographicalDistricts.includes(selectedAreaType)) {
          const geoTab = document.getElementById('Tab1');
          if (geoTab) geoTab.click();
        }
      }

      // Fetch and select area from url parameters
      if (selectedArea !== selectedDistrictType) {
        fetchAllDistricts(selectedAreaType);
        if (!embed) {
          const category = dataStructure.find(
            data => data.districts.includes(selectedAreaType),
          );
          dispatch(handleOpenItems(category.id));
        }
        setSelectedDistrictType(selectedArea);
      }

      // Set selected geographical districts from url parameters and handle map focus
      if (searchParams.districts) {
        setSelectedSubdistricts(searchParams.districts.split(','));
        setFocusTo('subdistricts');
      } else {
        setFocusTo('districts');
      }

      // Set selected geographical services from url parameters
      if (searchParams.services) {
        const services = searchParams.services.split(',');
        const convertedServices = services.map(service => parseInt(service, 10));
        setSelectedDistrictServices(convertedServices);
      }

      // Set address from url paramters
      if (searchParams.lat && searchParams.lng) {
        fetchAddress({ lat: searchParams.lat, lng: searchParams.lng })
          .then(data => setSelectedAddress(data));
      }
    } else if (!districtData.length) { // Arriving to page first time, without url parameters
      fetchAllDistricts();
    } else if (mapState) { // Returning to page, without url parameters
      // Returns map to the previous spot
      const { center, zoom } = mapState;
      if (map?.leafletElement && center && zoom) map.leafletElement.setView(center, zoom);
    }
  }, []);

  if (!map || !map.leafletElement) {
    return null;
  }

  const renderServiceTab = () => (
    <ServiceTab
      selectedAddress={selectedAddress}
      districtData={districtData}
      initialOpenItems={initialOpenItems}
    />
  );

  const renderGeographicalTab = () => (
    <GeographicalTab
      initialOpenItems={initialOpenItems}
      formAddressString={formAddressString}
      clearRadioButtonValue={clearRadioButtonValue}
    />
  );


  const render = () => {
    const tabs = [
      {
        component: renderServiceTab(),
        title: intl.formatMessage({ id: 'area.tab.publicServices' }),
      },
      {
        component: renderGeographicalTab(),
        title: intl.formatMessage({ id: 'area.tab.geographical' }),
      },
    ];
    if (!embed) {
      return (
        <div>
          <TitleBar
            title={intl.formatMessage({ id: 'general.pageTitles.area' })}
            titleComponent="p"
            backButton
          />
          <div className={classes.addressArea}>
            <AddressSearchBar
              defaultAddress={districtAddressData.address}
              handleAddressChange={setSelectedAddress}
              title={(
                <>
                  <FormattedMessage id="area.searchbar.infoText.address" />
                  {' '}
                  <FormattedMessage id="area.searchbar.infoText.optional" />
                </>
              )}
            />
          </div>
          <TabLists
            onTabChange={() => (selectedDistrictType ? clearRadioButtonValue() : null)}
            data={tabs}
          />
          <SettingsInfo
            onlyCities
            title="settings.info.title.city"
            altTitle="settings.info.title.noSettings.city"
            settingsPage="area"
            noDivider
          />
          <MobileComponent>
            {!districtsFetching.length && (
              <SMButton
                aria-hidden
                role="link"
                margin
                messageID="general.showOnMap"
                icon={<Map />}
                className={classes.mapButton}
                onClick={() => navigator.openMap()}
              />
            )}
          </MobileComponent>
          <div className={classes.loadingText}>
            <Typography variant="srOnly" aria-live="assertive">
              {districtsFetching.length
                ? <FormattedMessage id="general.loading" />
                : <FormattedMessage id="general.loading.done" />
               }
            </Typography>
          </div>
        </div>
      );
    }
    return null;
  };

  return render();
};

AreaView.propTypes = {
  setSelectedDistrictType: PropTypes.func.isRequired,
};

export default AreaView;
