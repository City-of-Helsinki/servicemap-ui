import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import TitledList from '../../../components/Lists/TitledList';
import ServiceItem from '../../../components/ListItems/ServiceItem';

// Teaching and education service node. Could be changed to exclude daycare centers etc.
const educationNode = 1087;

class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      subjectList: [],
      periodList: [],
    };
  }

  componentDidMount() {
    const { unit } = this.props;
    if (unit.root_service_nodes.includes(educationNode)) {
      // If unit has service node Education, form list of periods
      this.formPeriodList();
    } else {
      // Else display services normally
      this.sortName(unit.services);
      this.setState({ serviceList: unit.services });
    }
  }

  formPeriodList = () => {
    const { unit } = this.props;
    const periodData = new Set();
    // List of services that have period infomration
    const subjectList = [];
    // List of normal services without period infomration
    const serviceList = [];

    unit.services.forEach((service) => {
      if (service.period && service.period.length > 1) {
        const yearString = `${service.period[0]}–${service.period[1]}`;
        periodData.add(yearString);
        subjectList.push(service);
      } else {
        serviceList.push(service);
      }
    });

    this.sortName(serviceList);
    this.sortName(subjectList);

    this.setState({
      periodList: [...periodData],
      serviceList,
      subjectList,
    });
  };

  sortName = (list) => {
    const { getLocaleText } = this.props;
    const compare = (a, b) => {
      if (getLocaleText(a.name) < getLocaleText(b.name)) {
        return -1;
      }
      if (getLocaleText(a.name) > getLocaleText(b.name)) {
        return 1;
      }
      return 0;
    };
    list.sort(compare);
  };

  render() {
    const {
      intl, unit, listLength, navigator,
    } = this.props;
    const { serviceList, periodList, subjectList } = this.state;

    const showMoreOnClick = listLength
      ? (e) => {
        e.preventDefault();
        if (navigator) {
          navigator.push('unit', { id: unit.id, type: 'services' });
        }
      } : null;

    return (
      <>
        {/* Services */}
        {serviceList && serviceList.length > 0 && (
        <TitledList
          title={<FormattedMessage id="unit.services" />}
          titleComponent="h3"
          listLength={listLength}
          buttonText={<FormattedMessage id="unit.more.services" values={{ count: unit.services.length }} />}
          showMoreOnClick={showMoreOnClick}
        >
          {serviceList.map((service, i) => (
            <ServiceItem
              key={`${service.id}-${service.clarification ? service.clarification.fi : ''}`}
              service={service}
              divider={!(i + 1 === serviceList.length || i + 1 === listLength)}
            />
          ))}
        </TitledList>
        )}

        {/* Education periods */}
        {periodList.map(period => (
          <TitledList
            key={period[0]}
            title={`${intl.formatMessage({ id: 'unit.school.year' })} ${period}`}
            titleComponent="h3"
            listLength={listLength}
            buttonText={<FormattedMessage id="unit.more.services" values={{ count: unit.services.length }} />}
            showMoreOnClick={showMoreOnClick}
          >
            {subjectList.filter(subject => subject.period && `${subject.period[0]}–${subject.period[1]}` === period)
              .map((service, i) => (
                <ServiceItem
                  key={`${service.id}-${service.clarification ? service.clarification.fi : ''}`}
                  service={service}
                  divider={!(i + 1 === subjectList.length || i + 1 === listLength)}
                />
              ))}
          </TitledList>
        ))}
      </>
    );
  }
}

Services.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  listLength: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
};

Services.defaultProps = {
  listLength: null,
  navigator: null,
};

export default injectIntl(Services);
