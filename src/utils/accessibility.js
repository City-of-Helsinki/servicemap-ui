// View title ID
export const viewTitleID = 'view-title';

// Focus user to view title's link element
export const focusToViewTitle = () => {
  const el = document.getElementById(viewTitleID);
  if (el) {
    el.focus();
  }
};
