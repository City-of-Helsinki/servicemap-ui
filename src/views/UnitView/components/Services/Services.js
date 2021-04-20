import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../../components/Lists/TitledList';
import ServiceItem from '../../../../components/ListItems/ServiceItem';
import useLocaleText from '../../../../utils/useLocaleText';

// Teaching and education service node. Could be changed to exclude daycare centers etc.
const educationNode = 1087;

const Services = ({ intl, unit }) => {
  const getLocaleText = useLocaleText();

  const [serviceList, setServiceList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const sortName = (list) => {
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

  useEffect(() => {
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

      sortName(serviceList);
      sortName(subjectList);
    } else {
      // Else display services normally
      serviceList = unit.services;
      sortName(serviceList);
      // this.setState({ serviceList: unit.services });
    }

    setServiceList(serviceList);
    setSubjectList(subjectList);
    setPeriodList([...periodData]);
  }, [unit.id]);

  const renderServices = () => (
    <div>
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

  const renderPeriods = () => (
    <div>
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

  return (
    <>
      {
        renderServices()
      }

      {
        renderPeriods()
      }
    </>
  );
};

Services.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Services;
