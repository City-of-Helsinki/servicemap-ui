/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Paper, Divider, withStyles, Typography,
} from '@material-ui/core';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';
import { fitUnitsToMap } from '../Map/utils/mapActions';
import { parseSearchParams } from '../../utils';
import { generatePath } from '../../utils/path';
import BackButton from '../../components/BackButton';
import Container from '../../components/Container/Container';
import TabLists from '../../components/TabLists';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    const { changeSelectedUnit } = props;

    // Reset selected unit on SearchView
    if (changeSelectedUnit) {
      changeSelectedUnit(null);
    }
    this.state = {
      queryParam: null,
    };
  }

  componentDidMount() {
    const {
      fetchUnits, history, location, match, previousSearch, units, map, setCurrentPage,
    } = this.props;
    setCurrentPage('search');
    const searchParams = parseSearchParams(location.search);
    const searchParam = searchParams.q || null;
    if (searchParam && fetchUnits && searchParam !== previousSearch) {
      fetchUnits([], null, searchParam);
      this.setState({ queryParam: searchParam });
    }

    this.focusMap(units, map);
  }

  shouldComponentUpdate(nextProps) {
    const { units, map } = this.props;
    // If new search results, call map focus functio
    if (nextProps.units.length > 0 && units !== nextProps.units) {
      this.focusMap(nextProps.units, map);
    }
    return true;
  }

  focusMap = (units, map) => {
    if (map && map._layersMaxZoom) {
      fitUnitsToMap(units, map);
    }
  }

  onSearchSubmit = (e, search) => {
    e.preventDefault();
    const { fetchUnits, history, match } = this.props;
    const { params } = match;
    const lng = params && params.lng;
    if (search && search !== '') {
      fetchUnits([], null, search);
      history.replace(generatePath('search', lng, search));
    }
  }

  // Group data based on object types
  groupData = (data) => {
    const services = data.filter(obj => obj && obj.object_type === 'service');
    const units = data.filter(obj => obj && obj.object_type === 'unit');

    return {
      services,
      units,
    };
  }

  render() {
    const {
      units, isFetching, classes, intl, count, max,
    } = this.props;
    const { queryParam } = this.state;
    const unitCount = units && units.length;
    const resultsShowing = !isFetching && unitCount > 0;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;


    // Group data
    const groupedData = this.groupData(units);

    // Data for TabResults component
    const searchResults = [
      {
        ariaLabel: intl.formatMessage({ id: 'search.results.units' }, { count: groupedData.units.length }),
        component: null,
        data: groupedData.units,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'unit.plural' }),
      },
      {
        ariaLabel: intl.formatMessage({ id: 'search.results.services' }, { count: groupedData.services.length }),
        component: null,
        data: groupedData.services,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'unit.services' }),
      },
    ];

    // Hide paper padding when nothing is shown
    const paperStyles = {};
    if (!isFetching) {
      paperStyles.padding = 0;
    }

    return (
      <div className="Search">
        <SearchBar
          onSubmit={this.onSearchSubmit}
          placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
          text={queryParam}
        />
        <Divider aria-hidden="true" />
        <Paper className={classes.label} elevation={1} square aria-live="polite" style={paperStyles}>
          {
            isFetching
            && <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
          }
          {
            // Screen reader only information
          }
          <Typography variant="srOnly">
            {
              isFetching && max === 0
              && <FormattedMessage id="search.started" />
            }
          </Typography>
          <Typography variant="srOnly">
            {
              isFetching && max > 0
                && <FormattedMessage id="search.loading.units.srInfo" values={{ count: max }} />
            }
          </Typography>
          <Typography variant="srOnly">
            {
              !isFetching
              && <FormattedMessage id="search.info" values={{ count: unitCount }} />
            }
          </Typography>
        </Paper>
        {
          resultsShowing
          && (
            <TabLists data={searchResults} />
          )
        }
        <Container>
          <BackButton />
        </Container>
      </div>
    );
  }
}
export default withRouter(injectIntl(withStyles(styles)(SearchView)));

// Typechecking
SearchView.propTypes = {
  changeSelectedUnit: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  max: PropTypes.number,
  previousSearch: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.any),
  map: PropTypes.objectOf(PropTypes.any),
  setCurrentPage: PropTypes.func.isRequired,
};

SearchView.defaultProps = {
  changeSelectedUnit: () => {},
  count: 0,
  fetchUnits: () => {},
  isFetching: false,
  max: 0,
  previousSearch: null,
  units: [],
  map: null,
};
