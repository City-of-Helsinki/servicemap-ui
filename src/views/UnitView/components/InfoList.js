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

  handleItemClick = (item, data) => {
    if (item.link) {
      if (item.urlPath) {
        window.open(this.returnValue(item.urlPath, data));
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
      const filteredData = data.filter(item => Object.keys(item).length > 0);

      // Assign id for each item
      for (let i = 0; i < filteredData.length; i += 1) {
        filteredData[i].id = i;
      }

      return (
        <div>
          <Typography className={classes.title} variant="h3">{title}</Typography>
          <List>
            {filteredData.map((data) => {
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

                return (
                  <div key={data.type + data.id}>
                    <SimpleListItem
                      icon={item.icon}
                      link={item.link}
                      text={text}
                      handleItemClick={() => this.handleItemClick(item, data)}
                    />
                    <Divider className={classes.divider} />
                  </div>
                );
              } return null;
            })}
          </List>
        </div>
      );
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
};
