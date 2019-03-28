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

import { withStyles } from '@material-ui/core';
import listStyles from '../listStyles';

const itemData = {
  ADDRESS: {
    icon: <AddressIcon />,
    link: false,
    urlPath: null,
    textPath: ['fi'],
    extraText: null,
  },
  OPENING_HOURS: {
    icon: <HoursIcon />,
    link: true,
    urlPath: ['www', 'fi'],
    textPath: ['name', 'fi'],
    extraText: <FormattedMessage id="unit.opens.new.tab" />,
  },
  PHONE: {
    icon: <PhoneIcon />,
    link: true,
    urlPath: null,
    textPath: [],
    extraText: <FormattedMessage id="unit.call.number" />,
  },
  LINK: {
    icon: <OpenLinkIcon />,
    link: true,
    urlPath: ['www', 'fi'],
    textPath: ['name', 'fi'],
    extraText: <FormattedMessage id="unit.opens.new.tab" />,
  },
  CONTACT: {
    icon: <PersonIcon />,
    link: true,
    urlPath: null,
    textPath: ['name', 'fi'],
    extraText: <FormattedMessage id="unit.call.number" />,
  },
};

const getItem = id => itemData[id];

const returnValue = (path, data) => path.reduce((obj, key) => obj[key], data.value);

const LinkListItem = (props) => {
  const { data, classes } = props;
  const item = getItem(data.type);
  if (data.value && data.type) {
    return (
      <ListItem
        button={!!item.link}
        component={item.link ? 'a' : null}
        onClick={() => {
        // TODO: make sure onclick on unclickable items is ok
          if (item.urlPath) {
            window.open(returnValue(item.urlPath, data));
          } else {
            console.log('not url link');
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
          {returnValue(item.textPath, data)}
          {' '}
          {item.extraText}
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
