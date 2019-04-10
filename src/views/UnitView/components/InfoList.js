/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import SimpleListItem from '../../../components/SimpleListItem';
import styles from '../styles/styles';
import itemData from '../constants/itemData';

class InfoList extends React.Component {
  getItem = id => itemData[id];

  returnValue = (path, data) => {
    const { getLocaleText } = this.props;
    // Check if textfield requires multiple values
    if (path.length > 1) {
      let fullText = '';
      path.forEach((item) => {
        let text = item.reduce((obj, key) => obj[key], data.value);
        if (typeof (text) === 'object') {
          text = getLocaleText(text);
        }
        fullText += `${text}, `;
      });
      return fullText;
    }
    let value = path[0].reduce((obj, key) => obj[key], data.value);
    // If school year
    if (data.value.period && Array.isArray(value)) {
      value = ` ${value[0]} - ${value[1]}`;
    }

    if (typeof (value) === 'object') {
      value = getLocaleText(value);
    }
    return value;
  };

  handleItemClick = (item, data) => {
    const { getLocaleText } = this.props;
    if (item.link) {
      if (item.urlPath) {
        let url = this.returnValue(item.urlPath, data);
        if (typeof (url) === 'object') {
          url = getLocaleText(url);
        }
        window.open(url);
      } else {
        console.log('call number');
      }
    }
  };

  render() {
    const {
      classes, data, title, intl,
    } = this.props;
    if (data.length > 0) {
      const filteredData = data.filter(item => Object.keys(item).length > 0 && item.value);

      // Assign id for each item
      for (let i = 0; i < filteredData.length; i += 1) {
        filteredData[i].id = i;
      }
      if (filteredData.length > 0) {
        return (
          <div>
            <Typography
              className={`${classes.subtitle} ${classes.left}`}
              component="h4"
              variant="subtitle1"
            >
              {title}
            </Typography>
            <Divider className={classes.left} />
            <List disablePadding>
              {filteredData.map((data, i) => {
                const item = this.getItem(data.type);
                let text = '';

                if (data.value && data.type) {
                  text += `${this.returnValue(item.textPaths, data)} `;
                  if (item.urlPath) {
                    text += intl.formatMessage({ id: 'unit.opens.new.tab' });
                  }
                  if (!item.urlPath && item.link) {
                    text += intl.formatMessage({ id: 'unit.call.number' });
                  }
                  if (data.value.period) {
                    text += intl.formatMessage({ id: 'unit.school.year' });
                    text += this.returnValue(item.periodPath, data);
                  }
                  text = text.charAt(0).toUpperCase() + text.slice(1);
                  return (
                    <div key={data.type + data.id}>
                      <SimpleListItem
                        icon={item.icon}
                        link={item.link}
                        text={text}
                        handleItemClick={() => this.handleItemClick(item, data)}
                      />
                      {i + 1 !== filteredData.length ? (
                        <Divider className={classes.divider} />
                      ) : null}
                    </div>
                  );
                } return null;
              })}
            </List>
          </div>
        );
      }
    }
    return (
      null
    );
  }
}


export default injectIntl(withStyles(styles)(InfoList));

InfoList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
};
