import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import SearchView from '../SearchView';
import UnitView from '../UnitView';
import HomeView from '../HomeView';
import ServiceView from '../ServiceView';
import MobileMapView from '../MobileMapView';
import ViewTitle from '../components/ViewTitle/ViewTitle';
import HeadInfo from '../components/HeadInfo';

const TitleWrapper = ({ children, messageId }) => (
  <>
    <ViewTitle messageId={messageId} />
    {children}
  </>
);

const HeadWrapper = ({ children, headMsgId, page }) => (
  <>
    <HeadInfo messageId={headMsgId} page={page} />
    {children}
  </>
);

TitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  messageId: PropTypes.string.isRequired,
};

HeadWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  headMsgId: PropTypes.string,
  page: PropTypes.string,
};

HeadWrapper.defaultProps = {
  headMsgId: null,
  page: null,
};

const Home = () => (
  <TitleWrapper messageId="general.pageTitles.home">
    <HeadWrapper headMsgId="app.title">
      <HomeView />
    </HeadWrapper>
  </TitleWrapper>
);

const Search = () => (
  <TitleWrapper messageId="general.pageTitles.search">
    <HeadWrapper headMsgId="search.results.title">
      <SearchView />
    </HeadWrapper>
  </TitleWrapper>
);

const Unit = () => (
  <TitleWrapper messageId="general.pageTitles.unit">
    <HeadWrapper headMsgId="" page="unit">
      <UnitView />
    </HeadWrapper>
  </TitleWrapper>
);

const Service = () => (
  <TitleWrapper messageId="general.pageTitles.service">
    <HeadWrapper headMsgId="" page="service">
      <ServiceView />
    </HeadWrapper>
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
