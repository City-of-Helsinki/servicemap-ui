import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  InputBase, Paper, withStyles, IconButton, List, ListItem, Typography, Button, Divider,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { injectIntl, intlShape } from 'react-intl';
import BackButton from '../BackButton';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchUnits } from '../../redux/actions/unit';
import createSuggestions from './createSuggestions';
import expandSearch from './expandSearch';
import UnitItem from '../ListItems/UnitItem';
import ServiceMapButton from '../ServiceMapButton';
import { SearchIcon } from '../SMIcon';

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
});


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    const { previousSearch } = props;

    this.state = {
      search: previousSearch,
      isActive: false,
      suggestions: null,
      expandedQueries: null,
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
        .then(result => this.setState({ expandedQueries: null, suggestions: result }));
    }
  }

  onExpandSearch = (item) => {
    const { getLocaleText } = this.props;
    expandSearch(item, getLocaleText)
      .then(result => this.setState({
        search: result.search,
        expandedQueries: result.expandedQueries,
      }));
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

  suggestionBackEvent = () => {
    const { expandedQueries } = this.state;
    if (expandedQueries) {
      this.setState({ expandedQueries: null });
    } else {
      this.setState({ suggestions: null });
    }
  };

  toggleAnimation = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  render() {
    const {
      backButtonEvent, classes, intl, placeholder, previousSearch, hideBackButton, searchRef,
    } = this.props;
    const {
      search, isActive, suggestions, expandedQueries,
    } = this.state;

    const suggestionList = expandedQueries || (suggestions && suggestions[1]) || null;

    const inputValue = typeof search === 'string' ? search : previousSearch;

    return (
      <>
        <Paper className={`${classes.root} ${isActive ? classes.rootFocused : ''}`} elevation={1} square>
          <form onSubmit={this.onSubmit} className={classes.container}>
            {
            (suggestionList || !hideBackButton)
            && <BackButton className={classes.iconButton} onClick={suggestionList ? this.suggestionBackEvent : backButtonEvent || null} variant="icon" />
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
          <div className={classes.suggestionSubtitle}>
            <Typography className={classes.subtitleText} variant="overline">Tarkoititko..?</Typography>
          </div>
          <List>
            {suggestionList.map((item, i) => (
              <>
                <ListItem key={item.query}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '50%' }}>
                      <Search className={classes.listIcon} />
                      <div>
                        <Typography variant="body2">{`${item.query}`}</Typography>
                        <Typography variant="caption">{`${item.count} tulosta`}</Typography>
                      </div>
                    </div>
                    <div style={{ width: '50%', display: 'contents', justifyContent: 'right' }}>
                      {item.count > 1 && !item.final && (
                      <Button
                        variant="outlined"
                        style={{ height: 36 }}
                        className={classes.suggestionButton}
                        onClick={() => this.onExpandSearch(item)}
                      >
                        <Typography className={classes.expand} variant="body2">
                          {'+ tarkenna'}
                        </Typography>
                      </Button>
                      )}
                      <ServiceMapButton
                        className={classes.suggestionButton}
                        onClick={() => this.handleSubmit(item.query)}
                      >
                        <Typography variant="button">
                        Hae
                        </Typography>
                      </ServiceMapButton>
                    </div>
                  </div>
                </ListItem>
                {i !== suggestionList.length - 1 && (
                  <Divider className={classes.divider} />
                )}
              </>
            ))}
          </List>
          <div className={classes.suggestionSubtitle}>
            <Typography className={classes.subtitleText} variant="overline">Ehdotuksia</Typography>
          </div>
          <List>
            {suggestions[0].map(item => (
              <UnitItem key={item.id} unit={item} />
            ))}
          </List>
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
