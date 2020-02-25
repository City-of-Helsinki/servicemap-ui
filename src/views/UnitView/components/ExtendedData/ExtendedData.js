import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { useParams } from 'react-router-dom';
import EventItem from '../../../../components/ListItems/EventItem';
import PaginatedList from '../../../../components/Lists/PaginatedList';
import TitleBar from '../../../../components/TitleBar';
import Loading from '../../../../components/Loading/Loading';

const ExtendedData = ({
  events, fetchReservations, fetchUnitEvents, reservations, intl,
}) => {
  const { page, unit } = useParams();

  useEffect(() => {
    if (unit && page) {
      switch (page) {
        case 'events':
          fetchUnitEvents(unit, 50, true);
          break;
        case 'reservations':
          // fetchReservations(unit);
          break;
        default:
      }
    }
  }, []);

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
        <TitleBar title={<FormattedMessage id="unit.events" />} backButton />
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

  // const renderReservations = () => 'Rendering reservations';

  switch (page) {
    case 'events':
      return renderEvents();
    case 'reservations':
      // return renderReservations();
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
