import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Divider, withStyles, Typography,
} from '@material-ui/core';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';
import ResultList from '../../components/Lists/ResultList';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.searchField = React.createRef();
    const { changeSelectedUnit } = props;

    // Reset selected unit on SearchView
    if (changeSelectedUnit) {
      changeSelectedUnit(null);
    }
  }

  componentDidMount() {
    // TODO: Temp data to be removed
    const { fetchUnits } = this.props;
    if (fetchUnits) {
      // fetchUnits([], null, 'kallion kirjasto');
    }
    this.searchField.current.focus();
  }

  onSearchSubmit = (e, search) => {
    e.preventDefault();
    const { fetchUnits } = this.props;
    console.log(`Search query = ${search}`);
    if (search && search !== '') {
      fetchUnits([], null, search);
    }
  }

  render() {
    const {
      units, isFetching, classes, intl, count, max,
    } = this.props;
    const unitCount = units && units.length;
    const resultsShowing = !isFetching && unitCount > 0;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    // Hide paper padding when nothing is shown
    const paperStyles = {};
    if (!isFetching) {
      paperStyles.padding = 0;
    }

    return (
      <div className="Search">
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
        <SearchBar
          searchRef={this.searchField}
          onSubmit={this.onSearchSubmit}
          placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
        />
        <Divider aria-hidden="true" />
        <Paper className={classes.label} elevation={1} square aria-live="polite" style={paperStyles}>
          {
            isFetching
            && <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
          }

        </Paper>
        {
          resultsShowing
          && (
          <ResultList
            listId="search-list"
            title={intl.formatMessage({ id: 'unit.plural' })}
            data={units}
          />
          )
        }
      </div>
    );
  }
}
export default injectIntl(withStyles(styles)(SearchView));

// Typechecking
SearchView.propTypes = {
  changeSelectedUnit: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  max: PropTypes.number,
  units: PropTypes.arrayOf(PropTypes.any),
};

SearchView.defaultProps = {
  changeSelectedUnit: () => {},
  count: 0,
  fetchUnits: () => {},
  isFetching: false,
  max: 0,
  units: [],
};
