import { useSelector } from 'react-redux';
import { getOrderedData } from '../redux/selectors/results';
import { getServiceUnits } from '../redux/selectors/service';

// Returns correct set of data for download data tool
const useDownloadData = (page) => {
  let selector;
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
      selector = () => [];
      break;
  }
  return useSelector(selector);
};

export default useDownloadData;
