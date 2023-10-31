/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  fetchDistricts,
  fetchDistrictUnitList,
  fetchParkingAreaGeometry,
  fetchParkingUnits,
  handleOpenItems,
  setDistrictAddressData,
  setMapState,
  setSelectedDistrictServices,
  setSelectedDistrictType,
  setSelectedParkingAreas,
  setSelectedSubdistricts,
} from '../../redux/actions/district';
import {
  getAddressDistrict,
  getDistrictsByType,
  selectDistrictAddressData,
  selectDistrictData,
  selectSelectedSubdistricts,
  selectSubdistrictUnits,
} from '../../redux/selectors/district';
import { selectMapRef } from '../../redux/selectors/general';
import { parseSearchParams } from '../../utils';
import { getAddressText } from '../../utils/address';
import { districtFetch } from '../../utils/fetch';
import MapUtility from '../../utils/mapUtility';
import useLocaleText from '../../utils/useLocaleText';
import fetchAddress from '../MapView/utils/fetchAddress';
import { focusDistrict, focusDistricts, useMapFocusDisabled } from '../MapView/utils/mapActions';
import SideBar from './components/SideBar/SideBar';
import { dataStructure, geographicalDistricts } from './utils/districtDataHelper';

const AreaView = ({ embed }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const districtData = useSelector(selectDistrictData);
  const districtAddressData = useSelector(selectDistrictAddressData);
  const subdistrictUnits = useSelector(selectSubdistrictUnits);
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const mapState = useSelector(state => state.districts.mapState);
  const unitsFetching = useSelector(state => state.districts.unitFetch.nodesFetching);
  const selectedDistrictData = useSelector(getDistrictsByType);
  const map = useSelector(selectMapRef);
  const addressDistrict = useSelector(getAddressDistrict);
  const getLocaleText = useLocaleText();
  const selectedDistrictGeometry = selectedDistrictData[0]?.boundary;

  const searchParams = parseSearchParams(location.search);
  const selectedArea = searchParams.selected;
  // Get area parameter without year data
  const selectedAreaType = selectedArea?.split(/([\d]+)/)[0];
  const mapFocusDisabled = useMapFocusDisabled();

  // State
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  // Pending request to focus map to districts. Executed once district data is loaded
  const [focusTo, setFocusTo] = useState(null);

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

  const getViewState = () => ({
    center: map.getCenter(),
    zoom: map.getZoom(),
  });

  useEffect(() => () => {
    if (map && MapUtility.mapHasMapPane(map)) {
      // On unmount, save map position
      dispatch(setMapState(getViewState()));
    }
  }, [map]);

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

  useEffect(() => {
    // If pending district focus, focus to districts when distitct data is loaded
    if (!mapFocusDisabled && focusTo && selectedDistrictData.length) {
      if (focusTo === 'districts') {
        if (selectedDistrictGeometry) {
          setFocusTo(null);
          focusDistricts(map, selectedDistrictData);
        }
      } else if (focusTo === 'subdistricts') {
        if (selectedDistrictGeometry) {
          const filtetedDistricts = selectedDistrictData.filter(
            i => selectedSubdistricts.includes(i.ocd_id),
          );
          setFocusTo(null);
          focusDistricts(map, filtetedDistricts);
        }
      }
    }
  }, [selectedDistrictData, focusTo]);

  useEffect(() => {
    if (!mapFocusDisabled
      && map
      && !focusTo
      && !addressDistrict
      && selectedDistrictGeometry) {
      focusDistricts(map, selectedDistrictData);
    }
  }, [selectedDistrictGeometry]);

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
        dispatch(fetchDistricts(selectedAreaType));
        if (!embed) {
          const category = dataStructure.find(
            data => data.districts.some(obj => obj.id === selectedAreaType),
          );
          dispatch(handleOpenItems(category.id));
        } else {
          dispatch(fetchDistricts(selectedAreaType, true));
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
        dispatch(fetchParkingUnits());
      }

      // Set selected geographical districts from url parameters and handle map focus
      if (searchParams.districts) {
        dispatch(setSelectedSubdistricts(searchParams.districts.split(',')));
        if (!mapFocusDisabled) {
          setFocusTo('subdistricts');
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
    } else if (!districtData.length) { // Arriving to page first time, without url parameters
      dispatch(fetchDistricts());
    } else if (mapState) { // Returning to page, without url parameters
      // Returns map to the previous spot
      const { center, zoom } = mapState;
      if (map && center && zoom) map.setView(center, zoom);
    }
  }, []);

  if (!map) {
    return null;
  }

  if (embed) {
    return null;
  }
  return <SideBar />;
};

AreaView.propTypes = {
  embed: PropTypes.bool,
};

AreaView.defaultProps = {
  embed: false,
};

export default AreaView;
