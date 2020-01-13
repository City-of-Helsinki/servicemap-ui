import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { EventAvailable } from '@material-ui/icons';
import { connect } from 'react-redux';
import TitledList from '../../../components/Lists/TitledList';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';
import { getLocaleString } from '../../../redux/selectors/locale';
import { fetchReservations, fetchAdditionalReservations, changeReservations } from '../../../redux/actions/selectedUnitReservations';

const Reservations = ({
  listLength,
  reservationsData,
  getLocaleText,
  intl,
  showMoreCount,
  unit,
  fetchReservations,
  fetchAdditionalReservations,
}) => {
  const [ref, setRef] = useState(null);
  const reservations = reservationsData.data;
  const {
    isFetching, count, isFetchingMore, next,
  } = reservationsData;


  if (reservations && !isFetching && reservations.length) {
    return (
      <div ref={ref => setRef(ref)}>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count }} />}
          titleComponent="h4"
          shortened={reservations.length < count}
          loading={isFetchingMore}
          buttonMessageID="unit.reservations.more"
          showMoreOnClick={listLength
            ? () => {
              if (!isFetchingMore) {
                const lastListItem = ref.querySelector('li:nth-last-of-type(2)');
                lastListItem.focus();
                if (reservations.length < showMoreCount) {
                  fetchReservations(unit.id, showMoreCount, true);
                } else {
                  fetchAdditionalReservations(next);
                }
              }
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
  fetchReservations: PropTypes.func.isRequired,
  fetchAdditionalReservations: PropTypes.func.isRequired,
  unit: PropTypes.objectOf(PropTypes.any),
};

Reservations.defaultProps = {
  unit: null,
  listLength: null,
  showMoreCount: 15,
};

const mapStateToProps = (state) => {
  const unit = state.selectedUnit.unit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit,
    getLocaleText,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeReservations, fetchReservations, fetchAdditionalReservations },
)(Reservations));
