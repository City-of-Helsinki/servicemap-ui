import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getHighlightedDistrict } from '../../redux/selectors/district';
import { selectMapRef } from '../../redux/selectors/general';
import fetchDivisionDistrict from './fetchDivisionDistrict';
import { focusDistrict } from '../MapView/utils/mapActions';
import { parseSearchParams } from '../../utils';
import fetchSearchResults from '../../redux/actions/search';
import { setHighlightedDistrict } from '../../redux/actions/district';

const DivisionView = ({ location, match }) => {
  const dispatch = useDispatch();
  const highlightedDistrict = useSelector(getHighlightedDistrict);
  const map = useSelector(selectMapRef);
  useEffect(() => {
    const { area, city } = match.params;

    const searchParams = parseSearchParams(location.search);
    let options = null;

    if (searchParams.ocd_id) {
      options = {
        division: searchParams.ocd_id,
        only: 'root_service_nodes,services,location,name,street_address,contract_type,municipality',
        page: 1,
        page_size: 100,
      };
    } else if (area && city) {
      options = {
        division: `ocd-division/country:fi/${city}/${area}`,
        level: 'all',
        only: 'root_service_nodes,services,location,name,street_address,contract_type,municipality',
        page: 1,
        page_size: 100,
      };
    }

    if (options) {
      dispatch(fetchSearchResults(options));
      fetchDivisionDistrict(options.division)
        .then((data) => {
          dispatch(setHighlightedDistrict(data[0]));
        });
    }
  }, []);

  useEffect(() => {
    if (!highlightedDistrict) {
      return;
    }
    const { coordinates } = highlightedDistrict.boundary;
    if (map && coordinates) {
      focusDistrict(map, coordinates);
    }
  }, [map, highlightedDistrict]);

  return null;
};

export default DivisionView;

// Typechecking
DivisionView.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};
