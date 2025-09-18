import PropTypes from 'prop-types';
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ErrorTrigger } from '../components';
import UnitFetcher from '../components/DataFetchers/UnitFetcher';
import DefaultLayout from '../layouts';
import PageHandler from '../layouts/components/PageHandler';
import ViewTitle from '../layouts/components/ViewTitle';
import EmbedLayout from '../layouts/EmbedLayout';
import AddressView from '../views/AddressView';
import AreaView from '../views/AreaView';
import DivisionView from '../views/DivisionView';
import EmbedderView from '../views/EmbedderView';
import EventDetailView from '../views/EventDetailView';
import FeedbackView from '../views/FeedbackView';
import HomeView from '../views/HomeView';
import InfoView from '../views/InfoView';
import SearchView from '../views/SearchView';
import ServiceTreeView from '../views/ServiceTreeView';
import ServiceView from '../views/ServiceView';
import UnitView from '../views/UnitView';
import ExtendedData from '../views/UnitView/components/ExtendedData';

// Route element helper functions
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

// Default layout route elements
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
        <UnitFetcher>
          <FeedbackView />
        </UnitFetcher>
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
      <PageWrapper headMsgId="" page="info">
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

function Division() {
  return (
    <>
      <PageHandler page="division" />
      <DivisionView />
      <HomeView />
    </>
  );
}

function ErrorRoute() {
  return <ErrorTrigger error="badUrl" />;
}

// Embed layout route elements
function UnitEmbed() {
  return (
    <>
      <PageHandler embed page="unit" />
      <UnitView embed />
    </>
  );
}

function EventEmbed() {
  return (
    <>
      <PageHandler embed page="event" />
      <EventDetailView embed />
    </>
  );
}

function SearchEmbed() {
  return (
    <>
      <PageHandler embed page="search" />
      <SearchView embed />
    </>
  );
}

function ServiceEmbed() {
  return (
    <>
      <PageHandler embed page="service" />
      <ServiceView embed />
    </>
  );
}

function AddressEmbed() {
  return (
    <>
      <PageHandler embed page="address" />
      <AddressView embed />
    </>
  );
}

function DivisionEmbed() {
  return (
    <>
      <PageHandler embed page="division" />
      <DivisionView />
    </>
  );
}

function AreaEmbed() {
  return (
    <>
      <PageHandler embed page="area" />
      <AreaView embed />
    </>
  );
}

export const createRouter = (App) =>
  createBrowserRouter([
    {
      path: '/:lng/embedder/*',
      element: <App component={EmbedderView} />,
    },
    {
      path: '/:lng/embed',
      element: <App component={EmbedLayout} />,
      children: [
        { path: 'unit/:unit', element: <UnitEmbed /> },
        { path: 'event/:event', element: <EventEmbed /> },
        { path: 'search', element: <SearchEmbed /> },
        { path: 'service/:service', element: <ServiceEmbed /> },
        { path: 'address/:municipality/:street', element: <AddressEmbed /> },
        { path: 'division/:city?/:area?', element: <DivisionEmbed /> },
        { path: 'area', element: <AreaEmbed /> },
      ],
    },
    {
      path: '/:lng',
      element: <App component={DefaultLayout} />,
      children: [
        { path: 'unit/:unit/feedback', element: <UnitFeedback /> },
        { path: 'unit/:unit/events', element: <UnitEvents /> },
        { path: 'unit/:unit/reservations', element: <UnitReservations /> },
        { path: 'unit/:unit/services', element: <UnitServices /> },
        {
          path: 'unit/:unit/educationServices/:period?',
          element: <UnitEducationServices />,
        },
        { path: 'unit/:unit', element: <Unit /> },
        { path: 'service/:service', element: <Service /> },
        { path: 'event/:event', element: <Event /> },
        { path: 'address/:municipality/:street', element: <Address /> },
        { path: 'division/:city?/:area?', element: <Division /> },
        { path: 'info/:page?', element: <Info /> },
        { path: 'search', element: <Search /> },
        { path: 'services', element: <ServiceTree /> },
        { path: 'mobility', element: <MobilityTree /> },
        { path: 'feedback', element: <Feedback /> },
        { path: 'area', element: <Area /> },
        { path: '', element: <Home /> },
        { path: '*', element: <ErrorRoute /> },
      ],
    },
  ]);
