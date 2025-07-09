export const breadcrumbPush = (obj) => async (dispatch) => {
  dispatch({
    type: 'PUSH_ENTRY',
    entry: obj,
  });
};

export const breadcrumbPop = () => async (dispatch, getState) => {
  // Attempt to focus using breadcrumb focusTarget
  const { breadcrumb } = getState();
  if (breadcrumb.length) {
    try {
      const latest = breadcrumb[breadcrumb.length - 1];
      const target = latest.focusTarget;
      setTimeout(() => {
        const e =
          document.getElementById(target) || document.querySelector(target);
        if (e) {
          e.focus();
        }
      }, 1);
    } catch (e) {
      console.warn('Unable to focus to focusTarget in breadcrumb');
    }
  }

  dispatch({
    type: 'POP_ENTRY',
  });
};

export const breadcrumbReplace = (obj) => async (dispatch) => {
  dispatch({
    type: 'REPLACE_ENTRY',
    entry: obj,
  });
};
