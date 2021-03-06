import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../../components/Lists/TitledList';
import EventItem from '../../../../components/ListItems/EventItem';

const Events = ({
  unit,
  eventsData,
  listLength,
  navigator,
}) => {
  const {
    data, isFetching, max,
  } = eventsData;

  const location = useLocation();

  if (!data) {
    return null;
  }
  const endIndex = listLength > data.length ? data.length : listLength;
  const shownData = data && data.length ? data.slice(0, endIndex) : null;

  const onButtonClick = max > listLength ? () => {
    if (navigator) {
      navigator.replace({
        ...location,
        hash: 'UnitEventsButton',
      });
      navigator.push('unit', { id: unit.id, type: 'events' });
    }
  } : null;

  if (unit && shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={<FormattedMessage id="unit.events" />}
          subtitle={<FormattedMessage id="unit.events.count" values={{ count: max }} />}
          titleComponent="h4"
          buttonMessageID="unit.events.more"
          loading={isFetching}
          buttonID="UnitEventsButton"
          onButtonClick={onButtonClick}
        >
          {shownData.map(event => (
            <EventItem simpleItem key={event.id} event={event} />
          ))}
        </TitledList>
      </div>
    );
  } return (
    null
  );
};

Events.propTypes = {
  eventsData: PropTypes.objectOf(PropTypes.any).isRequired,
  unit: PropTypes.objectOf(PropTypes.any),
  listLength: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
};

Events.defaultProps = {
  navigator: null,
  unit: null,
  listLength: 5,
};

export default Events;
