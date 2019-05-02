import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  List, ListItem, ListItemText,
} from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import { Search } from '@material-ui/icons';
import Container from '../../components/Container';
import SearchBar from '../../components/SearchBar';
import { generatePath } from '../../utils/path';
import { MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import HomeLogo from '../../components/Logos/HomeLogo';
import TitledList from '../../components/Lists/TitledList/TitledList';
import SimpleListItem from '../../components/ListItems/SimpleListItem/SimpleListItem';

// TODO: Fix close by events and services lists with actual data items once data is accessible

class HomeView extends React.Component {
  componentDidMount() {
    const { setCurrentPage } = this.props;
    setCurrentPage('home');
  }

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

  onExapmleItemClick = (e, searchText) => {
    this.onSearchSubmit(e, searchText);
  }

  render() {
    const { intl } = this.props;
    return (
      <>
        <MobileComponent>
          <Container>
            <HomeLogo dark aria-label={intl.formatMessage({ id: 'app.title' })} />
          </Container>
        </MobileComponent>
        <SearchBar
          hideBackButton
          onSubmit={this.onSearchSubmit}
          placeholder={intl.formatMessage({ id: 'search' })}
        />
        <Container paper>
          <TitledList title={intl.formatMessage({ id: 'home.example.title' })}>
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Kallion kirjasto')} text="Kallion kirjasto" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Uimahallit')} text="Uimahallit" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Terveysasemat Espoo')} text="Terveysasemat Espoo" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Pysäköintilippuautomaatit')} text="Pysäköintilippuautomaatit" srText={intl.formatMessage({ id: 'home.example.search' })} />
          </TitledList>
        </Container>

        {/* <Container paper title={intl.formatMessage({ id: 'service.nearby' })}>
          <List>
            <ListItem>
              <ListItemText primary={intl.formatMessage({ id: 'general.noData' })} />
            </ListItem>
          </List>
        </Container>

        <Container paper title={intl.formatMessage({ id: 'event.nearby' })}>
          <List>
            <ListItem>
              <ListItemText primary={intl.formatMessage({ id: 'general.noData' })} />
            </ListItem>
          </List>
    </Container> */}
      </>
    );
  }
}

export default withRouter(injectIntl(HomeView));

// Typechecking
HomeView.propTypes = {
  fetchUnits: PropTypes.func,
  setCurrentPage: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

HomeView.defaultProps = {
  fetchUnits: () => {},
};
