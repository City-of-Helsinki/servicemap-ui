export default (state = null, action) => {
  switch (action.type) {
    case 'SET_TREE_STATE':
      return action.treeState;
    default:
      return state;
  }
};
