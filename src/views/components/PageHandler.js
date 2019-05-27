import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { uppercaseFirst } from '../../utils';
import { setCurrentPage } from '../../redux/actions/user';
import { getLocaleString } from '../../redux/selectors/locale';

class PageHandler extends React.Component {
  componentDidMount() {
    const { page, setCurrentPage } = this.props;
    // Save current page to redux
    setCurrentPage(page);
  }

  // Modify html head
  render() {
    const {
      intl, messageId, page, unit, service, getLocaleText,
    } = this.props;
    const message = messageId ? intl.formatMessage({ id: messageId }) : '';
    let pageMessage = '';

    // Add unit or service name to title if needed
    if (page === 'unit' && unit && unit.name) {
      pageMessage = getLocaleText(unit.name);
    } if (page === 'service' && service && service.name) {
      pageMessage = getLocaleText(service.name);
    }

    let appTitle = intl.formatMessage({ id: 'app.title' });

    if (message !== '' || pageMessage !== '') {
      appTitle = ` | ${appTitle}`;
    }

    const title = `${message}${uppercaseFirst(pageMessage)}${appTitle}`;

    return (
      <Helmet>
        <title>{title}</title>
      </Helmet>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedUnit, service } = state;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit: selectedUnit.data,
    service: service.current,
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
  service: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

PageHandler.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
};
