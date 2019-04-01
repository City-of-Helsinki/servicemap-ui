import React from 'react';
import OpenLinkIcon from '@material-ui/icons/OpenInNew';
import AddressIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import HoursIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import ServiceIcon from '@material-ui/icons/Reorder';

// Data of all list item types
const itemData = {
  ADDRESS: {
    icon: <AddressIcon />,
    link: false,
    urlPath: null,
    textPaths: [['fi']],
  },
  OPENING_HOURS_LINK: {
    icon: <HoursIcon />,
    link: true,
    urlPath: [['www', 'fi']],
    textPaths: [['name', 'fi']],
  },
  OPENING_HOURS: {
    icon: <HoursIcon />,
    link: false,
    textPaths: [['name', 'fi']],
  },
  PHONE: {
    icon: <PhoneIcon />,
    link: true,
    urlPath: null,
    textPaths: [[]],
  },
  LINK: {
    icon: <OpenLinkIcon />,
    link: true,
    urlPath: [['www', 'fi']],
    textPaths: [['name', 'fi']],
  },
  ESERVICE_LINK: {
    icon: <OpenLinkIcon />,
    link: true,
    urlPath: [['www', 'fi']],
    textPaths: [['name', 'fi']],
  },
  CONTACT: {
    icon: <PersonIcon />,
    link: true,
    urlPath: null,
    textPaths: [['name', 'fi'], ['contact_person'], ['phone']],
  },
  SERVICE: {
    icon: <ServiceIcon />,
    link: false,
    urlPath: null,
    textPaths: [['name', 'fi']],
    periodPath: [['period']],
  },
};

export default itemData;
