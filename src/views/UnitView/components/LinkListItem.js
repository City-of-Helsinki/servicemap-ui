import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import OpenLinkIcon from '@material-ui/icons/OpenInNew';
import AddressIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import HoursIcon from '@material-ui/icons/AccessTime';
import PersonIcon from '@material-ui/icons/Person';
import ServiceIcon from '@material-ui/icons/Reorder';

import { withStyles } from '@material-ui/core';
import listStyles from '../listStyles';

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
  },
};

const getItem = id => itemData[id];

const returnValue = (path, data) => {
  if (path.length > 1) {
    let fullText = '';
    path.forEach((item) => {
      const text = item.reduce((obj, key) => obj[key], data.value);
      fullText += `${text}, `;
    });
    return fullText;
  }
  return path[0].reduce((obj, key) => obj[key], data.value);
};

const LinkListItem = (props) => {
  const { data, classes } = props;
  const item = getItem(data.type);
  if (data.value && data.type) {
    return (
      <ListItem
        button={!!item.link}
        component={item.link ? 'a' : null}
        onClick={() => {
          if (item.link) {
            if (item.urlPath) {
              window.open(returnValue(item.urlPath, data));
            } else {
              console.log('call number');
            }
          }
        }}
        classes={{
          root: classes.listItem,
        }}
      >
        <ListItemIcon className={`${classes.listIcon} ${item.link ? classes.link : null}`}>
          {item.icon}
        </ListItemIcon>

        <ListItemText
          classes={{
            root: classes.textContainer,
            primary: `${classes.listLinkText} ${item.link ? classes.link : null}`,
          }}
        >
          {returnValue(item.textPaths, data)}
          {' '}
          {item.urlPath ? <FormattedMessage id="unit.opens.new.tab" /> : null}
          {!item.urlPath && item.link ? <FormattedMessage id="unit.call.number" /> : null}
        </ListItemText>

      </ListItem>
    );
  }
  return (
    null);
};

export default withStyles(listStyles)(LinkListItem);

LinkListItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};
