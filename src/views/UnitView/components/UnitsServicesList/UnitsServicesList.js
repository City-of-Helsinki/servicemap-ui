import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import useLocaleText from '../../../../utils/useLocaleText';
import UnitDataList from '../UnitDataList';

// Teaching and education service node. Could be changed to exclude daycare centers etc.
const educationNode = 1087;

function UnitsServicesList({ unit, listLength = 5 }) {
  const getLocaleText = useLocaleText();

  const [serviceList, setServiceList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const filterDataByYear = (years) =>
    subjectList.filter(
      (subj) => years.includes(subj.period[0]) && years.includes(subj.period[1])
    );

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
    // List of normal services without period information
    let serviceList = [];

    if (
      unit.root_service_nodes &&
      unit.root_service_nodes.includes(educationNode)
    ) {
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
    }

    setServiceList(serviceList);
    setSubjectList(subjectList);
    setPeriodList([...periodData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit.id]);

  const renderServices = () => (
    <UnitDataList
      listLength={listLength}
      data={{ data: serviceList, max: serviceList.length }}
      type="services"
    />
  );

  const renderPeriods = () =>
    periodList.map((period, i) => (
      <UnitDataList
        key={`period-${period}`}
        listLength={listLength}
        data={{ data: filterDataByYear(period), max: subjectList.length }}
        type="educationServices"
        period={period}
        disableTitle={i !== 0}
      />
    ));

  return (
    <>
      {renderServices()}

      {renderPeriods()}
    </>
  );
}

UnitsServicesList.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  listLength: PropTypes.number,
};

export default UnitsServicesList;
