import LocalStorageUtility from '../../utils/localStorage';
import fetchAddress from '../../views/MapView/utils/fetchAddress';

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

const setTheme = theme => ({
  type: 'SET_THEME',
  theme,
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

export const changeTheme = theme => async (dispatch) => {
  LocalStorageUtility.saveItem('theme', theme);
  dispatch(setTheme(theme));
};

export const findUserLocation = () => async (dispatch) => {
  const success = (position) => {
    if (position.coords.accuracy < 10000) {
      fetchAddress({ lat: position.coords.latitude, lng: position.coords.longitude })
        .then((data) => {
          dispatch(setUserPosition({
            coordinates: position.coords,
            allowed: true,
            addressData: data,
          }));
        });
    } else {
      console.warn(`Position accuracy: ${position.coords.accuracy}. Max accuracy: 10000`);
      dispatch(setUserPosition({ coordinates: null, allowed: true, addressData: null }));
    }
  };

  const error = (err) => {
    console.warn(`GeoLocation error:(${err.code}): ${err.message}`);
    if (err.code === 1) {
      dispatch(setUserPosition({ coordinates: null, allowed: false, addressData: null }));
    } else {
      dispatch(setUserPosition({ coordinates: null, allowed: true, addressData: null }));
    }
  };

  navigator.geolocation.getCurrentPosition(success, error);
};


export default { setLocale, changeLocaleAction };
