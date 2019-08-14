import React from 'react';
import PropTypes from 'prop-types';
import {
  InputBase, Paper, IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intlShape } from 'react-intl';
import BackButton from '../BackButton';

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
        fetchUnits(search);
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
      className,
      intl,
      isSticky,
      placeholder,
      previousSearch,
      hideBackButton,
      searchRef,
      primary,
    } = this.props;
    const { search, isActive } = this.state;

    const inputValue = typeof search === 'string' ? search : previousSearch;
    const rootClasses = `${classes.root} ${typeof isSticky === 'number' ? classes.sticky : ''} ${primary ? classes.primary : ''} ${className}`;
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
  className: PropTypes.string,
  fetchUnits: PropTypes.func.isRequired,
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isSticky: PropTypes.number,
  isFetching: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
  primary: PropTypes.bool,
};

SearchBar.defaultProps = {
  previousSearch: null,
  backButtonEvent: null,
  className: '',
  hideBackButton: false,
  isSticky: null,
  navigator: null,
  searchRef: {},
  primary: false,
};

export default SearchBar;
