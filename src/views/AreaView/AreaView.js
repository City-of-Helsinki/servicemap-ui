

import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';
import area from '@turf/area';
import { focusDistrict } from '../MapView/utils/mapActions';
import TabLists from '../../components/TabLists';
import UnitTab from './components/UnitTab';
import { uppercaseFirst } from '../../utils';
import AreaTab from './components/AreaTab';
import { districtFetch } from '../../utils/fetch';


const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, action.value];
    case 'remove':
      return state.filter(item => item !== action.value);
    default:
      throw new Error();
  }
};

const AreaView = ({
  setSelectedDistrict,
  setDistrictData,
  setDistrictAddressData,
  districtData,
  districtAddressData,
  selectedDistrict,
  selectedDistrictData,
  addressDistrict,
  map,
  getLocaleText,
  navigator,
  classes,
  intl,
}) => {
  const dataStructure = [ // Categorized district data structure
    {
      title: intl.formatMessage({ id: 'area.list.health' }),
      districts: [
        'health_station_district',
        'maternity_clinic_district',
      ],
    },
    {
      title: intl.formatMessage({ id: 'area.list.education' }),
      districts: [
        'lower_comprehensive_school_district_fi',
        'lower_comprehensive_school_district_sv',
        'upper_comprehensive_school_district_fi',
        'upper_comprehensive_school_district_sv',
      ],
      subCategories: [
        {
          subtitle: intl.formatMessage({ id: 'area.list.education.finnish' }),
          districts: [
            'lower_comprehensive_school_district_fi',
            'upper_comprehensive_school_district_fi',
          ],
        },
        {
          subtitle: intl.formatMessage({ id: 'area.list.education.swedish' }),
          districts: [
            'lower_comprehensive_school_district_sv',
            'upper_comprehensive_school_district_sv',
          ],
        },
      ],
    },
    {
      title: intl.formatMessage({ id: 'area.list.preschool' }),
      districts: [
        'preschool_education_fi',
        'preschool_education_sv',
      ],
    },
    {
      title: intl.formatMessage({ id: 'area.list.geographical' }),
      districts: [
        'neighborhood',
        'postcode_area',
      ],
    },
    {
      title: intl.formatMessage({ id: 'area.list.protection' }),
      districts: [
        'rescue_area',
        'rescue_district',
        'rescue_sub_district',
      ],
    },
  ];

  // State
  const [radioValue, setRadioValue] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [openItems, setOpenItems] = useState([]); // List items that are expanded
  const [fetching, dispatchFetching] = useReducer(fetchReducer, []); // Fetch state

  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

  const focusLocalDistrict = () => {
    if (selectedAddress && addressDistrict) {
      const district = selectedDistrictData.find(obj => obj.id === addressDistrict);
      focusDistrict(map.leafletElement, district.boundary.coordinates);
    }
  };

  const changeDistrictData = (data, type) => {
    // Collect different periods from district data
    const dateArray = [];
    data.forEach((item) => {
      if (item.start && item.end) {
        const period = `${item.start}-${item.end}`;
        if (!dateArray.includes(period)) {
          dateArray.push(period);
        }
      }
    });
    // If different periods were found, seperate them into idividual objects
    if (dateArray.length) {
      const dataItems = dateArray.map(period => data.filter(district => `${district.start}-${district.end}` === period));
      dataItems.forEach((data, i) => {
        setDistrictData({
          id: `${type}${dateArray[i]}`, data, date: dateArray[i], name: type,
        });
      });
    } else {
      setDistrictData({ id: type, data, name: type });
    }
  };

  const compareBoundaries = (a, b) => {
    // This function checks if district b is within district a or districts are identical
    if (a.id === b.id || a.start !== b.start || a.end !== b.end) {
      return false;
    }
    if (booleanEqual(a.boundary, b.boundary)) {
      return true;
    }
    // Calculate which area is larger
    const areaA = a.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
    const areaB = b.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
    if (areaA < areaB) {
      return false;
    }

    /* Check if a point on the smaller polygon is found within the larger polygon.
    Array.every and Array.some are used because multipolygons can contain several polygons */
    return b.boundary.coordinates.every((polygon) => {
      const polygonBPoint = pointOnFeature({ type: 'Polygon', coordinates: polygon });
      return a.boundary.coordinates.some((polygon) => {
        const polygonA = { type: 'Polygon', coordinates: polygon };
        return booleanWithin(polygonBPoint, polygonA);
      });
    });
  };

  const filterFetchData = (data, type) => {
    let filteredData = [];
    data.results.forEach((district) => {
      // Skip if district is already marked as overlaping with another district
      if (filteredData.some(obj => obj.overlaping
        && obj.overlaping.some(item => item.id === district.id))) {
        return;
      }
      const returnItem = district;

      // Combine other districts that are duplicates or within this district
      const overlapingDistricts = data.results.filter(obj => compareBoundaries(district, obj));

      if (overlapingDistricts.length) {
        returnItem.overlaping = overlapingDistricts;
        // Remove overlaping districts from filtered data if already added
        overlapingDistricts.forEach((obj) => {
          filteredData = filteredData.filter(item => item.id !== obj.id);
        });
      }
      filteredData.push(returnItem);
    });

    changeDistrictData(filteredData, type);
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

  const fetchDistrictsByType = async (type) => {
    const options = {
      page: 1,
      page_size: 200,
      type,
      geometry: true,
      unit_include: 'name,location,street_address',
    };
    await districtFetch(options)
      .then((data) => {
        filterFetchData(data, type);
      })
      .catch(() => {
        dispatchFetching({ type: 'remove', value: type });
      });
  };

  const handleOpen = async (item) => {
    if (openItems.includes(item.title)) {
      const items = openItems.filter(i => i !== item.title);
      setOpenItems(items);
    } else {
      setOpenItems([...openItems, item.title]);
    }

    // If no fetched data found, fetch all distirct types within opened category
    if (!districtData.some(district => district.name === item.districts[0])
      && !fetching.includes(item.title)
    ) {
      dispatchFetching({ type: 'add', value: item.title });
      Promise.all(item.districts.map(i => fetchDistrictsByType(i)))
        .then(() => dispatchFetching({ type: 'remove', value: item.title }));
    }
  };

  useEffect(() => {
    setSelectedDistrict(radioValue);
  }, [radioValue]);

  useEffect(() => {
    focusLocalDistrict();
  }, [addressDistrict]);

  useEffect(() => {
    if (selectedAddress) {
      fetchAddressDistricts();
    } else {
      setDistrictAddressData(null);
    }
  }, [selectedAddress]);

  useEffect(() => { // Open previous selections when returning to page
    if (selectedDistrict) {
      const category = dataStructure.find(
        obj => obj.districts.some(district => selectedDistrict.includes(district)),
      );
      handleOpen(category);
      setRadioValue(selectedDistrict);
    }
  }, []);


  const renderAreaTab = () => (
    <AreaTab
      radioValue={radioValue}
      setRadioValue={setRadioValue}
      fetching={fetching}
      districtData={districtData}
      dataStructure={dataStructure}
      openItems={openItems}
      handleOpen={handleOpen}
      setSelectedAddress={setSelectedAddress}
      address={districtAddressData.address}
      navigator={navigator}
    />
  );

  const renderUnitTab = () => (
    <UnitTab
      selectedDistrictData={selectedDistrictData}
      selectedAddress={selectedAddress}
      addressDistrict={addressDistrict}
      formAddressString={formAddressString}
      dataStructure={dataStructure}
    />
  );


  const render = () => {
    const tabs = [
      {
        component: renderAreaTab(),
        title: intl.formatMessage({ id: 'area.tab.selection' }),
      },
      {
        component: renderUnitTab(),
        title: intl.formatMessage({ id: 'area.tab.services' }),
      },
    ];
    return (
      <div>
        <div className={classes.topBar} />
        <TabLists
          data={tabs}
        />
      </div>
    );
  };

  return render();
};

AreaView.propTypes = {
  setSelectedDistrict: PropTypes.func.isRequired,
};

export default AreaView;
