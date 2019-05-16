import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { drawServiceIcon } from '../../../views/Map/utils/drawIcon';
import { generatePath } from '../../../utils/path';
import { getLocaleString } from '../../../redux/selectors/locale';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import { setNewCurrentService } from '../../../redux/actions/services';

class ServiceItem extends React.Component {
  state = {
    icon: <img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />,
  };

  componentDidMount() {
    this.setState({ icon: <img alt="" src={drawServiceIcon()} style={{ height: 24 }} aria-hidden="true" /> });
  }

  render() {
    const {
      currentService, service, getLocaleText, history, match, setNewCurrentService,
    } = this.props;
    const { icon } = this.state;
    const { params } = match;
    const lng = params && params.lng;
    let text = getLocaleText(service.name);

    if (service.period) {
      text += ` ${service.period[0]}-${service.period[1]}`;
    }
    return (
      <SimpleListItem
        button
        text={uppercaseFirst(text)}
        icon={icon}
        divider
        handleItemClick={(e) => {
          e.preventDefault();
          if (!currentService || currentService.id !== service.id) {
            setNewCurrentService(service);
          }
          if (history) {
            history.push(generatePath('service', lng, service.id));
          }
        }}
        role="link"
      />
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const { current } = state.service;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    currentService: current,
    getLocaleText,
  };
};

export default withRouter(connect(
  mapStateToProps,
  { setNewCurrentService },
)(ServiceItem));

ServiceItem.propTypes = {
  currentService: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  setNewCurrentService: PropTypes.func.isRequired,
};

ServiceItem.defaultProps = {
  currentService: null,
};
