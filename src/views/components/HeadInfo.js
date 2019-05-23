import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { uppercaseFirst } from '../../utils';
import { getLocaleString } from '../../redux/selectors/locale';

// This can be used to modify HTML head elements.
const HeadInfo = ({
  intl, messageId, page, unit, service, getLocaleText,
}) => {
  const message = messageId ? intl.formatMessage({ id: messageId }) : '';
  let pageMessage = '';

  // Add unit or service name to title if needed
  if (page === 'unit' && unit && unit.name) {
    pageMessage = getLocaleText(unit.name);
  } if (page === 'service' && service && service.name) {
    pageMessage = getLocaleText(service.name);
  }
  const title = `${message} ${uppercaseFirst(pageMessage)}`;

  return (
    <Helmet>
      {title && title.length > 1 && (
        <title>{title}</title>
      )}
    </Helmet>
  );
};

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
  null,
)(HeadInfo));


HeadInfo.propTypes = {
  intl: intlShape.isRequired,
  messageId: PropTypes.string,
  page: PropTypes.string,
  unit: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

HeadInfo.defaultProps = {
  messageId: 'app.title',
  page: null,
  unit: null,
  service: null,
};
