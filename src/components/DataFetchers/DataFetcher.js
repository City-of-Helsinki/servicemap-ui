import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import fetchSearchResults from '../../redux/actions/search';
import { selectMapRef } from '../../redux/selectors/general';
import { parseBboxFromLocation } from '../../utils/mapUtility';
import { fitBbox } from '../../views/MapView/utils/mapActions';
import { searchParamFetchOptions } from './helpers';

const DataFetcher = ({ location }) => {
  const currentPage = useSelector(state => state.user.page);
  const map = useSelector(selectMapRef);
  const dispatch = useDispatch();

  /**
   * Handle bbox fetching
   */
  const handleBBoxFetch = () => {
    if (!map) {
      return false;
    }

    const bbox = parseBboxFromLocation(location);
    if (bbox) {
      fitBbox(map, bbox);
    }

    const options = searchParamFetchOptions(location, null, true);
    if (
      !options.bbox || !options.bbox_srid || !options.level
      || options.q || options.service_node || options.service
    ) {
      return false;
    }

    dispatch(fetchSearchResults(options));
    return true;
  };

  // Component mount action
  useEffect(() => {
    if (!map) {
      return;
    }
    switch (currentPage) {
      case 'search':
      case 'home':
        handleBBoxFetch();
        break;
      default:
    }
  }, [currentPage, map]);

  return null;
};

export default withRouter(DataFetcher);
