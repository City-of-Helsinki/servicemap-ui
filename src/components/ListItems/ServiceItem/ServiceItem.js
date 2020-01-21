import React from 'react';
import PropTypes from 'prop-types';
import { drawServiceIcon } from '../../../views/MapView/utils/drawIcon';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';

class ServiceItem extends React.Component {
  state = {
    icon: <img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />,
  };

  componentDidMount() {
    const { classes } = this.props;
    this.setState({ icon: <img alt="" src={drawServiceIcon()} className={classes.icon} aria-hidden="true" /> });
  }

  render() {
    const {
      currentService, service, getLocaleText, navigator, setNewCurrentService, link,
    } = this.props;
    const { icon } = this.state;
    let text = getLocaleText(service.name);

    if (service.clarification) {
      text += `: ${getLocaleText(service.clarification)}`;
    }

    const onClick = link ? (e) => {
      e.preventDefault();

      if (!currentService || currentService.id !== service.id) {
        setNewCurrentService(service);
      }
      if (navigator) {
        navigator.push('service', service.id);
      }
    } : null;

    return (
      <SimpleListItem
        button={link}
        text={uppercaseFirst(text)}
        icon={icon}
        divider
        handleItemClick={onClick}
      />
    );
  }
}

export default ServiceItem;

ServiceItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentService: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  setNewCurrentService: PropTypes.func.isRequired,
  link: PropTypes.bool,
};

ServiceItem.defaultProps = {
  currentService: null,
  navigator: null,
  link: true,
};
