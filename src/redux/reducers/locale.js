// TODO: better state handling of locale
const locale = (state = 'fi', action) => {
  switch (action.type) {
    case 'SET_LOCALE':
      return action.locale;
    default:
      return state;
  }
};

export default locale;
