import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../../components/Lists/TitledList';
import ServiceItem from '../../../../components/ListItems/ServiceItem';

// Teaching and education service node. Could be changed to exclude daycare centers etc.
const educationNode = 1087;

class Services extends React.Component {
  // TODO: replace getLocaleText with useLocaleText when the component is converted to function component
  serviceRef = null;

  periodRef = null;

  constructor(props) {
    super(props);
    const { unit } = props;

    const periodData = new Set();
    // If unit has service node Education, form list of periods
    const subjectList = [];
    // List of normal services without period infomration
    let serviceList = [];

    if (unit.root_service_nodes && unit.root_service_nodes.includes(educationNode)) {
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
    } else {
      // Else display services normally
      serviceList = unit.services;
      this.sortName(serviceList);
      // this.setState({ serviceList: unit.services });
    }

    this.state = {
      serviceList, // services || [],
      subjectList,
      periodList: [...periodData],
    };
  }

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
      serviceList,
    } = this.state;

    return (
      <div ref={(ref) => { this.serviceRef = ref; }}>
        {/* Services */}
        {serviceList && serviceList.length > 0 && (
        <TitledList
          title={<FormattedMessage id="unit.services" />}
          subtitle={<FormattedMessage id="unit.services.count" values={{ count: serviceList.length }} />}
          titleComponent="h4"
        >
          {
            serviceList.map((service, i) => {
              const key = `service-${i}-${service.id}-${service.clarification ? service.clarification.fi : ''}`;
              return (
                <ServiceItem
                  key={key}
                  service={service}
                  link={false}
                />
              );
            })
          }
        </TitledList>
        )}
      </div>
    );
  }

  renderPeriods() {
    const {
      intl,
    } = this.props;
    const {
      periodList, subjectList,
    } = this.state;

    return (
      <div ref={(ref) => { this.periodRef = ref; }}>
        {/* Education periods */}
        {
          periodList.map((period) => {
            const filteredSubjects = subjectList.filter(subject => subject.period && `${subject.period[0]}–${subject.period[1]}` === period);
            return (
              <TitledList
                key={`period-${period}`}
                title={`${intl.formatMessage({ id: 'unit.school.year' })} ${period}`}
                subtitle={<FormattedMessage id="unit.services.count" values={{ count: filteredSubjects.length }} />}
                titleComponent="h3"
              >
                {
                  filteredSubjects.map((service, i) => {
                    const key = `period-${i}-${service.id}-${service.clarification ? service.clarification.fi : ''}`;
                    return (
                      <ServiceItem
                        key={key}
                        service={service}
                        link={false}
                      />
                    );
                  })
                }
              </TitledList>
            );
          })
        }
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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
};

export default Services;
