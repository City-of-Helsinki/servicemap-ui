import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import loadable from '@loadable/component';
import ViewTitle from '../components/ViewTitle/ViewTitle';
import PageHandler from '../components/PageHandler';
import ExtendedData from '../UnitView/components/ExtendedData';

const SearchView = loadable(() => import(/* webpackChunkName: "views" */'../SearchView'));
const UnitView = loadable(() => import(/* webpackChunkName: "views" */'../UnitView'));
const HomeView = loadable(() => import(/* webpackChunkName: "views" */'../HomeView'));
const ServiceView = loadable(() => import(/* webpackChunkName: "views" */'../ServiceView'));
const EventDetailView = loadable(() => import(/* webpackChunkName: "views" */'../EventDetailView'));
const AddressView = loadable(() => import(/* webpackChunkName: "views" */'../AddressView'));
const ServiceTreeView = loadable(() => import(/* webpackChunkName: "views" */'../ServiceTreeView'));
const FeedbackView = loadable(() => import(/* webpackChunkName: "views" */'../FeedbackView'));
const DivisionView = loadable(() => import(/* webpackChunkName: "views" */'../DivisionView'));
const InfoView = loadable(() => import(/* webpackChunkName: "views" */'../InfoView'));

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

const Search = withRouter(({ location }) => {
  const query = new URLSearchParams(location.search).get('q'); // Get query parameter
  return (
    <TitleWrapper messageId="general.pageTitles.search">
      <PageWrapper headMsgId="search.results.title" page="search">
        <SearchView query={query} />
      </PageWrapper>
    </TitleWrapper>
  );
});

const Unit = () => (
  <TitleWrapper messageId="general.pageTitles.unit">
    <PageWrapper headMsgId="" page="unit">
      <UnitView />
    </PageWrapper>
  </TitleWrapper>
);

const UnitEvents = () => (
  <TitleWrapper messageId="general.pageTitles.unit.events">
    <PageWrapper headMsgId="" page="unit">
      <ExtendedData type="events" />
    </PageWrapper>
  </TitleWrapper>
);
const UnitReservations = () => (
  <TitleWrapper messageId="general.pageTitles.unit.reservations">
    <PageWrapper headMsgId="" page="unit">
      <ExtendedData type="reservations" />
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
    <PageWrapper headMsgId="general.pageTitles.serviceTree" page="serviceTree">
      <ServiceTreeView />
    </PageWrapper>
  </TitleWrapper>
);

const Info = () => (
  <TitleWrapper messageId="general.pageTitles.info">
    <PageWrapper headMsgId="" page="info">
      <InfoView />
    </PageWrapper>
  </TitleWrapper>
);

const Feedback = () => (
  <TitleWrapper messageId="general.pageTitles.feedback">
    <PageWrapper headMsgId="" page="feedback">
      <FeedbackView />
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
        <Route exact path="/:lng/unit/:unit/events" component={UnitEvents} />
        <Route exact path="/:lng/unit/:unit/reservations" component={UnitReservations} />
        <Route exact path="/:lng/unit/:unit" component={Unit} />
        <Route path="/:lng/search" component={Search} />
        <Route path="/:lng/services" component={ServiceTree} />
        <Route path="/:lng/service/:service" component={Service} />
        <Route path="/:lng/event/:event" component={Event} />
        <Route path="/:lng/address/:municipality/:street/:number" component={Address} />
        <Route exact path="/:lng/feedback/" component={Feedback} />
        <Route
          path="/:lng/division/:city?/:area?"
          render={() => (
            <>
              <PageHandler page="division" />
              <DivisionView />
              <HomeView />
            </>
          )}
        />
        <Route path="/:lng/info/:page?" component={Info} />
        <Route path="/:lng/" component={Home} />
      </Switch>
    );
  }
}

export default Sidebar;
