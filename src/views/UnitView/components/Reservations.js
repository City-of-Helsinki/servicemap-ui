import React from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { EventAvailable } from '@material-ui/icons';
import { connect } from 'react-redux';
import TitledList from '../../../components/Lists/TitledList';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';
import { getLocaleString } from '../../../redux/selectors/locale';

const Reservations = ({
  listLength,
  reservationsData,
  getLocaleText,
  intl,
  navigator,
  unit,
}) => {
  const {
    data, isFetching, max,
  } = reservationsData;

  if (!data) {
    return null;
  }

  const endIndex = listLength > data.length ? data.length : listLength;
  const shownData = data.slice(0, endIndex);

  if (shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count: max }} />}
          titleComponent="h4"
          shortened={max > listLength}
          loading={isFetching}
          buttonMessageID="unit.reservations.more"
          showMoreOnClick={listLength
            ? () => {
              if (navigator) {
                navigator.push('unit', { id: unit.id, type: 'reservations' });
              }
            } : null}
        >
          {shownData.map(item => (
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
  navigator: PropTypes.objectOf(PropTypes.any),
  unit: PropTypes.objectOf(PropTypes.any),
};

Reservations.defaultProps = {
  unit: null,
  listLength: 5,
  navigator: null,
};

const mapStateToProps = (state) => {
  const { navigator, selectedUnit } = state;
  const unit = selectedUnit.unit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    unit,
    getLocaleText,
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  null,
)(Reservations));
