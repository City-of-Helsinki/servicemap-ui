import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import EventItem from '../../../../components/ListItems/EventItem';
import PaginatedList from '../../../../components/Lists/PaginatedList';
import TitleBar from '../../../../components/TitleBar';
import Loading from '../../../../components/Loading';
import ReservationItem from '../../../../components/ListItems/ReservationItem';

const ExtendedData = ({
  currentUnit,
  events,
  fetchSelectedUnit,
  fetchReservations,
  fetchUnitEvents,
  getLocaleText,
  reservations,
  type,
}) => {
  const intl = useIntl();
  const { unit } = useParams();
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
              <EventItem key={event.id} event={event} />
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
  fetchReservations: PropTypes.func.isRequired,
  fetchUnitEvents: PropTypes.func.isRequired,
  reservations: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ExtendedData;
