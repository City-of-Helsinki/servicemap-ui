import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { EventAvailable } from '@material-ui/icons';
import TitledList from '../../../components/Lists/TitledList';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';

const Reservations = ({
  listLength, reservationsData, getLocaleText, intl, showMoreCount,
}) => {
  const [shownCount, setShownCount] = useState(listLength);
  const [ref, setRef] = useState(null);
  const reservations = reservationsData.data;
  const { isFetching } = reservationsData;

  if (reservations && !isFetching && reservations.length > 0) {
    return (
      <div ref={ref => setRef(ref)}>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count: reservations.length }} />}
          titleComponent="h4"
          listLength={shownCount}
          buttonMessageID="unit.reservations.more"
          showMoreOnClick={listLength
            ? () => {
              const lastListItem = ref.querySelector('li:last-of-type');
              lastListItem.focus();
              setShownCount(shownCount + showMoreCount);
            } : null}
        >
          {reservations.map(item => (
            <SimpleListItem
              key={item.id}
              icon={<EventAvailable />}
              link
              text={`${getLocaleText(item.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
              divider
              handleItemClick={() => {
                window.open(`https://varaamo.hel.fi/resources/${item.id}`);
              }}
            />
          ))}
        </TitledList>
      </div>
    );
  } return (null);
};

Reservations.propTypes = {
  reservationsData: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  listLength: PropTypes.number,
  intl: intlShape.isRequired,
  showMoreCount: PropTypes.number,
};

Reservations.defaultProps = {
  listLength: null,
  showMoreCount: 10,
};

export default injectIntl(Reservations);
