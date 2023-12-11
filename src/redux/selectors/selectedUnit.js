export const getSelectedUnit = store => store.selectedUnit.unit.data;
export const selectSelectedUnitIsFetching = store => store.selectedUnit.unit.isFetching;
export const getSelectedUnitEvents = store => store.selectedUnit.events;
export const selectHearingMaps = store => store.selectedUnit.hearingMaps;
export const selectReservations = store => store.selectedUnit.reservations;
export const selectEvents = store => store.selectedUnit.events;
export const selectSelectedUnitAccessibilitySentences =
    store => store.selectedUnit.accessibilitySentences;
