import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getIcon } from '../../SMIcon';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import useLocaleText from '../../../utils/useLocaleText';

const ServiceItem = (props) => {
  const {
    currentService, service, navigator, setNewCurrentService, link, classes, divider,
  } = props;
  const [icon, setIcon] = useState(<img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />);
  const getLocaleText = useLocaleText();


  useEffect(() => {
    setIcon(getIcon('serviceDark', { className: classes.icon }));
  }, []);


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
  const role = link ? 'link' : null;

  return (
    <SimpleListItem
      key={service.id}
      button={link}
      role={role}
      text={uppercaseFirst(text)}
      icon={icon}
      divider={divider}
      handleItemClick={onClick}
    />
  );
};

export default ServiceItem;

ServiceItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentService: PropTypes.objectOf(PropTypes.any),
  navigator: PropTypes.objectOf(PropTypes.any),
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  setNewCurrentService: PropTypes.func.isRequired,
  link: PropTypes.bool,
  divider: PropTypes.bool,
};

ServiceItem.defaultProps = {
  currentService: null,
  navigator: null,
  link: true,
  divider: true,
};
