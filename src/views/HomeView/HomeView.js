import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import Container from '../../components/Container';
import SearchBar from '../../components/SearchBar';
import { generatePath } from '../../utils/path';

// TODO: Fix close by events and services lists with actual data items once data is accessible

class HomeView extends React.Component {
  // Search submit functionality
  onSearchSubmit = (e, search) => {
    e.preventDefault();
    const {
      fetchUnits, history, match,
    } = this.props;
    const { params } = match;
    const lng = params && params.lng;
    console.log(`Search query = ${search}`);

    if (history) {
      // TODO: Add query text once functionality is ready for search view
      history.push(generatePath('search', lng, search));
    }

    if (search && search !== '') {
      fetchUnits([], null, search);
    }
  }

  render() {
    const { intl } = this.props;
    return (
      <>
        <SearchBar
          hideBackButton
          onSubmit={this.onSearchSubmit}
          placeholder={intl.formatMessage({ id: 'search' })}
        />
        <Container paper title="Lähellä olevat palvelut">
          <List>
            {
              [
                'Kirjasto',
                'Koulu',
                'test3',
              ].map(service => (
                <ListItem key={service}>
                  <ListItemText primary={`${service}`} />
                </ListItem>
              ))
            }
          </List>
        </Container>

        <Container paper title="Lähellä olevat tapahtumat">
          <List>
            {
              [
                'Kirjaston käsityöpaja',
                'Musiikkia',
                'Jotain muuta',
              ].map(service => (
                <ListItem key={service}>
                  <ListItemText primary={`${service}`} />
                </ListItem>
              ))
            }
          </List>
        </Container>
      </>
    );
  }
}

export default injectIntl(HomeView);

// Typechecking
HomeView.propTypes = {
  fetchUnits: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

HomeView.defaultProps = {
  fetchUnits: () => {},
};
