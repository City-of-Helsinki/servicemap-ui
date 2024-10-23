import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLocaleText from '../../../../utils/useLocaleText';
import {
  EventItem,
  Loading,
  PaginatedList,
  ReservationItem,
  ServiceItem,
  TitleBar,
} from '../../../../components';

const ExtendedData = ({
  currentUnit = null,
  events,
  fetchSelectedUnit,
  fetchReservations,
  fetchUnitEvents,
  reservations,
  type,
}) => {
  const getLocaleText = useLocaleText();
  const selectedUnit = useSelector(state => state.selectedUnit?.unit?.data);
  const intl = useIntl();
  const { unit, period } = useParams();
  const title = currentUnit && currentUnit.name ? getLocaleText(currentUnit.name) : '';

  useEffect(() => {
    if (!currentUnit || !currentUnit.id) {
      fetchSelectedUnit(unit);
    }
    if (unit && type) {
      switch (type) {
        case 'events':
          fetchUnitEvents(unit, 50, true);
          break;
        case 'reservations':
          fetchReservations(unit, 20, true);
          break;
        default:
      }
    }

    const title = document.getElementsByClassName('ExtendedData-title')[0];
    try {
      title.firstChild.focus();
    } catch (e) {
      console.error('ExtendedData component: Unable to focus to title button');
    }
  }, []);

  const getTitleText = messageID => `${title} - ${intl.formatMessage({ id: messageID })}`;

  const renderTitleBar = messageID => (
    <TitleBar
      sticky
      title={(
        <>
          {getTitleText(messageID)}
        </>
      )}
      titleComponent="h3"
      backButton
      className="ExtendedData-title"
    />
  );

  const renderServices = () => {
    const data = selectedUnit.services;
    const titleText = intl.formatMessage({ id: 'unit.services' });
    const srTitle = `${title} ${titleText}`;
    return (
      <div>
        {
          renderTitleBar('unit.services')
        }
        <PaginatedList
          id="services"
          data={data || []}
          customComponent={service => (
            <ServiceItem key={service.id} service={service} />
          )}
          srTitle={srTitle}
          title={titleText}
          titleComponent="h3"
        />
      </div>
    );
  };

  const renderEducationServices = () => {
    const data = selectedUnit.services.filter((unit) => {
      if (unit.period) {
        // Show only units that have correct period data
        const unitPeriod = `${unit.period[0]}–${unit.period[1]}`;
        if (period && period === unitPeriod) return true;
      }
      return false;
    });

    const titleText = intl.formatMessage({ id: 'unit.educationServices' });
    const srTitle = `${title} ${titleText}`;
    return (
      <div>
        {
          renderTitleBar('unit.educationServices')
        }
        <PaginatedList
          id="educationServices"
          data={data || []}
          customComponent={service => (
            <ServiceItem key={service.id} service={service} />
          )}
          srTitle={srTitle}
          title={titleText}
          titleComponent="h3"
        />
      </div>
    );
  };

  const renderEvents = () => {
    const { data } = events;
    const titleText = intl.formatMessage({ id: 'unit.events' });
    const srTitle = `${title} ${titleText}`;

    return (
      <div>
        {
          renderTitleBar('unit.events')
        }
        <Loading reducer={events}>
          <PaginatedList
            id="events"
            data={data || []}
            customComponent={event => (
              <EventItem simpleItem key={event.id} event={event} />
            )}
            srTitle={srTitle}
            title={titleText}
            titleComponent="h3"
          />
        </Loading>
      </div>
    );
  };

  const renderReservations = () => {
    const { data } = reservations;
    const titleText = intl.formatMessage({ id: 'unit.reservations' });
    const srTitle = `${title} ${titleText}`;

    return (
      <div>
        {
          renderTitleBar('unit.reservations')
        }
        <Loading reducer={reservations}>
          <PaginatedList
            id="reservations"
            data={data || []}
            customComponent={item => (
              <ReservationItem key={item.id} reservation={item} />
            )}
            srTitle={srTitle}
            title={titleText}
            titleComponent="h3"
          />
        </Loading>
      </div>
    );
  };
  switch (type) {
    case 'services':
      return renderServices();
    case 'educationServices':
      return renderEducationServices();
    case 'events':
      return renderEvents();
    case 'reservations':
      return renderReservations();
    default:
  }
  return null;
};

ExtendedData.propTypes = {
  events: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUnit: PropTypes.objectOf(PropTypes.any),
  fetchSelectedUnit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  fetchReservations: PropTypes.func.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  reservations: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ExtendedData;
