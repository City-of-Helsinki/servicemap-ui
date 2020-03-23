import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import TitledList from '../../../../components/Lists/TitledList';
import ServiceItem from '../../../../components/ListItems/ServiceItem';

// Teaching and education service node. Could be changed to exclude daycare centers etc.
const educationNode = 1087;

class Services extends React.Component {
  serviceRef = null;

  periodRef = null;

  constructor(props) {
    super(props);
    const { unit, listLength } = props;
    const { services } = unit;
    this.state = {
      serviceList: services || [],
      subjectList: [],
      periodList: [],
      serviceShownCount: listLength,
      periodShownCount: listLength,
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

  renderServices() {
    const {
      showMoreCount,
    } = this.props;
    const {
      serviceList, serviceShownCount,
    } = this.state;

    const showMoreOnClick = serviceShownCount
      ? () => {
        const lastListItem = this.serviceRef.querySelector('li:last-of-type');
        lastListItem.focus();
        this.setState({ serviceShownCount: serviceShownCount + showMoreCount });
      } : null;

    return (
      <div ref={(ref) => { this.serviceRef = ref; }}>
        {/* Services */}
        {serviceList && serviceList.length > 0 && (
        <TitledList
          title={<FormattedMessage id="unit.services" />}
          subtitle={<FormattedMessage id="unit.services.count" values={{ count: serviceList.length }} />}
          titleComponent="h4"
          listLength={serviceShownCount}
          buttonMessageID="unit.services.more"
          showMoreOnClick={showMoreOnClick}
        >
          {serviceList.map(service => (
            <ServiceItem
              key={`${service.id}-${service.clarification ? service.clarification.fi : ''}`}
              service={service}
              link={false}
            />
          ))}
        </TitledList>
        )}
      </div>
    );
  }

  renderPeriods() {
    const {
      intl, showMoreCount,
    } = this.props;
    const {
      periodList, subjectList, periodShownCount,
    } = this.state;

    const showMoreOnClick = periodShownCount
      ? () => {
        const lastListItem = this.periodRef.querySelector('li:last-of-type');
        lastListItem.focus();
        this.setState({ periodShownCount: periodShownCount + showMoreCount });
      } : null;

    return (
      <div ref={(ref) => { this.periodRef = ref; }}>
        {/* Education periods */}
        {periodList.map(period => (
          <TitledList
            key={period[0]}
            title={`${intl.formatMessage({ id: 'unit.school.year' })} ${period}`}
            subtitle={<FormattedMessage id="unit.services.count" values={{ count: subjectList.length }} />}
            titleComponent="h3"
            listLength={periodShownCount}
            buttonMessageID="unit.services.more"
            showMoreOnClick={showMoreOnClick}
          >
            {subjectList.filter(subject => subject.period && `${subject.period[0]}–${subject.period[1]}` === period)
              .map(service => (
                <ServiceItem
                  key={`${service.id}-${service.clarification ? service.clarification.fi : ''}`}
                  service={service}
                />
              ))}
          </TitledList>
        ))}
      </div>
    );
  }

  render() {
    return (
      <>
        {
          this.renderServices()
        }

        {
          this.renderPeriods()
        }
      </>
    );
  }
}

Services.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
  listLength: PropTypes.number,
  getLocaleText: PropTypes.func.isRequired,
  showMoreCount: PropTypes.number,
};

Services.defaultProps = {
  listLength: null,
  showMoreCount: 10,
};

export default Services;
