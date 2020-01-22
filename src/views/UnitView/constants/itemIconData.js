import React from 'react';
import OpenLinkIcon from '@material-ui/icons/OpenInNew';
import AddressIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import HoursIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import ServiceIcon from '@material-ui/icons/Reorder';
import InfoIcon from '@material-ui/icons/PriorityHigh';
import WarningIcon from '@material-ui/icons/Warning';
import RouteIcon from '@material-ui/icons/DirectionsBus';

const getItemIconData = (type, data) => {
  if (type === 'LINK' || type === 'ESERVICE_LINK' || (type === 'OPENING_HOURS' && data.www)) {
    return <OpenLinkIcon />;
  } if (type === 'ADDRESS') {
    return <AddressIcon />;
  } if (type === 'OPENING_HOURS') {
    return <HoursIcon />;
  } if (type === 'PHONE') {
    return <PhoneIcon />;
  } if (type === 'EMAIL') {
    return <EmailIcon />;
  } if (type === 'PHONE_OR_EMAIL') {
    return <PersonIcon />;
  } if (type === 'SERVICE') {
    return <ServiceIcon />;
  } if (type === 'OTHER_INFO') {
    return <InfoIcon />;
  } if (type === 'ROUTE') {
    return <RouteIcon />;
  }
  return <WarningIcon />;
};

export default getItemIconData;
