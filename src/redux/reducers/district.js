import { resolveParkingAreaId } from '../../utils/parking';
import { parkingUnitCategoryIds } from '../../views/AreaView/utils/districtDataHelper';

const parkingUnitsMap = {};
parkingUnitCategoryIds.forEach((categoryId) => {
  parkingUnitsMap[categoryId] = [];
});
const initialState = {
  highlitedDistrict: null,
  selectedDistrictType: null,
  districtData: [],
  districtsFetching: [],
  unitFetch: {
    max: 0,
    count: 0,
    isFetching: false,
    nodesFetching: [],
  },
  parkingAreasMap: {},
  parkingUnitsMap,
  subdistrictUnits: [],
  selectedSubdistricts: [],
  selectedDistrictServices: [],
  selectedParkingAreaIds: [],
  openItems: [],
  mapState: null,
  districtAddressData: {
    address: null,
    districts: [],
  },
};
const districtReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DISTRICT_HIGHLIGHT':
      if (!action.district) {
        return {
          ...state,
          highlitedDistrict: null,
        };
      }
      return {
        ...state,
        highlitedDistrict: action.district,
      };

    case 'SET_SELECTED_DISTRICT_TYPE':
      return {
        ...state,
        selectedDistrictType: action.district || null,
      };

    case 'SET_DISTRICT_DATA':
      return {
        ...state,
        districtData: action.data,
      };

    case 'UPDATE_DISTRICT_DATA':
      if (!state.districtData.length) {
        return {
          ...state,
          districtData: action.data,
        };
      }
      if (action.period) {
        return {
          ...state,
          districtData: state.districtData.map((obj) =>
            obj.name === action.districtType && obj.period === action.period
              ? { ...obj, data: action.data }
              : obj
          ),
        };
      }
      return {
        ...state,
        districtData: state.districtData.map((obj) =>
          obj.name === action.districtType ? { ...obj, data: action.data } : obj
        ),
      };

    case 'SET_DISTRICT_ADDRESS_DATA':
      if (!action.data) {
        return {
          ...state,
          districtAddressData: initialState.districtAddressData,
        };
      }
      return {
        ...state,
        districtAddressData: action.data,
      };

    case 'SET_SELECTED_SUBDISTRICTS':
      return {
        ...state,
        selectedSubdistricts: action.districts,
      };

    case 'ADD_SELECTED_DISTRICT_SERVICE':
      return {
        ...state,
        selectedDistrictServices: [
          ...state.selectedDistrictServices,
          action.district,
        ],
      };

    case 'REMOVE_SELECTED_DISTRICT_SERVICE':
      return {
        ...state,
        selectedDistrictServices: [
          ...state.selectedDistrictServices.filter((item) => {
            if (Array.isArray(action.data)) {
              return !action.data.includes(item);
            }
            return item !== action.data;
          }),
        ],
      };

    case 'SET_SELECTED_DISTRICT_SERVICES':
      return {
        ...state,
        selectedDistrictServices: action.services,
      };

    case 'SET_SELECTED_PARKING_AREAS':
      return {
        ...state,
        selectedParkingAreaIds: action.areas,
      };

    case 'ADD_SELECTED_PARKING_AREA':
      return {
        ...state,
        selectedParkingAreaIds: [
          ...state.selectedParkingAreaIds,
          action.areaID,
        ],
      };

    case 'REMOVE_SELECTED_PARKING_AREA':
      return {
        ...state,
        selectedParkingAreaIds: [
          ...state.selectedParkingAreaIds.filter(
            (item) => item !== action.areaID
          ),
        ],
      };

    case 'ADD_OPEN_ITEM':
      return {
        ...state,
        openItems: [...state.openItems, action.item],
      };

    case 'REMOVE_OPEN_ITEM':
      return {
        ...state,
        openItems: [...state.openItems.filter((id) => id !== action.item)],
      };

    case 'SET_MAP_STATE':
      return {
        ...state,
        mapState: action.object,
      };

    case 'START_UNIT_FETCH':
      return {
        ...state,
        unitFetch: {
          ...state.unitFetch,
          nodesFetching: [...state.unitFetch.nodesFetching, action.node],
          isFetching: true,
        },
      };

    case 'UPDATE_FETCH_PROGRESS':
      return {
        ...state,
        unitFetch: {
          ...state.unitFetch,
          count: action.count
            ? state.unitFetch.count + action.count
            : state.unitFetch.count,
          max: action.max
            ? state.unitFetch.max + action.max
            : state.unitFetch.max,
        },
      };

    case 'END_UNIT_FETCH':
      return {
        ...state,
        subdistrictUnits: [...state.subdistrictUnits, ...action.units],
        unitFetch: {
          ...state.unitFetch,
          nodesFetching: [
            ...state.unitFetch.nodesFetching.filter(
              (item) => item !== action.node
            ),
          ],
          isFetching: !action.isLastFetch,
          max: action.isLastFetch ? 0 : state.unitFetch.max,
          count: action.isLastFetch ? 0 : state.unitFetch.count,
        },
      };

    case 'START_DISTRICT_FETCH':
      return {
        ...state,
        districtsFetching: state.districtsFetching.includes(action.districtType)
          ? state.districtsFetching
          : [...state.districtsFetching, action.districtType],
      };

    case 'END_DISTRICT_FETCH':
      return {
        ...state,
        districtsFetching: [
          ...state.districtsFetching.filter(
            (item) => item !== action.districtType
          ),
        ],
      };

    case 'UPDATE_PARKING_AREAS': {
      // Refactored to store parking areas as an object where the key
      // is resolveParkingAreaId(area) and the value is an array of areas
      const newParkingAreasMap = { ...state.parkingAreasMap };
      (action.areas ?? []).forEach((area) => {
        const key = resolveParkingAreaId(area);
        if (key) {
          if (newParkingAreasMap[key]) {
            // Avoid duplicates if the same area already exists
            const exists = newParkingAreasMap[key].some(
              ({ id }) => id === area.id
            );
            if (!exists) {
              newParkingAreasMap[key].push(area);
            }
          } else {
            newParkingAreasMap[key] = [area];
          }
        }
      });
      return {
        ...state,
        parkingAreasMap: newParkingAreasMap,
      };
    }

    case 'SET_PARKING_UNITS':
      return {
        ...state,
        parkingUnitsMap: {
          ...state.parkingUnitsMap,
          [action.parkingUnitCategoryId]: action.units,
        },
      };

    default:
      return state;
  }
};

export default districtReducer;
