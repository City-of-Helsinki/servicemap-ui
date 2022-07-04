import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getIcon } from '../../SMIcon';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import useLocaleText from '../../../utils/useLocaleText';

const ServiceItem = (props) => {
  const {
    service, classes, divider,
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

  return (
    <SimpleListItem
      key={service.id}
      text={uppercaseFirst(text)}
      icon={icon}
      divider={divider}
    />
  );
};

export default ServiceItem;

ServiceItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  service: PropTypes.objectOf(PropTypes.any).isRequired,
  divider: PropTypes.bool,
};

ServiceItem.defaultProps = {
  divider: true,
};
