import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  InputBase, Paper, withStyles, IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchUnits } from '../../redux/actions/unit';
import createSuggestions from './createSuggestions';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unitHalf,
    transition: theme.transitions.create(['margin', 'padding'], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
    border: '1px solid gray',
  },
  rootFocused: {
    margin: 0,
    // Margin is replaced with padding so height doesn't get affected
    padding: theme.spacing.unit * 1.5,
    transition: theme.transitions.create(['margin', 'padding'], {
      duration: theme.transitions.duration.complex,
    }),
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
  },
  input: {
    flex: '1 1 auto',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  iconButton: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
  icon: {
    flex: '0 1 auto',
    padding: theme.spacing.unit,
  },
});


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      suggestions: null,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { previousSearch } = this.props;
    // If previousSearch changes change current search text
    if (
      previousSearch
      && nextProps
      && nextProps.previousSearch
      && previousSearch !== nextProps.previousSearch
    ) {
      this.setState({ search: nextProps.previousSearch });
      return false;
    }
    return true;
  }

  onInputChange = (e) => {
    const { getLocaleText } = this.props;
    const query = e.currentTarget.value;
    this.setState({ search: e.currentTarget.value });
    if (query.length > 2) {
      createSuggestions(e.currentTarget.value, getLocaleText)
        .then(result => this.setState({ suggestions: result }));
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;
    this.handleSubmit(search);
  }

  handleSubmit = (search) => {
    const { isFetching } = this.props;

    if (!isFetching && search && search !== '') {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      if (navigator) {
        navigator.push('search', search);
      }

      if (search !== previousSearch) {
        fetchUnits([], null, search);
      }
    }
  }

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  render() {
    const {
      backButtonEvent, classes, intl, placeholder, previousSearch, hideBackButton, searchRef,
    } = this.props;
    const { search, isActive, suggestions } = this.state;

    const inputValue = typeof search === 'string' ? search : previousSearch;

    return (
      <>
        <Paper className={`${classes.root} ${isActive ? classes.rootFocused : ''}`} elevation={1} square>
          <form onSubmit={this.onSubmit} className={classes.container}>
            {
            !hideBackButton
            && <BackButton className={classes.iconButton} onClick={backButtonEvent || null} variant="icon" />
          }

            <InputBase
              id="searchInput"
              inputRef={searchRef}
              className={classes.input}
              placeholder={placeholder}
              value={inputValue || ''}
              onChange={this.onInputChange}
              onFocus={this.toggleAnimation}
              onBlur={this.toggleAnimation}
            />

            <IconButton
              aria-label={intl.formatMessage({ id: 'search' })}
              type="submit"
              className={classes.icon}
            >
              <Search />
            </IconButton>
          </form>
        </Paper>
        {suggestions && (
          <div style={{
            position: 'fixed', zIndex: 999999, height: '100%', width: '450px', backgroundColor: '#ffffff',
          }}
          >
            <ul>
              {suggestions.map(item => (
                <li>
                  <p>{`${item.query} ${item.count} tulosta`}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
}

SearchBar.propTypes = {
  backButtonEvent: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchUnits: PropTypes.func.isRequired,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
  getLocaleText: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  hideBackButton: false,
  navigator: null,
  searchRef: {},
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, units } = state;
  const { isFetching } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    isFetching,
    navigator,
    getLocaleText,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { fetchUnits },
)(SearchBar)));
