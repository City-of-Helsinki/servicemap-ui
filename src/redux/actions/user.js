
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

export const setUserPosition = position => ({
  type: 'SET_POSITION',
  position,
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

export const findUserLocation = () => async (dispatch) => {
  const success = (position) => {
    dispatch(setUserPosition(position.coords));
  };

  const error = (err) => {
    console.warn(`GeoLocation error:(${err.code}): ${err.message}`);
  };

  navigator.geolocation.getCurrentPosition(success, error);
};


export default { setLocale, changeLocaleAction };
