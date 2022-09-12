import React from 'react';
import OpenLinkIcon from '@mui/icons-material/OpenInNew';
import AddressIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HoursIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ServiceIcon from '@mui/icons-material/Reorder';
import InfoIcon from '@mui/icons-material/PriorityHigh';
import WarningIcon from '@mui/icons-material/Warning';
import RouteIcon from '@mui/icons-material/DirectionsBus';

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
