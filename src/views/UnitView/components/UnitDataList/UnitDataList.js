import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import TitledList from '../../../../components/Lists/TitledList';
import EventItem from '../../../../components/ListItems/EventItem';
import ReservationItem from '../../../../components/ListItems/ReservationItem';
import ServiceItem from '../../../../components/ListItems/ServiceItem';

const UnitDataList = ({
  isFetching, data, listLength, type, semester, disableTitle, navigator,
}) => {
  const location = useLocation();
  const unit = useSelector(state => state.selectedUnit.unit.data);

  if (!data) {
    return null;
  }
  const endIndex = listLength > data.length || listLength;
  const shownData = data.length ? data.slice(0, endIndex) : null;
  const showButton = data.length > listLength;

  const onButtonClick = () => {
    if (navigator) {
      navigator.replace({
        ...location,
        hash: `Unit${type}Button`,
      });
      navigator.push('unit', { id: unit.id, type });
    }
  };

  const renderListItems = () => {
    if (type === 'events') {
      return (
        shownData.map((item, i) => (
          <EventItem simpleItem key={item.id} event={item} divider={i !== shownData.length - 1} />
        ))
      );
    } if (type === 'reservations') {
      return (
        shownData.map((item, i) => (
          <ReservationItem key={item.id} reservation={item} divider={i !== shownData.length - 1} />
        ))
      );
    }
    if (type === 'services' || type === 'semesters') {
      return (
        shownData.map((item, i) => (
          <ServiceItem
            key={item.id}
            service={item}
            link={false}
            divider={i !== shownData.length - 1}
          />
        ))
      );
    }
    return null;
  };

  if (unit && shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={!disableTitle ? <FormattedMessage id={`unit.${type}`} /> : null}
          description={<FormattedMessage id={`unit.${type}.description`} values={semester ? { semester } : null} />}
          detailedTitle
          divider={false}
          titleComponent="h4"
          buttonMessageID={`unit.${type}.more`}
          buttonMessageCount={data.length - listLength}
          loading={isFetching}
          buttonID={`Unit${type}Button`}
          onButtonClick={showButton ? onButtonClick : null}
        >
          {renderListItems()}
        </TitledList>
      </div>
    );
  } return (
    null
  );
};

UnitDataList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool,
  listLength: PropTypes.number,
  type: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  semester: PropTypes.string,
  disableTitle: PropTypes.bool,
};

UnitDataList.defaultProps = {
  listLength: 5,
  isFetching: false,
  navigator: null,
  semester: null,
  disableTitle: false,
};

export default UnitDataList;
