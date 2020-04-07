/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Event } from '@material-ui/icons';
import ResultItem from '../ResultItem';

const formatEventDate = (event, intl) => {
  const timeString = intl.formatMessage({ id: 'general.time.short' });
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const startDate = intl.formatDate(start, { month: 'numeric', day: 'numeric' });
  const endDate = intl.formatDate(end, { month: 'numeric', day: 'numeric' });
  const startTime = `${timeString} ${intl.formatTime(start)}`;
  const startWeekDay = intl.formatDate(start, { weekday: 'short' });

  if (startDate !== endDate) {
    return `${startDate}–${endDate}`;
  }
  let dateString = `${startWeekDay} ${startDate} ${startTime}`;
  // Check how many days to start of event. Returns number of days or "today"/"tomorrow"
  const daysTo = intl.formatRelativeTime(start, 'day');
  // Check if string has numbers. If false, means that value is either "today" or "tomorrow"
  if (!/\d/.test(daysTo)) {
    // Instead of date, display "today" or "tomorrow"
    dateString = `${daysTo} ${startTime}`;
  }
  return dateString;
};

const EventItem = ({
  changeSelectedEvent,
  event,
  getLocaleText,
  intl,
  navigator,
}) => {
  const dateString = formatEventDate(event, intl);
  return (
    <ResultItem
      key={event.id}
      icon={<Event />}
      title={getLocaleText(event.name)}
      subtitle={dateString}
      divider
      onClick={(e) => {
        e.preventDefault();
        if (navigator) {
          changeSelectedEvent(event);
          navigator.push('event', event.id);
        }
      }}
    />
  );
};

export default EventItem;

// Typechecking
EventItem.propTypes = {
  changeSelectedEvent: PropTypes.func.isRequired,
  event: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
};

EventItem.defaultProps = {
  navigator: null,
};
