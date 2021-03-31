import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { uppercaseFirst } from '../../../utils';
import getPageDescriptions from './pageDescriptions';

class PageHandler extends React.Component {
  componentDidMount() {
    const { page, setCurrentPage } = this.props;
    // Save current page to redux
    setCurrentPage(page);
  }

  // Modify html head
  render() {
    const {
      intl, messageId, page, unit, service, event, address, getLocaleText,
    } = this.props;
    const message = messageId ? intl.formatMessage({ id: messageId }) : '';
    let pageMessage = '';
    const pageDescription = getPageDescriptions(page, unit, address, getLocaleText, intl);

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
        <meta name="description" content={pageDescription} />
      </Helmet>
    );
  }
}

PageHandler.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  messageId: PropTypes.string,
  page: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  event: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any),
  address: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

PageHandler.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
  event: null,
  address: null,
};

export default PageHandler;
