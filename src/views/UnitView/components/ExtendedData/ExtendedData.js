import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { useParams } from 'react-router-dom';
import EventItem from '../../../../components/ListItems/EventItem';
import PaginatedList from '../../../../components/Lists/PaginatedList';
import TitleBar from '../../../../components/TitleBar';
import Loading from '../../../../components/Loading/Loading';
import ReservationItem from '../../../../components/ListItems/ReservationItem';

const ExtendedData = ({
  currentUnit, events, fetchSelectedUnit, fetchReservations, fetchUnitEvents, getLocaleText, reservations, intl, type,
}) => {
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

  const renderTitleBar = messageID => (
    <TitleBar
      title={(
        <>
          {`${title} - `}
          <FormattedMessage id={messageID} />
        </>
      )}
      backButton
      className="ExtendedData-title"
    />
  );

  const renderEvents = () => {
    const {
      count, data, isFetching, max,
    } = events;

    const renderLoader = () => {
      if (isFetching) {
        const progress = count ? Math.floor((count / max * 100)) : 0;
        const loadingText = intl && max ? intl.formatMessage({ id: 'loading.events' }, { count, max }) : null;
        return <Loading text={loadingText} progress={progress} />;
      }
      return null;
    };
    return (
      <>
        {
          renderTitleBar('unit.events')
        }
        <PaginatedList
          id="events"
          data={data || []}
          customComponent={event => (
            <EventItem key={event.id} event={event} />
          )}
          titleComponent="h3"
        />
        {
          isFetching
          && renderLoader()
        }
      </>
    );
  };

  const renderReservations = () => {
    const {
      count, data, isFetching, max,
    } = reservations;

    const renderLoader = () => {
      if (isFetching) {
        const progress = count ? Math.floor((count / max * 100)) : 0;
        const loadingText = intl && max ? intl.formatMessage({ id: 'loading.events' }, { count, max }) : null;
        return <Loading text={loadingText} progress={progress} />;
      }
      return null;
    };
    return (
      <>
        {
          renderTitleBar('unit.reservations')
        }
        <PaginatedList
          id="reservations"
          data={data || []}
          customComponent={item => (
            <ReservationItem key={item.id} reservation={item} />
          )}
          titleComponent="h3"
        />
        {
          isFetching
          && renderLoader()
        }
      </>
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
  intl: intlShape,
};

export default injectIntl(ExtendedData);
