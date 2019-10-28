import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import SearchView from '../SearchView';
import UnitView from '../UnitView';
import HomeView from '../HomeView';
import ServiceView from '../ServiceView';
import EventDetailView from '../EventDetailView';
import MobileMapView from '../MobileMapView';
import AddressView from '../AddressView';
import ServiceTreeView from '../ServiceTreeView';
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

const Event = () => (
  <TitleWrapper messageId="general.pageTitles.event">
    <PageWrapper headMsgId="" page="event">
      <EventDetailView />
    </PageWrapper>
  </TitleWrapper>
);

const Address = () => (
  <TitleWrapper messageId="general.pageTitles.address">
    <PageWrapper headMsgId="" page="address">
      <AddressView />
    </PageWrapper>
  </TitleWrapper>
);

const ServiceTree = () => (
  <TitleWrapper messageId="general.pageTitles.serviceTree">
    <PageWrapper headMsgId="" page="serviceTree">
      <ServiceTreeView />
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
      <Switch>
        <Route exact path="/:lng/unit/:unit" component={Unit} />
        <Route path="/:lng/search" component={Search} />
        <Route path="/:lng/services" component={ServiceTree} />
        <Route path="/:lng/service/:service" component={Service} />
        <Route path="/:lng/event/:event" component={Event} />
        <Route path="/:lng/map" component={MobileMapView} />
        <Route path="/:lng/address/:municipality/:street/:number" component={Address} />
        <Route path="/:lng/" component={Home} />
      </Switch>
    );
  }
}

export default Sidebar;
