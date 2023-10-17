import { useSelector } from 'react-redux';
import { getOrderedData } from '../redux/selectors/results';
import { getServiceUnits } from '../redux/selectors/service';

// to get rid of https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
const emptyArray = [];

// Custom hook that returns correct set of data for download data tool
const useDownloadData = () => {
  let selector;
  const page = useSelector(state => state.user.page);
  switch (page) {
    case 'search':
      selector = getOrderedData;
      break;
    case 'unit':
      selector = state => state.selectedUnit.unit.data;
      break;
    case 'service':
      selector = getServiceUnits;
      break;
    case 'address':
      selector = state => state.address.units;
      break;
    default:
      selector = () => emptyArray;
      break;
  }
  return useSelector(selector);
};

export default useDownloadData;
