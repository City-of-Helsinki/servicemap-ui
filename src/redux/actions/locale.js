
export const setLocale = locale => ({
  type: 'SET_LOCALE',
  locale,
});

export const changeLocaleAction = locale => async (dispatch) => {
  dispatch(setLocale(locale));
};

export default { setLocale, changeLocaleAction };
