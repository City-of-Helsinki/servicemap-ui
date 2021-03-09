import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { focusDistrict, focusDistricts } from '../MapView/utils/mapActions';
import TabLists from '../../components/TabLists';
import UnitTab from './components/UnitTab';
import { parseSearchParams, uppercaseFirst } from '../../utils';
import AreaTab from './components/AreaTab';
import { districtFetch } from '../../utils/fetch';
import fetchAddress from '../MapView/utils/fetchAddress';
import TitleBar from '../../components/TitleBar';
import AddressSearchBar from '../../components/AddressSearchBar';
import { dataStructure } from './utils/districtDataHelper';


const AreaView = ({
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  setDistrictAddressData,
  setAreaViewState,
  fetchDistrictUnitList,
  fetchAllDistricts,
  unitsFetching,
  districtData,
  districtAddressData,
  selectedDistrictData,
  addressDistrict,
  subdistrictUnits,
  selectedSubdistricts,
  areaViewState,
  map,
  getLocaleText,
  navigator,
  embed,
  intl,
  classes,
}) => {
  if (!map || !map.leafletElement) {
    return null;
  }

  const location = useLocation();
  const accordionStates = useRef(areaViewState || {});
  const localAddressData = useSelector(state => state.districts.districtAddressData);
  const selectedDistrictType = useSelector(state => state.districts.selectedDistrictType);
  const districtsFetching = useSelector(state => state.districts.districtsFetching);

  // State
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [openItems, setOpenItems] = useState(areaViewState ? areaViewState.openItems : []);
  // Pending request to focus map to districts. Executed once district data is loaded
  const [focusTo, setFocusTo] = useState(null);

  const formAddressString = useCallback(
    address => (address
      ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
      : ''),
    [],
  );

  const focusMapToDistrict = (district) => {
    focusDistrict(map.leafletElement, district.boundary.coordinates);
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


  const handleOpen = (item) => {
    if (openItems.includes(item.id)) {
      const items = openItems.filter(i => i !== item.id);
      setOpenItems(items);
    } else {
      setOpenItems([...openItems, item.id]);
    }
  };

  const getViewState = () => ({
    openItems: accordionStates.current.openItems,
    center: map.leafletElement.getCenter(),
    zoom: map.leafletElement.getZoom(),
  });

  const clearRadioButtonValue = useCallback(() => {
    setSelectedDistrictType(null);
    setSelectedDistrictServices([]);
    setSelectedSubdistricts([]);
  }, []);

  useEffect(() => () => {
    // On unmount, save map position and opened accordions
    setAreaViewState(getViewState());
  }, []);

  useEffect(() => {
    accordionStates.current.openItems = openItems;
  }, [openItems]);


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
    // Handle first mount of page
    if (!districtData.length) { // First time arriving to page
      // Apply url parameters if first render
      const searchParams = parseSearchParams(location.search);
      if (Object.keys(searchParams).length && searchParams.selected) {
        const paramValue = searchParams.selected.split(/([0-9]+)/)[0];
        fetchAllDistricts(paramValue);
        if (!embed) {
          const category = dataStructure.find(
            data => data.districts.includes(paramValue),
          );
          handleOpen(category);
        }
        // Set selected district type from url paramters
        setSelectedDistrictType(paramValue);
        if (searchParams.districts) {
          // Set selected geographical districts from url parameters
          setSelectedSubdistricts(searchParams.districts.split(','));
          setFocusTo('subdistricts');
        } else {
          setFocusTo('districts');
        }

        if (searchParams.services) {
          const services = searchParams.services.split(',');
          const convertedServices = services.map(service => parseInt(service, 10));
          setSelectedDistrictServices(convertedServices);
        }
        if (searchParams.lat && searchParams.lng) {
          // Set address from url paramters
          fetchAddress({ lat: searchParams.lat, lng: searchParams.lng })
            .then(data => setSelectedAddress(data));
        }
      } else {
        fetchAllDistricts();
      }
    } else if (areaViewState) { // Returning to page
      // Returns map to the previous spot
      const { center, zoom } = areaViewState;
      if (center && zoom) map.leafletElement.setView(center, zoom);
    }
  }, []);


  const renderAreaTab = () => (
    <AreaTab
      selectedAddress={selectedAddress}
      districtData={districtData}
      intitialOpenItems={accordionStates.current?.openItems}
      handleOpen={useCallback(item => handleOpen(item), [])}
      navigator={navigator}
      getLocaleText={getLocaleText}
    />
  );

  const renderUnitTab = () => (
    <UnitTab
      handleOpen={useCallback(item => handleOpen(item), [])}
      formAddressString={formAddressString}
      getLocaleText={useCallback(obj => getLocaleText(obj), [])}
      clearRadioButtonValue={clearRadioButtonValue}
    />
  );


  const render = () => {
    const tabs = [
      {
        component: renderAreaTab(),
        title: intl.formatMessage({ id: 'area.tab.publicServices' }),
      },
      {
        component: renderUnitTab(),
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
