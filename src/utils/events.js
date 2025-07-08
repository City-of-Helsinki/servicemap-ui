const formatEventDate = (event, intl) => {
  if (!event.start_time || !event.end_time) return '';
  const timeString = intl.formatMessage({ id: 'general.time.short' });
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const startDate = intl.formatDate(start, {
    month: 'numeric',
    day: 'numeric',
  });
  const endDate = intl.formatDate(end, { month: 'numeric', day: 'numeric' });
  const startTime = `${timeString} ${intl.formatTime(start)}`;
  const startWeekDay = intl.formatDate(start, { weekday: 'short' });

  if (startDate !== endDate) {
    return `${startDate}–${endDate}`;
  }
  let dateString = `${startWeekDay} ${startDate} ${startTime}`;
  // Check how many days to start of event. Returns number of days or "today"/"tomorrow"
  const oneDay = 86400000; // day in milliseconds
  const dayDifference = Math.round(Math.abs((new Date() - start) / oneDay));
  const daysTo = intl.formatRelativeTime(dayDifference, 'day', {
    numeric: 'auto',
  });
  // Check if string has numbers. If false, means that value is either "today" or "tomorrow"
  if (!/\d/.test(daysTo)) {
    // Instead of date, display "today" or "tomorrow"
    dateString = `${daysTo} ${startTime}`;
  }
  return dateString;
};

export default formatEventDate;
