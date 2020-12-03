import { unitsFetch } from '../../utils/fetch';

export const setHighlightedDistrict = district => ({
  type: 'SET_DISTRICT_HIGHLIGHT',
  district,
});

export const setSelectedDistrictType = district => ({
  type: 'SET_SELECTED_DISTRICT_TYPE',
  district,
});

export const setDistrictData = data => ({
  type: 'SET_DISTRICT_DATA',
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

export const setSelectedDistrictServices = services => ({
  type: 'SET_SELECTED_DISTRICT_SERVICES',
  services,
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
