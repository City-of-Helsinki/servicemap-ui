export const breadcrumbPush = obj => async (dispatch) => {
  dispatch({
    type: 'PUSH_ENTRY',
    entry: obj,
  });
};

export const breadcrumbPop = () => async (dispatch) => {
  dispatch({
    type: 'POP_ENTRY',
  });
};

export const breadcrumbReplace = obj => async (dispatch) => {
  dispatch({
    type: 'REPLACE_ENTRY',
    entry: obj,
  });
}
;