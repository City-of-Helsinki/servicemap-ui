import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  InputBase, Paper, withStyles, IconButton, List, ListItem, Typography, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';
import UnitItem from '../ListItems/UnitItem';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchUnits, setNewFilters } from '../../redux/actions/unit';
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
  suggestionSubtitle: {
    display: 'flex',
    backgroundColor: 'rgba(155,155,155,0.47)',
    paddingLeft: '18px',
  },
  subtitleText: {
    lineHeight: '32px',
  },
  suggestionButton: {
    margin: 0,
    width: 'auto',
    textTransform: 'none',
    borderRadius: 8,
  },
  expand: {
    color: '#000000',
    fontWeight: 'normal',
  },
  divider: {
    marginLeft: 72,
  },
  listIcon: {
    paddingRight: theme.spacing.unitDouble,
    paddingTop: 8,
    paddingBottom: 8,
    color: 'rgba(0,0,0,0.54)',
  },
  listText: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  listTextSecondary: {
    flex: '1 0 auto',
  },
});


class SearchBar extends React.Component {
  suggestionDelay = 400;

  timeout = null;

  constructor(props) {
    super(props);

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      // suggestedWord: null,
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
    if (query.length > 2) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        const { search } = this.state;
        createSuggestions(search, getLocaleText)
          .then(result => this.setState({ suggestions: result }));
      }, this.suggestionDelay);
    }
    this.setState({ search: e.currentTarget.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { filters } = this.props;
    const { search } = this.state;

    if (filters && filters.service) {
      this.handleSubmit(search, null, true);
      return;
    }
    this.handleSubmit(search);
  }

  handleServiceFiltering = (item) => {
    const { previousSearch, setNewFilters } = this.props;
    if (previousSearch !== item.query) {
      this.setState({ search: item.query }, () => {
        this.handleSubmit(item.query, {
          service: [item.service.object],
        }, true);
      });
    } else {
      this.setState({ suggestions: null }, () => {
        setNewFilters({
          service: [item.service.object],
        });
      });
    }
  }

  handleSubmit = (search, options = null, forced = false) => {
    const { isFetching } = this.props;

    if (!isFetching && search && search !== '') {
      const {
        fetchUnits, navigator, previousSearch,
      } = this.props;
      if (navigator) {
        navigator.push('search', { query: search, services: options.service ? options.service.map(service => service.id) : null });
      }
      if (forced || search !== previousSearch) {
        fetchUnits([], null, search, options);
      }
    }
    this.setState({ suggestions: null });
  }

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  renderSuggesitonItem(item, i, listLength) {
    const { classes } = this.props;
    const key = `${item.query}-${item.service && item.service.name}`;

    // Primary text element for list item
    const primaryText = i === 0
      ? <Typography variant="body2">{`${item.query}`}</Typography>
      : (
        <>
          <Typography variant="caption">{`"${item.query}" palvelulla`}</Typography>
          <Typography variant="body2">{`${item.service.name}`}</Typography>
        </>
      );
    // Secondary text element for list item
    const secondaryText = i !== 0
      ? <Typography className={classes.listTextSecondary} align="right" variant="caption">{`${item.count} tulosta`}</Typography>
      : null;
    const itemOnClick = () => {
      if (i === 0) {
        this.handleSubmit(item.query);
        return;
      }
      this.handleServiceFiltering(item);
    };

    return (
      <ListItem key={key} button onClick={itemOnClick} divider={i !== listLength - 1}>
        <ListItemIcon>
          <Search className={classes.listIcon} />
        </ListItemIcon>
        <ListItemText
          className={classes.listText}
          primary={primaryText}
          secondary={secondaryText}
        />
      </ListItem>
    );
  }

  renderSuggestions() {
    const { classes } = this.props;
    const {
      suggestions,
    } = this.state;

    if (!suggestions) {
      return null;
    }

    const suggestionList = (suggestions && suggestions[1]) || null;

    return (
      <div style={{
        position: 'fixed', zIndex: 999999, width: '450px', backgroundColor: '#ffffff', top: 140, bottom: 0, overflow: 'auto',
      }}
      >
        <div className={classes.suggestionSubtitle}>
          <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
        </div>
        <List key="SuggestionList">
          {
            suggestionList
            && suggestionList.map(
              (item, i) => this.renderSuggesitonItem(item, i, suggestionList.length),
            )
          }
        </List>
        <div className={classes.suggestionSubtitle}>
          <Typography className={classes.subtitleText} variant="overline">Ehdotuksia</Typography>
        </div>
        <List key="SuggestionUnitList">
          { suggestions[0].map(item => (
            <UnitItem key={item.id} unit={item} />
          ))}
        </List>
      </div>
    );
  }

  render() {
    const {
      backButtonEvent, classes, intl, placeholder, previousSearch, hideBackButton, searchRef,
    } = this.props;
    const {
      search, isActive,
    } = this.state;

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
              autoComplete="off"
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
        {
          this.renderSuggestions()
        }
      </>
    );
  }
}

SearchBar.propTypes = {
  backButtonEvent: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchUnits: PropTypes.func.isRequired,
  filters: PropTypes.objectOf(PropTypes.any),
  hideBackButton: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchRef: PropTypes.objectOf(PropTypes.any),
  previousSearch: PropTypes.string,
  getLocaleText: PropTypes.func.isRequired,
  setNewFilters: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  filters: null,
  previousSearch: null,
  backButtonEvent: null,
  hideBackButton: false,
  navigator: null,
  searchRef: {},
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, units } = state;
  const { filters, isFetching } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    filters,
    isFetching,
    navigator,
    getLocaleText,
  };
};

export default withStyles(styles)(injectIntl(connect(
  mapStateToProps,
  { fetchUnits, setNewFilters },
)(SearchBar)));
