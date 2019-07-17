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

  expandFilter = async (item) => {
    const { getLocaleText } = this.props;
    const searchData = [];
    // const pageSize = 200;
    await fetch(`https://api.hel.fi/servicemap/v2/search/?q=${item.query}&only=unit.name,unit.services&include=unit.services&page_size=${item.count}&type=unit`)
      .then(response => response.json())
      .then((data) => {
        const serviceList = [];
        const serviceObjects = [];
        for (let i = 0; serviceList.length < 5 && i < item.count; i += 1) {
          const result = data.results[i];

          result.services.forEach((service) => {
            if (serviceList.indexOf(service.name.fi) === -1) {
              serviceList.push(service.name.fi);
              serviceObjects.push({ service: service.name.fi, units: [result] });
            } else {
              serviceObjects.forEach((item) => {
                if (item.service === service.name.fi) {
                  item.units.push(result);
                }
              });
            }
          });
        }
        serviceObjects.forEach((service) => {
          searchData.push({ query: `${item.query} ${service.service}`, count: service.units.length, final: true });
        });
        this.setState({ expandedQueries: searchData });
      });
  }

  expandSearch = async (item) => {
    const { getLocaleText } = this.props;
    // const pageSize = 200;
    await fetch(`https://api.hel.fi/servicemap/v2/search/?q=${item.query}&only=unit.name,unit.services&include=unit.services&page_size=${item.count}&type=unit`)
      .then(response => response.json())
      .then((data) => {
        const suggestions = [];
        for (let i = 0; suggestions.length < 10 && i < item.count; i += 1) {
          const result = data.results[i];

          const phrase = `${item.query} ${getLocaleText(result.services[0].name)}`;
          if (suggestions.indexOf(phrase) === -1) {
            suggestions.push(phrase);
          }

          /* result.services.forEach((service) => {
            const phrase = `${item.query} ${getLocaleText(service.name)}`;
            if (suggestions.indexOf(phrase) === -1) {
              suggestions.push(phrase);
            }
          }); */
        }
        return suggestions;
      })
      .then(async (suggestions) => {
        const searchData = [];
        // Add original query to expanded search as well
        // searchData.push({ query: item.query, count: item.count, final: true });

        // Fetch the result count of each suggestion
        /* const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name&page_size=1&type=unit`)
          .then(response => response.json()))); */

        const data = await Promise.all(suggestions.map(word => fetch(`https://api.hel.fi/servicemap/v2/search/?q=${word}&only=unit.name,unit.services&page_size=100&type=unit`)
          .then(response => response.json())));

        // Add the query name and result count to an array
        data.forEach((res, i) => {
          let query = suggestions[i];
          if (res.count > 0) {
            // These should be removed once we get services from backend
            const services = [];
            res.results.forEach((result) => {
              if (services.indexOf(result.services[0]) === -1) {
                services.push(result.services[0]);
              }
            });
            /* If only one result found with a a sugestion,
              add the whole original name of the result,
              instead of only the split word that matches the query */
            if (res.count === 1) {
              query = getLocaleText(res.results[0].name);
            } else if (services.length === 1) {
              searchData.push({ query, count: res.count, final: true });
            /* } else if (res.count === item.count) {
              console.log('count is same: ', res);
              searchData.push({ query: item.query, count: res.count, final: true }); */
            } else {
              searchData.push({ query, count: res.count, final: true });
            }
          }
        });
        this.setState({ expandedQueries: searchData });
      });
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
                        className={classes.suggestionButton}
                        onClick={() => this.expandFilter(item)}
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
