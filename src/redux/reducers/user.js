
const initialState = {
  initialLoad: false,
  locale: 'fi',
  page: 'home',
};

export default (state = initialState, action) => {
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
    default:
      return state;
  }
};
