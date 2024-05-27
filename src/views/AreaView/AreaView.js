/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  fetchDistricts,
  fetchDistrictUnitList,
  fetchParkingAreaGeometry,
  fetchParkingGarages,
  handleOpenItems,
  setDistrictAddressData,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedParkingAreas,
  setSelectedSubdistricts,
} from '../../redux/actions/district';
import {
  getAddressDistrict,
  selectDistrictAddressData,
  selectDistrictDataBySelectedType,
  selectDistrictUnitFetch,
  selectSelectedParkingAreas,
  selectSelectedSubdistricts,
  selectSubdistrictUnits,
} from '../../redux/selectors/district';
import { selectMapRef } from '../../redux/selectors/general';
import { selectCities } from '../../redux/selectors/settings';
import { parseSearchParams } from '../../utils';
import { getAddressText } from '../../utils/address';
import { districtFetch } from '../../utils/fetch';
import { filterByCitySettings, resolveCitySettings } from '../../utils/filters';
import useLocaleText from '../../utils/useLocaleText';
import fetchAddress from '../MapView/utils/fetchAddress';
import { focusDistrict, focusDistricts, useMapFocusDisabled } from '../MapView/utils/mapActions';
import SideBar from './components/SideBar/SideBar';
import { dataStructure, geographicalDistricts } from './utils/districtDataHelper';

function getAreaType(selectedArea) {
  return selectedArea?.split(/([\d]+)/)[0];
}

function getAreaPeriod(selectedArea) {
  const arr = selectedArea?.split(/([\d]+)/);
  if (arr?.[1]) {
    return [arr?.[1], arr?.[2], arr?.[3]].join('');
  }
  return undefined;
}

const AreaView = ({ embed }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const districtAddressData = useSelector(selectDistrictAddressData);
  const subdistrictUnits = useSelector(selectSubdistrictUnits);
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const citySettings = useSelector(selectCities);
  const unitsFetching = useSelector(state => selectDistrictUnitFetch(state).nodesFetching);
  const districtData = useSelector(selectDistrictDataBySelectedType);
  const map = useSelector(selectMapRef);
  const addressDistrict = useSelector(getAddressDistrict);
  const getLocaleText = useLocaleText();

  const cityFilter = filterByCitySettings(resolveCitySettings(citySettings, location, embed));
  const selectedDistrictData = districtData.filter(cityFilter);
  const parkingAreas = useSelector(selectSelectedParkingAreas);
  const geometryLoaded = !!selectedDistrictData[0]?.boundary || !!parkingAreas[0]?.boundary;

  const searchParams = parseSearchParams(location.search);
  const selectedArea = searchParams.selected;
  // Get area parameter without year data
  const selectedAreaType = getAreaType(selectedArea);
  const selectedAreaPeriod = getAreaPeriod(selectedArea);
  const mapFocusDisabled = useMapFocusDisabled();

  // State
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  // Pending request to focus map to districts. Executed once district data is loaded
  const [focusTo, setFocusTo] = useState(null);
  // Has a pending focusTo request been made. Use this to not double focus
  const [focusInitiated, setFocusInitiated] = useState(false);

  const focusMapToDistrict = (district) => {
    if (!mapFocusDisabled && map && district?.boundary) {
      focusDistrict(map, district.boundary.coordinates);
    }
  };

  const fetchAddressDistricts = async () => {
    const options = {
      lat: `${selectedAddress.location.coordinates[1]}`,
      lon: `${selectedAddress.location.coordinates[0]}`,
      page: 1,
      page_size: 200,
      type: `${dataStructure.map(item => item.districts.map(obj => obj.id)).join(',')}`,
      geometry: true,
      unit_include: 'name,location',
    };
    await districtFetch(options)
      .then((data) => {
        dispatch(setDistrictAddressData({
          address: selectedAddress,
          districts: data.results,
        }));
      });
  };

  useEffect(() => {
    // Focus map to local district when new address is selected
    if (selectedAddress && addressDistrict) {
      focusMapToDistrict(addressDistrict);
    }
  }, [addressDistrict, map]);

  useEffect(() => {
    if (selectedAddress) {
      if (!selectedAddress.districts
        || getAddressText(districtAddressData.address, getLocaleText) !== getAddressText(selectedAddress, getLocaleText)
      ) {
        fetchAddressDistricts();
      }
    } else {
      dispatch(setDistrictAddressData(null));
    }
  }, [selectedAddress]);

  useEffect(() => {
    selectedSubdistricts.forEach((district) => {
      // Fetch geographical districts unless currently fetching or already fetched
      if (!unitsFetching.includes(district)
        && !subdistrictUnits.some(unit => unit.division_id === district)) {
        dispatch(fetchDistrictUnitList(district));
      }
    });
  }, [selectedSubdistricts]);

  const isPossibleToFocus = () => !!map && !mapFocusDisabled && geometryLoaded;

  useEffect(() => {
    // If pending district focus, focus to districts when district data is loaded
    if (isPossibleToFocus()) {
      if (focusTo === 'districts') {
        setFocusTo(null);
        focusDistricts(map, selectedDistrictData);
      }
      if (focusTo === 'subdistricts') {
        const filteredDistricts = selectedDistrictData.filter(i => selectedSubdistricts.includes(i.ocd_id));
        setFocusTo(null);
        focusDistricts(map, filteredDistricts);
      }
    }
  }, [selectedDistrictData, focusTo]);

  useEffect(() => {
    if (isPossibleToFocus() && !focusTo && !addressDistrict && !focusInitiated) {
      focusDistricts(map, [...selectedDistrictData, ...parkingAreas]);
    }
  }, [selectedDistrictData, addressDistrict, parkingAreas]);

  useEffect(() => {
    if (searchParams.selected
      || searchParams.parkingSpaces
      || searchParams.parkingUnits
    ) { // Arriving to page, with url parameters
      if (!embed) {
        /* Remove selected area parameter from url, otherwise it will override
        user area selection when returning to area view */
        history.replace();
        dispatch(setSelectedDistrictType(null));
        // Switch to geographical tab if geographical area
        if (geographicalDistricts.includes(selectedAreaType)) {
          const geoTab = document.getElementById('Tab1');
          if (geoTab) geoTab.click();
        }
      }

      // Fetch and select area from url parameters
      if (selectedArea && !dataStructure.some(obj => obj.id === selectedArea)) {
        dispatch(fetchDistricts(selectedAreaType, false, selectedAreaPeriod));
        if (!embed) {
          const category = dataStructure.find(
            data => data.districts.some(obj => obj.id === selectedAreaType),
          );
          dispatch(handleOpenItems(category.id));
        } else {
          dispatch(fetchDistricts(selectedAreaType, true, selectedAreaPeriod));
        }
        dispatch(setSelectedDistrictType(selectedArea));
      } else if (!embed) {
        dispatch(fetchDistricts());
      }

      // Set selected parking spaces from url parameters
      if (searchParams.parkingSpaces) {
        const parkingAreas = searchParams.parkingSpaces.split(',');
        dispatch(setSelectedParkingAreas(parkingAreas));
        parkingAreas.forEach((area) => {
          dispatch(fetchParkingAreaGeometry(area));
        });
      }
      if (searchParams.parkingUnits) {
        dispatch(fetchParkingGarages());
      }

      // Set selected geographical districts from url parameters and handle map focus
      if (searchParams.districts) {
        dispatch(setSelectedSubdistricts(searchParams.districts.split(',')));
        if (!mapFocusDisabled) {
          setFocusTo('subdistricts');
          setFocusInitiated(true);
        }
      }

      // Set selected geographical services from url parameters
      if (searchParams.services) {
        const services = searchParams.services.split(',');
        const convertedServices = services.map(service => parseInt(service, 10));
        dispatch(setSelectedDistrictServices(convertedServices));
      }

      // Set address from url paramters
      if (searchParams.lat && searchParams.lng) {
        fetchAddress({ lat: searchParams.lat, lng: searchParams.lng })
          .then(data => setSelectedAddress(data));
      }
    }
  }, []);

  if (!map || embed) {
    return null;
  }
  return <SideBar setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress} />;
};

AreaView.propTypes = {
  embed: PropTypes.bool,
};

AreaView.defaultProps = {
  embed: false,
};

export default AreaView;
