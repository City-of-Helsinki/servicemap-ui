import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { EventAvailable } from '@material-ui/icons';
import TitledList from '../../../components/Lists/TitledList';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';

const Reservations = ({
  listLength, reservations, getLocaleText, intl, showMoreCount,
}) => {
  const [shownCount, setShownCount] = useState(listLength);
  const [ref, setRef] = useState(null);
  if (reservations && reservations.length > 0) {
    return (
      <div ref={ref => setRef(ref)}>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count: reservations.length }} />}
          titleComponent="h4"
          listLength={shownCount}
          buttonText={<FormattedMessage id="unit.reservations.more" />}
          showMoreOnClick={listLength
            ? () => {
              const lastListItem = ref.querySelector('li:last-of-type');
              lastListItem.focus();
              setShownCount(shownCount + showMoreCount);
            } : null}
        >
          {reservations.map((item, i) => (
            <SimpleListItem
              key={item.id}
              icon={<EventAvailable />}
              link
              text={`${getLocaleText(item.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
              divider={!(i + 1 === reservations.length || i + 1 === shownCount)}
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
  reservations: PropTypes.arrayOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  listLength: PropTypes.number,
  intl: intlShape.isRequired,
  showMoreCount: PropTypes.number,
};

Reservations.defaultProps = {
  reservations: [],
  listLength: null,
  showMoreCount: 10,
};

export default injectIntl(Reservations);
