import { useSelector } from 'react-redux';
import { selectAddressUnits } from '../redux/selectors/address';
import { getOrderedAndFilteredSearchResultData } from '../redux/selectors/results';
import { getSelectedUnit } from '../redux/selectors/selectedUnit';
import { getServiceUnits } from '../redux/selectors/service';
import { getPage } from '../redux/selectors/user';

// to get rid of https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
const emptyArray = [];

// Custom hook that returns correct set of data for download data tool
const useDownloadData = () => {
  let selector;
  const page = useSelector(getPage);
  switch (page) {
    case 'search':
      selector = getOrderedAndFilteredSearchResultData;
      break;
    case 'unit':
      selector = getSelectedUnit;
      break;
    case 'service':
      selector = getServiceUnits;
      break;
    case 'address':
      selector = selectAddressUnits;
      break;
    default:
      selector = () => emptyArray;
      break;
  }
  return useSelector(selector);
};

export default useDownloadData;
