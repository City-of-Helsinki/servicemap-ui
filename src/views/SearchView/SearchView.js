/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Paper, Divider, withStyles, Typography, Link,
} from '@material-ui/core';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';
import { fitUnitsToMap } from '../Map/utils/mapActions';
import { parseSearchParams } from '../../utils';
import { generatePath } from '../../utils/path';
import TabLists from '../../components/TabLists';

import paths from '../../../config/paths';
import Container from '../../components/Container/Container';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    const { changeSelectedUnit } = props;

    // Reset selected unit on SearchView
    if (changeSelectedUnit) {
      changeSelectedUnit(null);
    }
  }

  componentDidMount() {
    const {
      fetchUnits, location, previousSearch, units, map, setCurrentPage,
    } = this.props;
    setCurrentPage('search');
    const searchParams = parseSearchParams(location.search);
    const searchParam = searchParams.q || null;
    if (searchParam && fetchUnits && searchParam !== previousSearch) {
      fetchUnits([], null, searchParam);
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
      history.push(generatePath('search', lng, search));
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
      classes, count, fetchUnits, history, intl, isFetching, max, previousSearch, units,
    } = this.props;
    const unitCount = units && units.length;
    const resultsShowing = !isFetching && unitCount > 0;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;


    // Group data
    const groupedData = this.groupData(units);

    // Data for TabResults component
    const searchResults = [
      {
        ariaLabel: `${intl.formatMessage({ id: 'unit.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .units.length,
        })}`,
        component: null,
        data: groupedData.units,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'unit.plural' }),
      },
      {
        ariaLabel: `${intl.formatMessage({ id: 'service.plural' })} ${intl.formatMessage({ id: 'search.results.short' }, {
          count: groupedData
            .services.length,
        })}`,
        component: null,
        data: groupedData.services,
        itemsPerPage: 10,
        title: intl.formatMessage({ id: 'service.plural' }),
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
          backButtonEvent={(e) => {
            e.preventDefault();
            history.goBack();

            // Listen history
            const unlisten = history.listen((location) => {
              // Get search params
              const searchParams = parseSearchParams(location.search);
              const searchParam = searchParams.q || null;

              // If page is search
              // and previousSearch is not current location's params
              // then fetch units with location's search params
              if (paths.search.regex.exec(location.pathname) && previousSearch !== searchParam) {
                fetchUnits([], null, searchParam);
              }
              unlisten(); // Remove listener
            });
          }}
          onSubmit={this.onSearchSubmit}
          placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
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
          <Typography className={classes.srTitle} variant="srOnly" component="h3" tabIndex="-1">
            {
              !isFetching
              && (
                <FormattedMessage id="search.results.title" />
              )
            }
            {
              isFetching && max === 0
              && <FormattedMessage id="search.started" />
            }
            {
              isFetching && max > 0
                && <FormattedMessage id="search.loading.units.srInfo" values={{ count: max }} />
            }
            {
              !isFetching
              && <FormattedMessage id="search.results" values={{ count: unitCount }} />
            }
          </Typography>
        </Paper>

        {
          // Show results
          resultsShowing
          && (
            <TabLists data={searchResults} />
          )
        }
        {
          !isFetching
          && previousSearch
          && units
          && units.length === 0
          && (
            <Container>
              <Typography variant="subtitle1" component="p" aria-hidden="true">
                <FormattedMessage id="search.results" values={{ count: units.length }} />
              </Typography>
            </Container>
          )
        }

        {
          // Jump link back to beginning of current page
        }
        <Typography variant="srOnly" component="h3">
          <Link href="#view-title" tabIndex="-1">
            <FormattedMessage id="general.return.viewTitle" />
          </Link>
        </Typography>
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
