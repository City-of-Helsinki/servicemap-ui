import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  InputBase, Paper, withStyles, IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { generatePath } from '../../utils/path';
import { fetchUnits } from '../../redux/actions/unit';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
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
  state = {
    search: null,
    isActive: false,
  };

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
    this.setState({ search: e.currentTarget.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { search } = this.state;
    this.handleSubmit(search);
  }

  handleSubmit = (search) => {
    if (search && search !== '') {
      const {
        fetchUnits, history, match,
      } = this.props;
      const { params } = match;
      const lng = params && params.lng;
      if (history) {
        history.push(generatePath('search', lng, search));
      }

      fetchUnits([], null, search);
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
    const { search, isActive } = this.state;

    const inputValue = typeof search === 'string' ? search : previousSearch;

    return (
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
    );
  }
}

SearchBar.propTypes = {
  backButtonEvent: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchUnits: PropTypes.func.isRequired,
  hideBackButton: PropTypes.bool,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  hideBackButton: false,
  searchRef: {},
};

export default withRouter(withStyles(styles)(injectIntl(connect(
  null,
  { fetchUnits },
)(SearchBar))));
