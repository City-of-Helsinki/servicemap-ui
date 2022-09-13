import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getIcon } from '../../SMIcon';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import useLocaleText from '../../../utils/useLocaleText';
import { setNewCurrentService } from '../../../redux/actions/services';

const ServiceItem = (props) => {
  const {
    service, classes, divider, link, navigator,
  } = props;
  const [icon, setIcon] = useState(<img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />);
  const getLocaleText = useLocaleText();
  const dispatch = useDispatch();
  const currentService = useSelector(state => state.service.current);


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
      dispatch(setNewCurrentService(service));
    }
    if (navigator) {
      navigator.push('service', service.id);
    }
  } : null;

  const role = link ? 'link' : null;


  return (
    <SimpleListItem
      key={service.id}
      text={uppercaseFirst(text)}
      icon={icon}
      divider={divider}
      button={link}
      role={role}
      handleItemClick={onClick}
    />
  );
};

export default ServiceItem;

ServiceItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  divider: PropTypes.bool,
  link: PropTypes.bool,
  navigator: PropTypes.objectOf(PropTypes.any),
};

ServiceItem.defaultProps = {
  navigator: null,
  divider: true,
  link: true,
};
