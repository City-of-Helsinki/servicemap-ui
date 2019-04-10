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
    textPaths: [[]],
  },
  OPENING_HOURS_LINK: {
    icon: <HoursIcon />,
    link: true,
    urlPath: [['www']],
    textPaths: [['name']],
  },
  OPENING_HOURS: {
    icon: <HoursIcon />,
    link: false,
    textPaths: [['name']],
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
    urlPath: [['www']],
    textPaths: [['name']],
  },
  ESERVICE_LINK: {
    icon: <OpenLinkIcon />,
    link: true,
    urlPath: [['www']],
    textPaths: [['name']],
  },
  CONTACT: {
    icon: <PersonIcon />,
    link: true,
    urlPath: null,
    textPaths: [['name'], ['contact_person'], ['phone']],
  },
  SERVICE: {
    icon: <ServiceIcon />,
    link: false,
    urlPath: null,
    textPaths: [['name']],
    periodPath: [['period']],
  },
};

export default itemData;
