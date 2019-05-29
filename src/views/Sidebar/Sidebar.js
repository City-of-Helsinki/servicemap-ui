import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import SearchView from '../SearchView';
import UnitView from '../UnitView';
import HomeView from '../HomeView';
import ServiceView from '../ServiceView';
import MobileMapView from '../MobileMapView';
import ViewTitle from '../components/ViewTitle/ViewTitle';
import PageHandler from '../components/PageHandler';

const TitleWrapper = ({ children, messageId }) => (
  <>
    <ViewTitle messageId={messageId} />
    {children}
  </>
);

const PageWrapper = ({ children, headMsgId, page }) => (
  <>
    <PageHandler messageId={headMsgId} page={page} />
    {children}
  </>
);

TitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  messageId: PropTypes.string.isRequired,
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  headMsgId: PropTypes.string,
  page: PropTypes.string,
};

PageWrapper.defaultProps = {
  headMsgId: null,
  page: null,
};

const Home = () => (
  <TitleWrapper messageId="general.pageTitles.home">
    <PageWrapper headMsgId="" page="home">
      <HomeView />
    </PageWrapper>
  </TitleWrapper>
);

const Search = () => (
  <TitleWrapper messageId="general.pageTitles.search">
    <PageWrapper headMsgId="search.results.title" page="search">
      <SearchView />
    </PageWrapper>
  </TitleWrapper>
);

const Unit = () => (
  <TitleWrapper messageId="general.pageTitles.unit">
    <PageWrapper headMsgId="" page="unit">
      <UnitView />
    </PageWrapper>
  </TitleWrapper>
);

const Service = () => (
  <TitleWrapper messageId="general.pageTitles.service">
    <PageWrapper headMsgId="" page="service">
      <ServiceView />
    </PageWrapper>
  </TitleWrapper>
);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
