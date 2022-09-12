import { createSelector } from "reselect";
import dataVisualization from "../../utils/dataVisualization";

export const getStatisticalDistrictSelection = state => state.statisticalDistrict.selection;
export const getAreaSelections = state => state.statisticalDistrict.areaSelections;
const getData = state => state.statisticalDistrict.data;

const getSelectedValue = (item, section, forecast) => {
  try {
    return item?.data[dataVisualization.getYearBasedCategory(forecast)][section];
  } catch (e) {
    return false;
  }
};

const calculateScaleAdjustedProportion = (proportion, scales) => {
  if (isNaN(proportion) || isNaN(scales.min) || isNaN(scales.max)) {
    return 0;
  }
  // Adjust proportions between 0-0.8
  return 0.8 * (proportion - scales.min) / (scales.max - scales.min);
}

export const getSelectedStatisticalDistricts = createSelector(
  [getStatisticalDistrictSelection, getData],
  (selection, data) => {
    console.log('running getSelectedStatisticalDistricts')
    let selectedDivisions = [];
    const { forecast, proportionScales, section } = selection;

    if (typeof section === 'string' && section.length > 0 && data.length > 0) {
      selectedDivisions = data.filter(item => {
        return !!getSelectedValue(item, section, forecast);
      }).map(d => {
        const { value, proportion } = getSelectedValue(d, section, forecast);
        const selectedProportion = dataVisualization.isTotal(section) ? value : proportion;
        const selectedScaleAdjustedProportion = calculateScaleAdjustedProportion(selectedProportion, proportionScales);
        return {
          ...d,
          selectedProportion,
          selectedScaleAdjustedProportion,
        };
      });
    }

    return selectedDivisions;
  }
)

