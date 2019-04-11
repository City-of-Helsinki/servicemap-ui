import React from 'react';
import OpenLinkIcon from '@material-ui/icons/OpenInNew';
import AddressIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import HoursIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import ServiceIcon from '@material-ui/icons/Reorder';
import InfoIcon from '@material-ui/icons/PriorityHigh';
import WarningIcon from '@material-ui/icons/Warning';

const getItemIconData = (type, data) => {
  if (data.www) {
    return <OpenLinkIcon />;
  } if (type === 'ADDRESS') {
    return <AddressIcon />;
  } if (type === 'OPENING_HOURS' || type === 'OPENING_HOURS_LINK') {
    return <HoursIcon />;
  } if (type === 'PHONE') {
    return <PhoneIcon />;
  } if (type === 'PHONE_OR_EMAIL') {
    return <PersonIcon />;
  } if (type === 'SERVICE') {
    return <ServiceIcon />;
  } if (type === 'OTHER_INFO') {
    return <InfoIcon />;
  }
  return <WarningIcon />;
};

export default getItemIconData;
