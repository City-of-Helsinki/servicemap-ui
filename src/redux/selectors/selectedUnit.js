export const getSelectedUnit = store => store.selectedUnit.unit.data;
export const getSelectedUnitEvents = store => store.selectedUnit.events;
export const selectSelectedUnitAccessibilitySentences =
    store => store.selectedUnit.accessibilitySentences;

export default getSelectedUnit;
