import PropTypes from 'prop-types';
import React from 'react';
import { Route, Routes } from 'react-router';

import { ErrorTrigger } from '../../../components';
import AddressView from '../../../views/AddressView';
import AreaView from '../../../views/AreaView';
import DivisionView from '../../../views/DivisionView';
import EventDetailView from '../../../views/EventDetailView';
import FeedbackView from '../../../views/FeedbackView';
import HomeView from '../../../views/HomeView';
import InfoView from '../../../views/InfoView';
import SearchView from '../../../views/SearchView';
import ServiceTreeView from '../../../views/ServiceTreeView';
import ServiceView from '../../../views/ServiceView';
import UnitView from '../../../views/UnitView';
import ExtendedData from '../../../views/UnitView/components/ExtendedData';
import PageHandler from '../PageHandler';
import ViewTitle from './ViewTitle';

function TitleWrapper({ children, messageId }) {
  return (
    <>
      <ViewTitle messageId={messageId} />
      {children}
    </>
  );
}

function PageWrapper({ children, headMsgId = null, page = null }) {
  return (
    <>
      <PageHandler messageId={headMsgId} page={page} />
      {children}
    </>
  );
}

TitleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  messageId: PropTypes.string.isRequired,
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  headMsgId: PropTypes.string,
  page: PropTypes.string,
};

function Home() {
  return (
    <TitleWrapper messageId="general.pageTitles.home">
      <PageWrapper headMsgId="" page="home">
        <HomeView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Search() {
  return (
    <TitleWrapper messageId="general.pageTitles.search">
      <PageWrapper headMsgId="search.results.title" page="search">
        <SearchView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Unit() {
  return (
    <TitleWrapper messageId="general.pageTitles.unit">
      <PageWrapper headMsgId="" page="unit">
        <UnitView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function UnitServices() {
  return (
    <TitleWrapper messageId="general.pageTitles.unit.services">
      <PageWrapper headMsgId="general.pageTitles.unit.services" page="unit">
        <ExtendedData type="services" />
      </PageWrapper>
    </TitleWrapper>
  );
}
function UnitEducationServices() {
  return (
    <TitleWrapper messageId="general.pageTitles.unit.services">
      <PageWrapper headMsgId="general.pageTitles.unit.services" page="unit">
        <ExtendedData type="educationServices" />
      </PageWrapper>
    </TitleWrapper>
  );
}
function UnitEvents() {
  return (
    <TitleWrapper messageId="general.pageTitles.unit.events">
      <PageWrapper headMsgId="general.pageTitles.unit.events" page="unit">
        <ExtendedData type="events" />
      </PageWrapper>
    </TitleWrapper>
  );
}
function UnitReservations() {
  return (
    <TitleWrapper messageId="general.pageTitles.unit.reservations">
      <PageWrapper headMsgId="general.pageTitles.unit.reservations" page="unit">
        <ExtendedData type="reservations" />
      </PageWrapper>
    </TitleWrapper>
  );
}
function UnitFeedback() {
  return (
    <TitleWrapper messageId="general.pageTitles.feedback">
      <PageWrapper headMsgId="general.pageTitles.feedback" page="unit">
        <FeedbackView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Service() {
  return (
    <TitleWrapper messageId="general.pageTitles.service">
      <PageWrapper headMsgId="" page="service">
        <ServiceView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Event() {
  return (
    <TitleWrapper messageId="general.pageTitles.event">
      <PageWrapper headMsgId="" page="event">
        <EventDetailView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Address() {
  return (
    <TitleWrapper messageId="general.pageTitles.address">
      <PageWrapper headMsgId="" page="address">
        <AddressView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function ServiceTree() {
  return (
    <TitleWrapper messageId="general.pageTitles.serviceTree">
      <PageWrapper
        headMsgId="general.pageTitles.serviceTree.title"
        page="serviceTree"
      >
        <ServiceTreeView variant="ServiceTree" />
      </PageWrapper>
    </TitleWrapper>
  );
}

function MobilityTree() {
  return (
    <TitleWrapper messageId="general.pageTitles.mobilityTree">
      <PageWrapper
        headMsgId="general.pageTitles.mobilityTree.title"
        page="mobilityTree"
      >
        <ServiceTreeView variant="MobilityTree" />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Info() {
  return (
    <TitleWrapper messageId="general.pageTitles.info">
      <PageWrapper headMsgId="general.pageTitles.info" page="info">
        <InfoView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Feedback() {
  return (
    <TitleWrapper messageId="general.pageTitles.feedback">
      <PageWrapper headMsgId="general.pageTitles.feedback" page="feedback">
        <FeedbackView />
      </PageWrapper>
    </TitleWrapper>
  );
}

function Area() {
  return (
    <TitleWrapper messageId="general.pageTitles.area">
      <PageWrapper headMsgId="general.pageTitles.area" page="area">
        <AreaView />
      </PageWrapper>
    </TitleWrapper>
  );
}

class ViewRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Routes>
        <Route path="/:lng/unit/:unit/feedback" element={<UnitFeedback />} />
        <Route path="/:lng/unit/:unit/events" element={<UnitEvents />} />
        <Route path="/:lng/unit/:unit/reservations" element={<UnitReservations />} />
        <Route path="/:lng/unit/:unit/services" element={<UnitServices />} />
        <Route path="/:lng/unit/:unit/educationServices/:period?" element={<UnitEducationServices />} />
        <Route path="/:lng/unit/:unit" element={<Unit />} />
        <Route path="/:lng/search" element={<Search />} />
        <Route path="/:lng/services" element={<ServiceTree />} />
        <Route path="/:lng/mobility" element={<MobilityTree />} />
        <Route path="/:lng/service/:service" element={<Service />} />
        <Route path="/:lng/event/:event" element={<Event />} />
        <Route path="/:lng/address/:municipality/:street" element={<Address />} />
        <Route path="/:lng/feedback/" element={<Feedback />} />
        <Route path="/:lng/area/" element={<Area />} />
        <Route path="/:lng/division/:city?/:area?" element={
          <>
            <PageHandler page="division" />
            <DivisionView />
            <HomeView />
          </>
        } />
        <Route path="/:lng/info/:page?" element={<Info />} />
        <Route path="/:lng/" element={<Home />} />
        <Route path="*" element={<ErrorTrigger error="badUrl" />} />
      </Routes>
    );
  }
}

export default ViewRouter;
