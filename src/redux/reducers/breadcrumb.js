const initialState = [];

const breadcrumbReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PUSH_ENTRY':
      return [...state, action.entry];
    case 'POP_ENTRY': {
      const newEntries = Array.from(state);
      newEntries.pop();
      return newEntries;
    }
    case 'REPLACE_ENTRY': {
      const newEntries = Array.from(state);
      newEntries.pop();
      return [...newEntries, action.entry];
    }
    default:
      return state;
  }
};

export default breadcrumbReducer;
