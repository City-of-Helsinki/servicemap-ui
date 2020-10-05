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
import { districtFetch, unitsFetch } from '../../utils/fetch';


const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, action.value];
    case 'remove':
      return state.filter(item => item !== action.value);
    default:
      throw new Error('District fetch failed');
  }
};

const AreaView = ({
  setSelectedDistrictType,
  setSelectedSubdistricts,
  setSelectedDistrictServices,
  setDistrictData,
  setDistrictAddressData,
  addSubdistrictUnits,
  districtData,
  districtAddressData,
  selectedDistrictType,
  selectedDistrictData,
  addressDistrict,
  subdistrictUnits,
  filteredSubdistrictUnits,
  selectedSubdistricts,
  selectedDistrictServices,
  map,
  getLocaleText,
  navigator,
  classes,
  intl,
}) => {
  const dataStructure = [ // Categorized district data structure
    {
      id: 'health',
      title: intl.formatMessage({ id: 'area.list.health' }),
      districts: [
        'health_station_district',
        'maternity_clinic_district',
      ],
    },
    {
      id: 'education',
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
      id: 'preschool',
      title: intl.formatMessage({ id: 'area.list.preschool' }),
      districts: [
        'preschool_education_fi',
        'preschool_education_sv',
      ],
    },
    {
      id: 'geographical',
      title: intl.formatMessage({ id: 'area.list.geographical' }),
      districts: [
        'neighborhood',
        'postcode_area',
      ],
    },
    {
      id: 'protection',
      title: intl.formatMessage({ id: 'area.list.protection' }),
      districts: [
        'rescue_area',
        'rescue_district',
        'rescue_sub_district',
      ],
    },
  ];

  // State
  const [districtRadioValue, setDistrictRadioValue] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [openItems, setOpenItems] = useState([]); // List items that are expanded
  const [fetching, dispatchFetching] = useReducer(fetchReducer, []); // Fetch state

  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

  const focusMapToDistrict = (district) => {
    focusDistrict(map.leafletElement, district.boundary.coordinates);
  };


  const changeDistrictData = (data, type, category) => {
    // Collect different periods from district data
    const dateArray = [];
    data.forEach((item) => {
      if (item.start && item.end) {
        const period = `${item.start}-${item.end}`;
        if (period.includes('2019')) {
          // FIXME: remove temporary solution to hide older school years once period data is updated
          return;
        }
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
          id: `${type}${dateArray[i]}`, data, date: dateArray[i], name: type, category,
        });
      });
    } else {
      setDistrictData({
        id: type, data, name: type, category,
      });
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

  const filterFetchData = (data, type, category) => {
    let filteredData = [];
    data.results.forEach((district) => {
      // Skip if district is already marked as overlaping with another district
      if (filteredData.some(obj => obj.overlaping
        && obj.overlaping.some(item => item.id === district.id))) {
        return;
      }
      const returnItem = district;
      returnItem.category = category;

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

    // console.log(filteredData);

    // const groupedData = filteredData.reduce((acc, cur) => {
    //   const duplicate = acc.find(list => list[0].municipality === cur.municipality);
    //   if (duplicate) {
    //     duplicate.push(cur);
    //   } else {
    //     acc.push([cur]);
    //   }
    //   return acc;
    // }, []);

    // console.log(groupedData);

    changeDistrictData(filteredData, type, category);
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

  const fetchDistrictsByType = async (type, category) => {
    const options = {
      page: 1,
      page_size: 200,
      type,
      geometry: true,
      unit_include: 'name,location,street_address',
    };
    await districtFetch(options)
      .then((data) => {
        filterFetchData(data, type, category);
      })
      .catch(() => {
        dispatchFetching({ type: 'remove', value: type });
      });
  };

  const fetchDistrictUnitList = async (divisionID) => {
    const options = {
      page: 1,
      page_size: 1000,
      division: divisionID,
    };
    await unitsFetch(options)
      .then((data) => {
        const units = data.results;
        units.forEach((unit) => {
          unit.object_type = 'unit';
          unit.division_id = divisionID;
        });
        addSubdistrictUnits(data.results);
      });
  };

  const handleOpen = async (item) => {
    if (openItems.includes(item.id)) {
      const items = openItems.filter(i => i !== item.id);
      setOpenItems(items);
    } else {
      setOpenItems([...openItems, item.id]);
    }

    // If no fetched data found, fetch all distirct types within opened category
    if (!districtData.some(district => item.districts.includes(district.name))
      && !fetching.includes(item.title)
    ) {
      dispatchFetching({ type: 'add', value: item.title });
      Promise.all(item.districts.map(i => fetchDistrictsByType(i, item.id)))
        .then(() => dispatchFetching({ type: 'remove', value: item.title }));
    }
  };

  useEffect(() => {
    setSelectedDistrictType(districtRadioValue);
  }, [districtRadioValue]);


  useEffect(() => {
    // Focus map to local district
    if (selectedAddress && addressDistrict) {
      const district = selectedDistrictData.find(obj => obj.id === addressDistrict);
      focusMapToDistrict(district);
    }
  }, [addressDistrict]);

  useEffect(() => {
    if (selectedAddress) {
      fetchAddressDistricts();
    } else {
      setDistrictAddressData(null);
    }
  }, [selectedAddress]);

  useEffect(() => {
    selectedSubdistricts.forEach((district) => {
      if (!subdistrictUnits.some(unit => unit.division_id === district.ocd_id)) {
        fetchDistrictUnitList(district.ocd_id);
      }
    });
  }, [selectedSubdistricts]);

  useEffect(() => {
    setDistrictRadioValue(selectedDistrictType);
  }, [selectedDistrictType]);

  useEffect(() => {
    // Open and set previous selections when returning to page
    if (selectedDistrictType) {
      const category = dataStructure.find(
        obj => obj.districts.some(district => selectedDistrictType.includes(district)),
      );
      handleOpen(category);
      setSelectedDistrictType(selectedDistrictType);
    }
  }, []);


  const renderAreaTab = () => (
    <AreaTab
      districtRadioValue={districtRadioValue}
      selectedSubdistricts={selectedSubdistricts}
      setDistrictRadioValue={setDistrictRadioValue}
      setSelectedSubdistricts={setSelectedSubdistricts}
      setSelectedDistrictServices={setSelectedDistrictServices}
      fetching={fetching}
      districtData={districtData}
      selectedDistrictData={selectedDistrictData}
      openItems={openItems}
      handleOpen={handleOpen}
      dataStructure={dataStructure}
      setSelectedAddress={setSelectedAddress}
      address={districtAddressData.address}
      navigator={navigator}
      getLocaleText={getLocaleText}
    />
  );

  const renderUnitTab = () => (
    <UnitTab
      selectedDistrictData={selectedDistrictData}
      selectedAddress={selectedAddress}
      selectedSubdistricts={selectedSubdistricts}
      setSelectedDistrictServices={setSelectedDistrictServices}
      filteredSubdistrictUnits={filteredSubdistrictUnits}
      selectedDistrictServices={selectedDistrictServices}
      addressDistrict={addressDistrict}
      formAddressString={formAddressString}
      getLocaleText={getLocaleText}
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
  setSelectedDistrictType: PropTypes.func.isRequired,
};

export default AreaView;
