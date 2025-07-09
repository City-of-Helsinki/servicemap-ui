import HoursIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/DirectionsBus';
import EmailIcon from '@mui/icons-material/Email';
import AddressIcon from '@mui/icons-material/LocationOn';
import OpenLinkIcon from '@mui/icons-material/OpenInNew';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/PriorityHigh';
import ServiceIcon from '@mui/icons-material/Reorder';
import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';

const getItemIconData = (type, data) => {
  if (
    type === 'LINK' ||
    type === 'ESERVICE_LINK' ||
    (type === 'OPENING_HOURS' && data.www) ||
    (type === 'OPENING_HOUR_OBJECT' && data.www)
  ) {
    return <OpenLinkIcon />;
  }
  if (type === 'ADDRESS') {
    return <AddressIcon />;
  }
  if (type === 'OPENING_HOURS' || type === 'OPENING_HOUR_OBJECT') {
    return <HoursIcon />;
  }
  if (type === 'PHONE') {
    return <PhoneIcon />;
  }
  if (type === 'EMAIL') {
    return <EmailIcon />;
  }
  if (type === 'PHONE_OR_EMAIL') {
    return <PersonIcon />;
  }
  if (type === 'SERVICE') {
    return <ServiceIcon />;
  }
  if (type === 'OTHER_INFO') {
    return <InfoIcon />;
  }
  if (type === 'ROUTE') {
    return <RouteIcon />;
  }
  return <WarningIcon />;
};

export default getItemIconData;
