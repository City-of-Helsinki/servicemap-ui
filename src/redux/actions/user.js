
export const setLocale = locale => ({
  type: 'SET_LOCALE',
  locale,
});

export const setInitialLoad = () => ({
  type: 'SET_INITIAL_LOAD',
});

export const setPage = page => ({
  type: 'SET_CURRENT_PAGE',
  page,
});

export const setMobile = mobile => ({
  type: 'SET_MOBILE',
  mobile,
});

export const changeLocaleAction = locale => async (dispatch) => {
  dispatch(setLocale(locale));
};

export const actionSetInitialLoad = () => async (dispatch) => {
  dispatch(setInitialLoad());
};

export const setCurrentPage = page => async (dispatch) => {
  dispatch(setPage(page));
};


export default { setLocale, changeLocaleAction, setMobile };
