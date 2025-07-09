export const initialState = {
  initialLoad: false,
  locale: 'fi',
  page: 'home',
  theme: 'default',
  position: {
    coordinates: null,
    allowed: false,
    addressData: null,
  },
  customPosition: {
    coordinates: null,
    addressData: null,
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.locale,
      };
    case 'SET_INITIAL_LOAD':
      return {
        ...state,
        initialLoad: true,
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        page: action.page,
      };
    case 'SET_POSITION':
      return {
        ...state,
        position: action.position,
      };
    case 'SET_CUSTOM_POSITION':
      return {
        ...state,
        customPosition: action.customPosition,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
};

export default userReducer;
