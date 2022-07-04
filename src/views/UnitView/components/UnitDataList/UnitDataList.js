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
  data, listLength, type, semester, disableTitle, navigator,
}) => {
  const location = useLocation();
  const unit = useSelector(state => state.selectedUnit.unit.data);

  const dataItems = data.data;
  const fullDataLength = data.max;
  const { isFetching } = data;

  if (!dataItems) {
    return null;
  }
  const endIndex = listLength > dataItems.length ? dataItems.length : listLength;
  const shownData = dataItems.length ? dataItems.slice(0, endIndex) : null;
  const showButton = fullDataLength > listLength;

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
    if (type === 'services' || type === 'educationServices') {
      return (
        shownData.map((item, i) => (
          <ServiceItem
            key={item.id}
            service={item}
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
          buttonMessageCount={fullDataLength - listLength}
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
  data: PropTypes.objectOf(PropTypes.any),
  listLength: PropTypes.number,
  type: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  semester: PropTypes.string,
  disableTitle: PropTypes.bool,
};

UnitDataList.defaultProps = {
  data: null,
  listLength: 5,
  navigator: null,
  semester: null,
  disableTitle: false,
};

export default UnitDataList;
