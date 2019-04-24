import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import SearchView from '../SearchView';
import UnitView from '../UnitView';
import HomeView from '../HomeView';
import ServiceView from '../Service/ServiceView';
import MobileMapView from '../MobileMapView';

const TitleWrapper = ({ children, messageId }) => (
  <>

    <Typography id="view-title" variant="srOnly" component="h2">
      <FormattedMessage id={messageId} />
    </Typography>
    {children}

  </>
);

TitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  messageId: PropTypes.string.isRequired,
};

const Home = () => (
  <TitleWrapper messageId="general.pageTitles.home">
    <HomeView />
  </TitleWrapper>
);

const Search = () => (
  <TitleWrapper messageId="general.pageTitles.search">
    <SearchView />
  </TitleWrapper>
);

const Unit = () => (
  <TitleWrapper messageId="general.pageTitles.unit">
    <UnitView />
  </TitleWrapper>
);

const Service = () => (
  <TitleWrapper messageId="general.pageTitles.service">
    <ServiceView />
  </TitleWrapper>
);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLoad: true,
    };
  }

  componentDidMount() {
    this.setState({ initialLoad: false });
  }

  componentWillUpdate() {
    const { initialLoad } = this.state;
    if (!initialLoad) {
      const titleElem = document.getElementById('view-title');
      if (titleElem) {
        titleElem.focus();
      }
    }
  }

  render() {
    return (
      <div className="Sidebar" style={{ height: '100%' }}>
        <Switch>
          <Route path="/:lng/unit/:unit" component={Unit} />
          <Route path="/:lng/search" component={Search} />
          <Route path="/:lng/service/:service" component={Service} />
          <Route path="/:lng/map" component={MobileMapView} />
          <Route path="/:lng/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default Sidebar;
