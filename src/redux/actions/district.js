import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { resolveParamsForParkingFetch } from '../../utils/parking';
import {
  dataStructure,
  geographicalDistricts,
  groupDistrictData,
  parkingUnitCategoryIds,
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

export const setSelectedParkingAreas = areas => ({
  type: 'SET_SELECTED_PARKING_AREAS',
  areas,
});

export const addSelectedParkingArea = areaID => ({
  type: 'ADD_SELECTED_PARKING_AREA',
  areaID,
});

export const removeSelectedParkingArea = areaID => ({
  type: 'REMOVE_SELECTED_PARKING_AREA',
  areaID,
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

const updateParkingAreas = areas => ({
  type: 'UPDATE_PARKING_AREAS',
  areas,
});

export const setParkingUnits = (parkingUnitCategoryId, units) => ({
  type: 'SET_PARKING_UNITS',
  units,
  parkingUnitCategoryId,
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
    dispatch(startDistrictFetch(type));
    const smAPI = new ServiceMapAPI();
    const boundaries = await smAPI.areaGeometry(type);
    let filteredData = parseDistrictGeometry(boundaries);
    if (period) {
      // Filter with start and end year
      const start = period.slice(0, 4);
      const end = period.slice(-4);
      const yearFilteredData = filteredData.filter((item) => {
        if (item.extra?.schoolyear) {
          if (item.extra?.schoolyear === period) {
            return true;
          }
          return false;
        }
        if (item.start.slice(0, 4) === start && item.end.slice(0, 4) === end) {
          return true;
        }
        return false;
      });
      filteredData = yearFilteredData;
    }
    dispatch(updateDistrictData(type, filteredData, period));
    dispatch(endDistrictFetch(type));
  }
);

export const fetchDistricts = (selected, single, period) => (
  async (dispatch) => {
    const categories = single
      ? selected
      : dataStructure.map(obj => obj.districts.map(item => item.id)).flat().join(',');

    dispatch(startDistrictFetch(single ? selected : 'all'));
    const smAPI = new ServiceMapAPI();
    const areas = await smAPI.areas(categories);
    const groupedData = groupDistrictData(areas);
    dispatch(setDistrictData(groupedData));
    dispatch(endDistrictFetch(single ? selected : 'all'));
    if (selected) dispatch(fetchDistrictGeometry(selected, period));
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
      const units = await smAPI.areaUnits(nodeID);
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

export const fetchParkingAreaGeometry = areaId => (
  async (dispatch) => {
    const type = 'parking_area';
    const options = resolveParamsForParkingFetch(areaId);

    dispatch(startDistrictFetch(areaId));
    const smAPI = new ServiceMapAPI();
    const areas = await smAPI.areaGeometry(type, options);
    dispatch(endDistrictFetch(areaId));
    dispatch(updateParkingAreas(areas));
  }
);

export const fetchParkingUnits = (parkingCategoryId) => (
  async (dispatch) => {
    if (!parkingUnitCategoryIds.find(id => id === parkingCategoryId)) {
      throw new Error(`Parking category ${parkingCategoryId} is not supported.`);
    }
    const municipality = parkingCategoryId.split('-')[0];
    const id = parkingCategoryId.split('-')[1];
    const districtType = `parkingUnits-${parkingCategoryId}`;
    dispatch(startDistrictFetch(districtType));
    const smAPI = new ServiceMapAPI();
    const units = await smAPI.serviceNodeSearch('ServiceTree', id, { language: 'fi', municipality });
    units.forEach((item) => {
      item.object_type = 'unit';
    });
    dispatch(setParkingUnits(parkingCategoryId, units));
    dispatch(endDistrictFetch(districtType));
  }
);

export const fetchParkingGarages = () => fetchParkingUnits('helsinki-531');

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
