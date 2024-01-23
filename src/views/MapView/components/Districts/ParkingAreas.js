import { css } from '@emotion/css';
import { List, ListItem, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import {
  selectParkingAreas,
  selectSelectedParkingAreas,
} from '../../../../redux/selectors/district';
import useLocaleText from '../../../../utils/useLocaleText';
import swapCoordinates from '../../utils/swapCoordinates';
import { StyledAreaPopup } from '../styled/styled';

// This component renders parking areas to map
const ParkingAreas = () => {
  const { Polygon, Tooltip, Popup } = global.rL;

  const getLocaleText = useLocaleText();
  const intl = useIntl();
  const theme = useTheme();
  const parkingAreas = useSelector(selectParkingAreas);
  const selectedParkingAreas = useSelector(selectSelectedParkingAreas);

  const [areaPopup, setAreaPopup] = useState(null);

  const createPopup = (area, e) => {
    e.originalEvent.view.L.DomEvent.stopPropagation(e);
    const extraData = area.extra;
    const generateTextContent = texts => (
      <List>
        {texts.map(text => <ListItem key={text}><Typography>{text}</Typography></ListItem>)}
      </List>
    );

    function helsinkiTexts() {
      return [
        intl.formatMessage({ id: `parkingArea.popup.payment${extraData.class}` }),
        ...(extraData.max_duration ? [intl.formatMessage({ id: `parkingArea.popup.duration${extraData.class}` }, { duration: extraData.max_duration })] : []),
        ...(extraData.validity_period ? [intl.formatMessage({ id: `parkingArea.popup.validity${extraData.class}` }, { validity: extraData.validity_period })] : []),
        ...(extraData.class === '5' ? [intl.formatMessage({ id: 'parkingArea.popup.duration5' })] : []),
        intl.formatMessage({ id: 'parkingArea.popup.info' }),
        intl.formatMessage({ id: `parkingArea.popup.info${extraData.class}` }),
      ];
    }

    function vantaaTexts() {
      return [
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.neighbourhood' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.name' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.places' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.type' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.timeRestriction' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.validityPeriod' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.moreInfo' }),
        intl.formatMessage({ id: 'parkingArea.popup.vantaa.circlePlace' }),
      ];
    }

    const textContent = generateTextContent(area.municipality === 'vantaa' ? vantaaTexts() : helsinkiTexts());

    setAreaPopup({
      position: e.latlng,
      textContent,
    });
  };

  const getColor = (area) => {
    const type = area.extra?.class || area.extra?.tyyppi;
    switch (type) {
      case '1':
      case '12h-24h':
        return 'rgb(25, 100, 230)';
      case '2':
      case '2h-3h':
        return 'rgb(86, 24, 227)';
      case '3':
      case '4h-11h':
        return 'rgb(232, 70, 61)';
      case '4':
      case 'Ei rajoitusta':
        return 'rgb(17, 37, 140)';
      case '5':
      case 'Lyhytaikainen':
        return 'rgb(65, 32, 8)';
      case '6':
      case 'Maksullinen':
        return 'rgb(69, 138, 47)';
      case 'Muu':
        return 'rgb(255,0,168)';
      case 'Varattu päivisin':
        return 'rgb(255,60,0)';
      default:
        return '#ff8400';
    }
  };

  const selectedAreas = parkingAreas.filter(
    obj => selectedParkingAreas.includes(obj.extra.class)
      || selectedParkingAreas.includes(obj.extra.tyyppi),
  );

  const parkingLayerClass = css({
    zIndex: theme.zIndex.infront,
  });

  return (
    <>
      {selectedAreas.map((area) => {
        const mainColor = getColor(area);
        const boundary = area.boundary.coordinates.map(
          coords => swapCoordinates(coords),
        );
        return (
          <Polygon
            key={area.id}
            positions={boundary}
            className={parkingLayerClass}
            color={getColor(area)}
            pathOptions={{
              fillOpacity: '0',
              fillColor: mainColor,
            }}
            eventHandlers={{
              click: (e) => {
                createPopup(area, e);
              },
              mouseover: (e) => {
                e.target.openTooltip();
                e.target.setStyle({ fillOpacity: '0.2' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: '0' });
              },
            }}
          >
            {area.name ? (
              <Tooltip
                sticky
                direction="top"
                autoPan={false}
              >
                {`${area.extra?.area_key ?? ''}${getLocaleText(area.name)} - ${intl.formatMessage({ id: `area.list.${area.type}` })}`}
              </Tooltip>
            ) : null}

          </Polygon>
        );
      })}
      {areaPopup?.textContent ? (
        <Popup onClose={() => setAreaPopup(null)} position={areaPopup.position}>
          <StyledAreaPopup>
            {areaPopup.textContent}
          </StyledAreaPopup>
        </Popup>
      ) : null}
    </>
  );
};

export default ParkingAreas;
