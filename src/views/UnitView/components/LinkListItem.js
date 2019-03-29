import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core';
import listStyles from '../styles/listStyles';
import itemData from '../constants/itemData';

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
  let value = path[0].reduce((obj, key) => obj[key], data.value);
  // If school year
  if (data.value.period && Array.isArray(value)) {
    value = ` ${value[0]} - ${value[1]}`;
  }
  return value;
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

          {data.value.period ? <FormattedMessage id="unit.school.year" /> : null}
          {data.value.period ? returnValue(item.periodPath, data) : null}
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
