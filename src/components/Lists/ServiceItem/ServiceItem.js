import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SimpleListItem from '../../SimpleListItem';
import { drawServiceIcon } from '../../../views/Map/utils/drawIcon';
import { generatePath } from '../../../utils/path';
import { getLocaleString } from '../../../redux/selectors/locale';
import { uppercaseFirst } from '../../../utils';

const ServiceItem = (props) => {
  const {
    service, getLocaleText, history, match,
  } = props;

  const { params } = match;
  const lng = params && params.lng;
  return (
    <SimpleListItem
      button
      text={uppercaseFirst(getLocaleText(service.name))}
      icon={<img alt="" src={drawServiceIcon()} style={{ height: 24 }} aria-hidden="true" />}
      handleItemClick={(e) => {
        e.preventDefault();
        if (history) {
          history.push(generatePath('service', lng, service.id));
        }
      }}
      role="link"
      component="li"
    />
  );
};

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
  };
};

export default withRouter(connect(
  mapStateToProps,
  null,
)(ServiceItem));

ServiceItem.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

ServiceItem.defaultProps = {
};
