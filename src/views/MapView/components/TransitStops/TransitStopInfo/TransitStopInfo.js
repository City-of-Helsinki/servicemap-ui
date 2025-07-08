/* eslint-disable react/no-array-index-key */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import Accessible from '@mui/icons-material/Accessible';
import { ButtonBase, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { getIcon } from '../../../../../components';
import { selectMapType } from '../../../../../redux/selectors/settings';
import useLocaleText from '../../../../../utils/useLocaleText';
import { fetchStopData } from '../../../utils/transitFetch';
import { StyledCloseText } from '../../styled/styled';
import getTypeAndClass from '../util/util';

const infoIconClass = {
  fontSize: 18,
  width: 18,
  height: 18,
  lineHeight: '21px',
  marginLeft: 6,
  marginRight: 4,
};
const TransitStopIcon = styled.span(({ color }) => ({
  ...infoIconClass,
  color,
}));

const DepartureItemContainer = styled.div(() => ({
  marginBottom: 3,
  display: 'flex',
  alignItems: 'center',
}));
const StyledDeparturetime = styled(Typography)(() => ({
  width: '15%',
  fontSize: '0.813rem',
}));

const StyledDepartureVehicle = styled.div(() => ({
  width: '38%',
  display: 'flex',
}));

const StyledVehicleName = styled(Typography)(() => ({
  display: 'inline',
  fontWeight: 'bold',
}));

const StyledRouteName = styled(Typography)(() => ({
  fontSize: '0.75rem',
  width: '55%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const StyledTransitInfoContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTransitInfoTitle = styled.div(() => ({
  fontWeight: 'bold',
  marginBottom: '5%',
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderBottomColor: 'rgba(0, 0, 0, 0.30)',
  display: 'flex',
  paddingBottom: ' 2%',
}));

const StyledCloseButton = styled(ButtonBase)(() => ({
  marginLeft: 'auto',
}));

const StyledBoldText = styled(Typography)(() => ({
  fontWeight: 'bold',
}));

function TransitStopInfo({ stop = {}, onCloseClick, type = null }) {
  const useContrast = useSelector(selectMapType) === 'accessible_map';
  const getLocaleText = useLocaleText();
  const [stopData, setStopData] = useState({
    departureTimes: null,
    wheelchair: null,
  });
  const infoIconCssClass = css(infoIconClass);
  const getAccessibilityIcon = (value) => {
    if (value === 'POSSIBLE') {
      return <Accessible className={infoIconCssClass} />;
    }
    if (value === 'NOT_POSSIBLE') {
      return getIcon('noWheelchair', { className: infoIconCssClass });
    }
    return null;
  };

  useEffect(() => {
    if (type === 'bikeStation') return;
    fetchStopData(stop).then((stopData) => {
      if (stopData) {
        let departureTimes = stopData.data.stop.stoptimesWithoutPatterns;
        departureTimes.sort(
          (a, b) =>
            a.realtimeDeparture +
            a.serviceDay -
            (b.realtimeDeparture + b.serviceDay)
        );
        departureTimes = departureTimes.slice(0, 5);

        setStopData({
          departureTimes,
          wheelchair: stopData.data.stop.wheelchairBoarding,
        });
      }
    });
  }, []);

  const renderDepartureTimes = () => {
    const { color, className } = getTypeAndClass(stop.vehicleMode);
    const icon = (
      <TransitStopIcon
        color={useContrast ? '#000000' : color}
        className={className}
      />
    );

    if (stopData.departureTimes?.length) {
      return stopData.departureTimes.map((departure, index) => {
        const time = new Date(
          (departure.realtimeDeparture + departure.serviceDay) * 1000
        );
        const hours = time.getHours();
        const minutes = time.getMinutes();

        return (
          <DepartureItemContainer key={index}>
            <StyledDeparturetime>
              {/* This adds 0 before single digit times */}
              {`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`}
            </StyledDeparturetime>
            <StyledDepartureVehicle>
              {icon}
              <StyledVehicleName>
                {departure.trip.route.shortName}
              </StyledVehicleName>
            </StyledDepartureVehicle>
            <StyledRouteName>
              {departure.pickupType === 'NONE' ? (
                <FormattedMessage id="map.transit.endStation" />
              ) : (
                departure.headsign
              )}
            </StyledRouteName>
            {getAccessibilityIcon(departure.trip.wheelchairAccessible)}
          </DepartureItemContainer>
        );
      });
    }
    return null;
  };

  return (
    <StyledTransitInfoContainer aria-hidden>
      <StyledCloseButton onClick={() => onCloseClick()}>
        <StyledCloseText>
          <FormattedMessage id="general.close" />
        </StyledCloseText>
        <Close className={infoIconCssClass} />
      </StyledCloseButton>
      <StyledTransitInfoTitle>
        <StyledBoldText>
          {typeof stop.name === 'object' ? getLocaleText(stop.name) : stop.name}
        </StyledBoldText>
        {getAccessibilityIcon(stopData.wheelchair)}
      </StyledTransitInfoTitle>
      {type === 'bikeStation' ? null : renderDepartureTimes()}
    </StyledTransitInfoContainer>
  );
}

TransitStopInfo.propTypes = {
  stop: PropTypes.objectOf(PropTypes.any),
  onCloseClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default TransitStopInfo;
