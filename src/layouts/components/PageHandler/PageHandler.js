import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { uppercaseFirst } from '../../../utils';
import useLocaleText from '../../../utils/useLocaleText';

const PageHandler = (props) => {
  const {
    page, setCurrentPage, intl, messageId, unit, service, event,
  } = props;

  const getLocaleText = useLocaleText();

  useEffect(() => {
    // Save current page to redux
    setCurrentPage(page);
  }, []);

  // Modify html head
  const message = messageId ? intl.formatMessage({ id: messageId }) : '';
  let pageMessage = '';

  // Add unit or service name to title if needed
  if ((page === 'unit' || page === 'eventList') && unit && unit.name) {
    pageMessage = getLocaleText(unit.name);
  } if (page === 'service' && service && service.name) {
    pageMessage = getLocaleText(service.name);
  } if (page === 'event' && event && event.name) {
    pageMessage = getLocaleText(event.name);
  }

  let appTitle = intl.formatMessage({ id: 'app.title' });

  if (message !== '' || pageMessage !== '') {
    appTitle = ` | ${appTitle}`;
  }

  const title = `${uppercaseFirst(pageMessage)} ${message}${appTitle}`;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};


PageHandler.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  messageId: PropTypes.string,
  page: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  event: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any),
  setCurrentPage: PropTypes.func.isRequired,
};

PageHandler.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
  event: null,
};

export default PageHandler;
