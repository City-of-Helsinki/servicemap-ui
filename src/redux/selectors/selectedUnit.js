export const getSelectedUnit = (state) => state.selectedUnit.unit.data;
export const selectSelectedUnitIsFetching = (state) =>
  state.selectedUnit.unit.isFetching;
export const getSelectedUnitEvents = (state) => state.selectedUnit.events;
export const selectHearingMaps = (state) => state.selectedUnit.hearingMaps;
export const selectHearingMapsData = (state) =>
  state.selectedUnit.hearingMaps.data;
export const selectReservations = (state) => state.selectedUnit.reservations;
export const selectEvents = (state) => state.selectedUnit.events;
export const selectSelectedUnitAccessibilitySentences = (state) =>
  state.selectedUnit.accessibilitySentences;
export const selectSelectedUnitAccessibilitySentencesData = (state) =>
  state.selectedUnit.accessibilitySentences.data;
