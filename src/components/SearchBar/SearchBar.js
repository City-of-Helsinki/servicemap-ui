import React from 'react';
import PropTypes from 'prop-types';
import {
  InputBase, Paper, withStyles, IconButton,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit / 2,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
    border: '1px solid gray',
  },
  rootFocused: {
    margin: 0,
    transition: theme.transitions.create('margin', {
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
    search: '',
    isActive: false,
  };

  onInputChange = (e) => {
    this.setState({ search: e.currentTarget.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    const { search } = this.state;
    if (onSubmit && search !== '') {
      onSubmit(e, search);
    }
  }

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  render() {
    const {
      backButtonTarget, classes, intl, placeholder, hideBackButton, searchRef, initialText,
    } = this.props;
    const { search, isActive } = this.state;

    const inputValue = typeof search === 'string' && search !== '' ? search : initialText;

    return (
      <Paper className={`${classes.root} ${isActive ? classes.rootFocused : ''}`} elevation={1} square>
        <form onSubmit={this.onSubmit} className={classes.container}>
          {
            !hideBackButton
            && <BackButton className={classes.iconButton} target={backButtonTarget || null} />
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
  backButtonTarget: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  hideBackButton: PropTypes.bool,
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  initialText: PropTypes.string,
};

SearchBar.defaultProps = {
  initialText: null,
};

SearchBar.defaultProps = {
  backButtonTarget: null,
  hideBackButton: false,
  searchRef: {},
};

export default withStyles(styles)(injectIntl(SearchBar));
