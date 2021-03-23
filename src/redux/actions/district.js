import { districtFetch, unitsFetch } from '../../utils/fetch';
import { geographicalDistricts, groupDistrictData, parseDistrictGeometry } from '../../views/AreaView/utils/districtDataHelper';

export const setHighlightedDistrict = district => ({
  type: 'SET_DISTRICT_HIGHLIGHT',
  district,
});

export const setSelectedDistrictType = district => ({
  type: 'SET_SELECTED_DISTRICT_TYPE',
  district,
});

const setDistrictData = data => ({
  type: 'SET_DISTRICT_DATA',
  data,
});

const updateDistrictData = (type, data) => ({
  type: 'UPDATE_DISTRICT_DATA',
  districtType: type,
  data,
});

export const setDistrictAddressData = data => ({
  type: 'SET_DISTRICT_ADDRESS_DATA',
  data,
});

export const setSelectedSubdistricts = districts => ({
  type: 'SET_SELECTED_SUBDISTRICTS',
  districts,
});

export const addSelectedDistrictService = district => ({
  type: 'ADD_SELECTED_DISTRICT_SERVICE',
  district,
});

export const removeSelectedDistrictService = data => ({
  type: 'REMOVE_SELECTED_DISTRICT_SERVICE',
  data,
});

export const setSelectedDistrictServices = services => ({
  type: 'SET_SELECTED_DISTRICT_SERVICES',
  services,
});

const addOpenItem = item => ({
  type: 'ADD_OPEN_ITEM',
  item,
});

const removeOpenItem = item => ({
  type: 'REMOVE_OPEN_ITEM',
  item,
});

export const setMapState = object => ({
  type: 'SET_MAP_STATE',
  object,
});

const startUnitFetch = node => ({
  type: 'START_UNIT_FETCH',
  node,
});

const endUnitFetch = data => ({
  type: 'END_UNIT_FETCH',
  node: data.nodeID,
  units: data.units,
});

const startDistrictFetch = districtType => ({
  type: 'START_DISTRICT_FETCH',
  districtType,
});

const endDistrictFetch = districtType => ({
  type: 'END_DISTRICT_FETCH',
  districtType,
});


export const fetchDistrictGeometry = type => (
  async (dispatch) => {
    const options = {
      page: 1,
      page_size: 500,
      type,
      geometry: true,
      unit_include: 'name,location,street_address,address_zip,municipality',
    };
    const onStart = () => {
      dispatch(startDistrictFetch(type));
    };
    const onNext = () => {};
    const onSuccess = (results) => {
      const filteredData = parseDistrictGeometry(results);
      dispatch(updateDistrictData(type, filteredData));
      dispatch(endDistrictFetch(type));
    };
    districtFetch(options, onStart, onSuccess, null, onNext);
  }
);

export const fetchAllDistricts = selected => (
  async (dispatch) => {
    const options = {
      page: 1,
      page_size: 500,
      type: 'health_station_district,maternity_clinic_district,lower_comprehensive_school_district_fi,lower_comprehensive_school_district_sv,upper_comprehensive_school_district_fi,upper_comprehensive_school_district_sv,preschool_education_fi,preschool_education_sv,rescue_area,rescue_district,rescue_sub_district,nature_reserve,neighborhood,postcode_area',
      geometry: false,
    };
    const onStart = () => dispatch(startDistrictFetch('all'));
    const onNext = () => {};
    const onSuccess = (result) => {
      const groupedData = groupDistrictData(result);
      dispatch(setDistrictData(groupedData));
      dispatch(endDistrictFetch('all'));
      if (selected) dispatch(fetchDistrictGeometry(selected));
    };
    districtFetch(options, onStart, onSuccess, null, onNext);
  }
);

export const fetchDistrictUnitList = nodeID => (
  async (dispatch) => {
    dispatch(startUnitFetch(nodeID));
    const options = {
      page: 1,
      page_size: 1000,
      division: nodeID,
    };
    try {
      const data = await unitsFetch(options);
      const units = data.results;
      units.forEach((unit) => {
        unit.object_type = 'unit';
        unit.division_id = nodeID;
      });
      dispatch(endUnitFetch({ nodeID, units }));
    } catch (e) {
      console.warn(e);
      dispatch(endUnitFetch({ nodeID, units: [] }));
    }
  }
);

export const handleOpenItems = id => (
  (dispatch, getState) => {
    const { openItems } = getState().districts;
    if (openItems.includes(id)) {
      dispatch(removeOpenItem(id));
    } else {
      dispatch(addOpenItem(id));
    }
  }
);

export const handleOpenGeographicalCategory = id => (
  (dispatch, getState) => {
    const { openItems } = getState().districts;
    const stateCategory = openItems.find(item => geographicalDistricts.includes(item));
    if (stateCategory) {
      dispatch(removeOpenItem(stateCategory));
    }
    if (id) {
      dispatch(addOpenItem(id));
    }
  }
);