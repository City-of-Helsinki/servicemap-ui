import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import fetchSearchResults from '../../redux/actions/search';
import { selectMapRef } from '../../redux/selectors/general';
import { getPage } from '../../redux/selectors/user';
import { parseBboxFromLocation } from '../../utils/mapUtility';
import { fitBbox } from '../../views/MapView/utils/mapActions';
import { searchParamFetchOptions } from './helpers';

function DataFetcher() {
  const location = useLocation();
  const currentPage = useSelector(getPage);
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
      !options.bbox ||
      !options.bbox_srid ||
      !options.level ||
      options.q ||
      options.service_node ||
      options.mobility_node ||
      options.service
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
}

export default DataFetcher;
