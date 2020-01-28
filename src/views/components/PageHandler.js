import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { uppercaseFirst } from '../../utils';
import { setCurrentPage } from '../../redux/actions/user';
import { getLocaleString } from '../../redux/selectors/locale';
import HeadModifier from '../../utils/headModifier';

class PageHandler extends React.Component {
  componentDidMount() {
    const { page, setCurrentPage } = this.props;
    // Save current page to redux
    setCurrentPage(page);
  }

  // Modify html head
  render() {
    const {
      intl, messageId, page, unit, service, event, getLocaleText,
    } = this.props;
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
      <HeadModifier>
        <title>{title}</title>
      </HeadModifier>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedUnit, service, event } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit: selectedUnit.unit.data,
    service: service.current,
    event,
    getLocaleText,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { setCurrentPage },
)(PageHandler));


PageHandler.propTypes = {
  intl: intlShape.isRequired,
  messageId: PropTypes.string,
  page: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  event: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

PageHandler.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
  event: null,
};
