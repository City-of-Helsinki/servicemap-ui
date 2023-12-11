export const selectThemeMode = state => state.user.theme;
export const getPage = state => state.user.page;
export const getLocale = state => state.user.locale;
export const selectCustomPosition = state => state.user.customPosition;
export const selectCustomPositionAddress = state => state.user.customPosition.addressData;
export const selectCustomPositionCoordinates = state => state.user.customPosition.coordinates;
export const selectUserPositionCoordinates = state => state.user.position.coordinates;
