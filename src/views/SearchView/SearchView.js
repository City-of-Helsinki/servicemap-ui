import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, IconButton, InputBase, Divider, Icon, Typography, withStyles,
} from '@material-ui/core';
import { ArrowBack, Search } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ResultList from '../../components/ResultList';
import styles from './styles';
import Loading from '../../components/Loading/Loading';

class SearchView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    this.searchFormRef = React.createRef();
  }

  componentDidMount() {
    // TODO: Temp data to be removed
    const { fetchUnits } = this.props;
    if (fetchUnits) {
      fetchUnits([], null, 'kallion kirjasto');
    }
  }

  onInputChange = (e) => {
    this.setState({ search: e.currentTarget.value });
  }

  onSearchSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;
    // const { fetchUnits } = this.props;
    console.log(`Search query = ${search}`);
    if (search && search !== '') {
      // fetchUnits([], null, search);
    }
  }

  // onClick event for each ResultList's item
  onItemClick = (e, item) => {
    const { history, match } = this.props;
    const { params } = match;
    const lng = params && params.lng;
    e.preventDefault();
    if (history && item) {
      history.push(`/${lng || 'fi'}/unit/${item.id}/`);
    }
  }

  render() {
    const { search } = this.state;
    const {
      units, isFetching, classes, history, intl, count, max,
    } = this.props;
    const unitCount = units && units.length;
    const resultsShowing = !isFetching && unitCount > 0;
    const progress = (isFetching && count) ? Math.floor((count / max * 100)) : 0;

    return (
      <div className="Search">
        <form onSubmit={this.onSearchSubmit}>
          <Paper className={classes.root} elevation={1} square>
            <IconButton
              className={classes.iconButton}
              aria-label={intl.formatMessage({ id: 'general.back' })}
              onClick={(e) => {
                e.preventDefault();
                if (history) {
                  history.goBack();
                }
              }}
            >
              <ArrowBack />
            </IconButton>

            <InputBase
              className={classes.input}
              placeholder={intl && intl.formatMessage({ id: 'search.input.placeholder' })}
              value={search}
              onChange={this.onInputChange}
              classes={{
                focused: classes.cssFocused,
              }}
            />

            <Icon className={classes.icon}>
              <Search />
            </Icon>
          </Paper>
        </form>
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
          <ResultList
            title={intl.formatMessage({ id: 'unit.plural' })}
            data={units}
            onItemClick={this.onItemClick}
          />
          )
        }
      </div>
    );
  }
}
export default injectIntl(withStyles(styles)(withRouter(SearchView)));

// Typechecking
SearchView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  count: PropTypes.number,
  fetchUnits: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
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
