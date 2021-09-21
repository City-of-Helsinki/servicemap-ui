import { districtFetch } from '../../utils/fetch';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import {
  dataStructure,
  geographicalDistricts,
  groupDistrictData,
  parseDistrictGeometry,
} from '../../views/AreaView/utils/districtDataHelper';

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

const updateDistrictData = (type, data, period) => ({
  type: 'UPDATE_DISTRICT_DATA',
  districtType: type,
  period,
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

const updateFetchProggress = data => ({
  type: 'UPDATE_FETCH_PROGRESS',
  count: data.count,
  max: data.max,
});

const endUnitFetch = data => ({
  type: 'END_UNIT_FETCH',
  node: data.nodeID,
  units: data.units,
  isLastFetch: data.isLastFetch,
});

const startDistrictFetch = districtType => ({
  type: 'START_DISTRICT_FETCH',
  districtType,
});

const endDistrictFetch = districtType => ({
  type: 'END_DISTRICT_FETCH',
  districtType,
});


export const fetchDistrictGeometry = (type, period) => (
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
      let filteredData = parseDistrictGeometry(results);
      if (period) {
        // Filter with start and end year
        const start = period.slice(0, 4);
        const end = period.slice(-4);
        const yearFilteredData = filteredData.filter(item => (
          item.start.slice(0, 4) === start && item.end.slice(0, 4) === end
        ));
        filteredData = yearFilteredData;
      }
      dispatch(updateDistrictData(type, filteredData, period));
      dispatch(endDistrictFetch(type));
    };
    districtFetch(options, onStart, onSuccess, null, onNext);
  }
);

export const fetchAllDistricts = selected => (
  async (dispatch) => {
    const categories = dataStructure.map(obj => obj.districts).flat().join(',');
    const options = {
      page: 1,
      page_size: 500,
      type: categories,
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
  async (dispatch, getState) => {
    try {
      const progressUpdate = (count, max) => {
        if (!count) { // Start progress bar by setting max value
          dispatch(updateFetchProggress({ max }));
        } else { // Update progress
          dispatch(updateFetchProggress({ count }));
        }
      };
      const smAPI = new ServiceMapAPI();
      smAPI.setOnProgressUpdate(progressUpdate);
      dispatch(startUnitFetch(nodeID));
      const units = await smAPI.areaUnits(nodeID, progressUpdate);
      units.forEach((unit) => {
        unit.object_type = 'unit';
        unit.division_id = nodeID;
      });

      // If multiple districts fetching at the same time, last result needs to end search
      const { nodesFetching } = getState().districts.unitFetch;
      let isLastFetch;
      if (nodesFetching.length === 1) isLastFetch = true;

      dispatch(endUnitFetch({ nodeID, units, isLastFetch }));
    } catch (e) {
      console.warn(e);
      dispatch(endUnitFetch({ nodeID, units: [], isLastFetch: true }));
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
