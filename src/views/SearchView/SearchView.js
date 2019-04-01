import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Divider, Typography, withStyles,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import SearchList from './components/SearchList';
import styles from './styles';
import Loading from '../../components/Loading/Loading';
import SearchBar from '../../components/SearchBar';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.searchFormRef = React.createRef();
  }

  componentDidMount() {
    // TODO: Temp data to be removed
    const { fetchUnits } = this.props;
    if (fetchUnits) {
      fetchUnits([], null, 'kallion kirjasto');
    }
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

    return (
      <div className="Search">
        <SearchBar
          onSubmit={this.onSearchSubmit}
          placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
        />
        <Divider />
        <Paper className={classes.label} elevation={1} square>
          {
          isFetching
          && <Loading text={intl && intl.formatMessage({ id: 'search.loading.units' }, { count, max })} progress={progress} />
          }
          {
            !isFetching
            && (
            <Typography variant="h3" style={{ fontSize: '1.25rem', margin: 0, float: 'left' }}>
              <FormattedMessage id="search.info" values={{ count: unitCount }} />
            </Typography>
            )
          }
        </Paper>
        {
          resultsShowing
          && (
          <SearchList
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  max: PropTypes.number,
  units: PropTypes.arrayOf(PropTypes.any),
};

SearchView.defaultProps = {
  count: 0,
  fetchUnits: () => {},
  isFetching: false,
  max: 0,
  units: [],
};
