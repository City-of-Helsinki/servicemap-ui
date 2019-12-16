import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import getItemIconData from '../constants/itemIconData';
import { getLocaleString } from '../../../redux/selectors/locale';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';
import TitledList from '../../../components/Lists/TitledList';

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
      window.location.href = `tel:${data.phone}`;
    }
  };

  formString = (data, intl) => {
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
    // Add extra text
    if (data.www) {
      fullText += ` ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`;
    }
    if (data.phone) {
      fullText += ` ${intl.formatMessage({ id: 'unit.call.number' })}`;
    }
    if (data.period) {
      fullText += ` ${intl.formatMessage({ id: 'unit.school.year' })}`;
      fullText += ` ${data.value.period[0]} - ${data.value.period[1]}`;
    }
    fullText = fullText.charAt(0).toUpperCase() + fullText.slice(1);
    return fullText;
  }

  formSrString = (data, intl) => {
    switch (data.type) {
      case 'ADDRESS':
        return intl.formatMessage({ id: 'unit.address' });
      case 'PHONE':
        return intl.formatMessage({ id: 'unit.phone' });
      case 'EMAIL':
        return intl.formatMessage({ id: 'unit.email' });
      case 'OPENING_HOURS':
        if (data.value.www) {
          return intl.formatMessage({ id: 'unit.opening.hours.info' });
        }
        return intl.formatMessage({ id: 'unit.opening.hours' });
      case 'PHONE_OR_EMAIL':
        return intl.formatMessage({ id: 'unit.contact' });
      default:
        return null;
    }
  }

  render() {
    const {
      data, title, titleComponent, intl,
    } = this.props;
    if (data.length > 0) {
      // Assign id for each item
      for (let i = 0; i < data.length; i += 1) {
        data[i].id = i;
      }
      if (data.length > 0) {
        return (
          <TitledList title={title} titleComponent={titleComponent}>
            {data.map((item, i) => {
              if (item.value && item.type) {
                const text = this.formString(item.value, intl);
                const srText = this.formSrString(item, intl);

                if (text !== '') {
                  return (
                    <SimpleListItem
                      key={item.type + item.id}
                      icon={getItemIconData(item.type, item.value)}
                      link={!!item.value.www || !!item.value.phone}
                      text={text}
                      srText={srText}
                      handleItemClick={() => this.handleItemClick(item.value)}
                      divider={i + 1 !== data.length} // Dont add divider if last item
                    />
                  );
                }
              } return null;
            })}
          </TitledList>
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


export default injectIntl(connect(
  mapStateToProps,
)(InfoList));

InfoList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.objectOf(PropTypes.any).isRequired,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  intl: intlShape.isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

InfoList.defaultProps = {
  titleComponent: 'h3',
};
