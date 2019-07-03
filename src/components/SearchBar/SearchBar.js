import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  InputBase, Paper, withStyles, IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { fetchUnits } from '../../redux/actions/unit';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
  },
  wrapper: {
    flex: 1,
    margin: theme.spacing.unit,
    padding: theme.spacing.unitHalf,
    transition: theme.transitions.create(['margin', 'padding'], {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
    border: '1px solid gray',
  },
  wrapperFocused: {
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
  sticky: {
    position: 'sticky',
    zIndex: 50,
  },
});


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
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
    this.setState({ search: e.currentTarget.value });
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
      backButtonEvent,
      classes,
      intl,
      isSticky,
      placeholder,
      previousSearch,
      hideBackButton,
      searchRef,
    } = this.props;
    const { search, isActive } = this.state;

    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''}`;
    const wrapperClasses = `${classes.wrapper} ${isActive ? classes.wrapperFocused : ''}`;
    const stickyStyles = typeof isSticky === 'number' ? { top: isSticky } : null;

    return (
      <div className={rootClasses} style={stickyStyles}>
        <Paper className={wrapperClasses} elevation={1} square>
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
      </div>
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
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  hideBackButton: false,
  isSticky: null,
  navigator: null,
  searchRef: {},
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, units } = state;
  const { isFetching } = units;
  return {
    isFetching,
    navigator,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { fetchUnits },
)(SearchBar)));
