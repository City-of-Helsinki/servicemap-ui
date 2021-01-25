import React, {
  useState, useEffect, useReducer, useRef,
} from 'react';
import PropTypes from 'prop-types';
import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';
import area from '@turf/area';
import { useLocation } from 'react-router-dom';
import { focusDistrict, focusDistricts } from '../MapView/utils/mapActions';
import TabLists from '../../components/TabLists';
import UnitTab from './components/UnitTab';
import { parseSearchParams, uppercaseFirst } from '../../utils';
import AreaTab from './components/AreaTab';
import { districtFetch } from '../../utils/fetch';
import fetchAddress from '../MapView/utils/fetchAddress';
import TitleBar from '../../components/TitleBar';


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
  setAreaViewState,
  fetchDistrictUnitList,
  unitsFetching,
  districtData,
  districtAddressData,
  selectedDistrictType,
  selectedDistrictData,
  addressDistrict,
  subdistrictUnits,
  filteredSubdistrictUnits,
  selectedSubdistricts,
  selectedDistrictServices,
  areaViewState,
  map,
  getLocaleText,
  navigator,
  embed,
  intl,
}) => {
  if (!map || !map.leafletElement) {
    return null;
  }

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
    {
      id: 'nature',
      title: intl.formatMessage({ id: 'area.list.natureConservation' }),
      districts: [
        'nature_reserve',
      ],
    },
  ];

  const location = useLocation();
  const accordionStates = useRef(null);

  // State
  const [districtRadioValue, setDistrictRadioValue] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(districtAddressData.address);
  const [openItems, setOpenItems] = useState(areaViewState ? areaViewState.openItems : []);
  const [openServices, setOpenServices] = useState(areaViewState ? areaViewState.openServices : []);
  // Pending request to focus map to districts. Executed once district data is loaded
  const [focusTo, setFocusTo] = useState(null);
  // Fetch state
  const [ditsrictsFetching, dispatchDistrictsFetching] = useReducer(fetchReducer, []);

  // State that will be saved to redux on unmount
  accordionStates.current = {
    openItems,
    openServices,
  };


  const formAddressString = address => (address
    ? `${getLocaleText(address.street.name)} ${address.number}${address.number_end ? address.number_end : ''}${address.letter ? address.letter : ''}, ${uppercaseFirst(address.street.municipality)}`
    : '');

  const focusMapToDistrict = (district) => {
    focusDistrict(map.leafletElement, district.boundary.coordinates);
  };


  const changeDistrictData = (data, type, category) => {
    // Group data by periods (used in school districts)
    const groupedData = data.reduce((acc, cur) => {
      if (cur.start && cur.start.includes(2019)) {
        // FIXME: remove temporary solution to hide older school years once period data is updated
        return acc;
      }
      const duplicate = acc.find(
        list => list[0].start === cur.start && list[0].end === cur.end,
      );
      if (duplicate) {
        duplicate.push(cur);
      } else {
        acc.push([cur]);
      }
      return acc;
    }, []);

    groupedData.sort(
      (a, b) => new Date(a[0].start).getFullYear() - new Date(b[0].start).getFullYear(),
    );

    groupedData.forEach((data) => {
      const { start, end } = data[0];
      const period = start && end
        ? `${new Date(start).getFullYear()}-${new Date(end).getFullYear()}`
        : null;

      setDistrictData({
        id: `${type}${period || ''}`,
        data,
        name: type,
        period,
        category,
      });
    });
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
    data.forEach((district) => {
      // Skip if district is already marked as overlaping with another district
      if (filteredData.some(obj => obj.overlaping
        && obj.overlaping.some(item => item.id === district.id))) {
        return;
      }
      const returnItem = district;
      returnItem.category = category;

      // Combine other districts that are duplicates or within this district
      const overlapingDistricts = data.filter(obj => compareBoundaries(district, obj));

      if (overlapingDistricts.length) {
        returnItem.overlaping = overlapingDistricts;
        // Remove overlaping districts from filtered data if already added
        overlapingDistricts.forEach((obj) => {
          filteredData = filteredData.filter(item => item.id !== obj.id);
        });
      }
      filteredData.push(returnItem);
    });

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

  const fetchDistrictsByType = async (type, id, category) => {
    const options = {
      page: 1,
      page_size: 500,
      type,
      geometry: true,
      unit_include: 'name,location,street_address,address_zip,municipality',
    };
    return districtFetch(options)
      .then((data) => {
        const filteredData = data.results.filter(i => i.boundary && i.boundary.coordinates);
        return { data: filteredData, type, category };
      })
      .catch(() => {
        dispatchDistrictsFetching({ type: 'remove', value: id });
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
      && !ditsrictsFetching.includes(item.title)
    ) {
      dispatchDistrictsFetching({ type: 'add', value: item.title });
      await Promise.all(item.districts.map(i => fetchDistrictsByType(i, item.title, item.id)))
        .then((results) => {
          dispatchDistrictsFetching({ type: 'remove', value: item.title });
          results.forEach(result => filterFetchData(result.data, result.type, result.category));
        });
    }
  };

  useEffect(() => () => {
    // Save accordion state on unmount
    setAreaViewState(accordionStates.current);
  }, []);

  useEffect(() => {
    if (selectedDistrictType !== districtRadioValue) {
      setSelectedDistrictType(districtRadioValue);
    }
  }, [districtRadioValue]);


  useEffect(() => {
    // Focus map to local district
    if (selectedAddress && addressDistrict) {
      const district = selectedDistrictData.find(obj => obj.id === addressDistrict);
      focusMapToDistrict(district);
      // Add local geographical district
      const selectedCategory = dataStructure.find(i => i.districts.includes(selectedDistrictType));
      if (selectedCategory?.id === 'geographical') {
        setSelectedSubdistricts([...selectedSubdistricts, district.ocd_id]);
      }
    }
  }, [addressDistrict, map]);


  useEffect(() => {
    if (selectedAddress) {
      fetchAddressDistricts();
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
    setDistrictRadioValue(selectedDistrictType);
  }, [selectedDistrictType]);


  useEffect(() => {
    // If pending district focus, focus to districts when distitct data is loaded
    if (focusTo && selectedDistrictData.length) {
      if (focusTo === 'districts') {
        if (selectedDistrictData) {
          setFocusTo(null);
          focusDistricts(map.leafletElement, selectedDistrictData);
        }
      } else if (focusTo === 'subdistricts') {
        if (selectedDistrictData) {
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
    // Apply url parameters if first render
    const searchParams = parseSearchParams(location.search);
    if (Object.keys(searchParams).length) {
      if (searchParams.selected) {
        if (!districtData.length) {
          // Open correct category and fetch data based on url parameters
          const paramValue = searchParams.selected.split(/([0-9]+)/)[0];
          const category = dataStructure.find(
            data => data.districts.includes(paramValue),
          );
          if (embed) {
            fetchDistrictsByType(paramValue, null, category.id)
              .then(result => filterFetchData(result.data, result.type, result.category));
          } else {
            handleOpen(category);
          }
          // Set selected district type from url paramters
          setSelectedDistrictType(searchParams.selected);
          if (searchParams.districts) {
            // Set selected geographical districts from url parameters
            setSelectedSubdistricts(searchParams.districts.split(','));
            setFocusTo('subdistricts');
          } else {
            setFocusTo('districts');
          }
        } else {
          setSelectedDistrictType(searchParams.selected);
        }
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
    }

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
      ditsrictsFetching={ditsrictsFetching}
      unitsFetching={!!unitsFetching.length}
      districtData={districtData}
      selectedDistrictData={selectedDistrictData}
      openItems={openItems}
      handleOpen={handleOpen}
      dataStructure={dataStructure}
      setSelectedAddress={setSelectedAddress}
      address={districtAddressData.address}
      navigator={navigator}
      getLocaleText={getLocaleText}
      map={map}
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
    if (!embed) {
      return (
        <div>
          <TitleBar
            title={intl.formatMessage({ id: 'general.pageTitles.area' })}
            titleComponent="p"
            backButton
          />
          <TabLists
            data={tabs}
          />
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
