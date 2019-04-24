import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import styles from '../styles/styles';
import getItemIconData from '../constants/itemIconData';
import { getLocaleString } from '../../../redux/selectors/locale';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';

class InfoList extends React.Component {
  handleItemClick = (data) => {
    const { getLocaleText } = this.props;
    if (data.www) {
      let url = data.www;
      if (typeof (url) === 'object') {
        url = getLocaleText(url);
      }
      window.open(url);
    } else if (data.phone) {
      console.log('call number: ', data.phone);
    } else {
      console.log('error');
    }
  };

  formString = (data) => {
    const { getLocaleText } = this.props;
    const first = Object.keys(data)[0];
    let fullText = '';

    if (typeof data !== 'object') {
      return data;
    }
    if (first === 'fi' || first === 'en' || first === 'sv') {
      return getLocaleText(data);
    }
    if (data.name) {
      if (typeof data.name === 'object') {
        fullText += getLocaleText(data.name);
      } else {
        fullText += data.name;
      }
    }
    if (data.contact_person) {
      fullText += `, ${data.contact_person}`;
    }
    if (data.phone) {
      fullText += `, ${data.phone}`;
    }
    if (data.email) {
      fullText += `, ${data.email}`;
    }
    if (fullText.charAt(0) === ',') {
      fullText = fullText.slice(2);
    }
    return fullText;
  }

  render() {
    const {
      classes, data, title, titleComponent, intl,
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
              component={titleComponent}
              variant="subtitle1"
            >
              {title}
            </Typography>

            <Divider aria-hidden="true" className={classes.left} />

            <List disablePadding>
              {filteredData.map((data, i) => {
                let text = '';
                if (data.value && data.type) {
                  text = this.formString(data.value);

                  // Add extra text
                  if (data.value.www) {
                    text += ` ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`;
                  }
                  if (data.value.phone) {
                    text += ` ${intl.formatMessage({ id: 'unit.call.number' })}`;
                  }
                  if (data.value.period) {
                    text += ` ${intl.formatMessage({ id: 'unit.school.year' })}`;
                    text += ` ${data.value.period[0]} - ${data.value.period[1]}`;
                  }

                  text = text.charAt(0).toUpperCase() + text.slice(1);

                  if (text !== '') {
                    return (
                      <SimpleListItem
                        key={data.type + data.id}
                        icon={getItemIconData(data.type, data.value)}
                        link={!!data.value.www || !!data.value.phone}
                        text={text}
                        handleItemClick={() => this.handleItemClick(data.value)}
                        divider={i + 1 !== filteredData.length} // Dont add divider if last item
                      />
                    );
                  }
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

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
  };
};


export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
)(InfoList)));

InfoList.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.objectOf(PropTypes.any).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

InfoList.defaultProps = {
  titleComponent: 'h3',
};
