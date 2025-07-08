import { css } from '@emotion/css';
import { List, ListItem, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { selectSelectedParkingAreas } from '../../../../redux/selectors/district';
import useLocaleText from '../../../../utils/useLocaleText';
import swapCoordinates from '../../utils/swapCoordinates';
import { StyledAreaPopup } from '../styled/styled';

// This component renders parking areas to map
function ParkingAreas() {
  const { Polygon, Tooltip, Popup } = global.rL;

  const getLocaleText = useLocaleText();
  const intl = useIntl();
  const theme = useTheme();
  const [areaPopup, setAreaPopup] = useState(null);
  const selectedAreas = useSelector(selectSelectedParkingAreas);

  const createPopup = (area, e) => {
    e.originalEvent.view.L.DomEvent.stopPropagation(e);
    const extraData = area.extra;
    const generateTextContent = (texts) => (
      <List>
        {texts.map((text) => (
          <ListItem key={text}>
            <Typography>{text}</Typography>
          </ListItem>
        ))}
      </List>
    );

    function helsinkiTexts() {
      return [
        intl.formatMessage({
          id: `parkingArea.popup.payment${extraData.class}`,
        }),
        ...(extraData.max_duration
          ? [
              intl.formatMessage(
                { id: `parkingArea.popup.duration${extraData.class}` },
                { duration: extraData.max_duration }
              ),
            ]
          : []),
        ...(extraData.validity_period
          ? [
              intl.formatMessage(
                { id: `parkingArea.popup.validity${extraData.class}` },
                { validity: extraData.validity_period }
              ),
            ]
          : []),
        ...(extraData.class === '5'
          ? [intl.formatMessage({ id: 'parkingArea.popup.duration5' })]
          : []),
        intl.formatMessage({ id: 'parkingArea.popup.info' }),
        intl.formatMessage({ id: `parkingArea.popup.info${extraData.class}` }),
      ];
    }

    function vantaaTexts() {
      return [
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.neighbourhood' },
          { value: extraData.kaupunginosa }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.name' },
          { value: extraData.katu }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.places' },
          { value: extraData['paikkamäärä'] }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.type' },
          { value: extraData.tyyppi }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.timeRestriction' },
          { value: extraData.aikarajoitus }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.validityPeriod' },
          { value: extraData.voimassaoloaika }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.moreInfo' },
          { value: extraData['lisätiedot'] }
        ),
        intl.formatMessage(
          { id: 'parkingArea.popup.vantaa.circlePlace' },
          { value: extraData.kiekkopaikka }
        ),
      ];
    }

    const textContent = generateTextContent(
      area.municipality === 'vantaa' ? vantaaTexts() : helsinkiTexts()
    );

    setAreaPopup({
      position: e.latlng,
      textContent,
    });
  };

  const getColor = (area) => {
    if (area?.type === 'hgv_no_parking_area') {
      return 'rgb(115, 76, 0)';
    }
    if (area?.type === 'park_and_ride_area') {
      return 'rgb(0, 38, 115)';
    }
    const type = area.extra?.class || area.extra?.tyyppi;
    switch (type) {
      case '1':
        return 'rgb(25, 100, 230)';
      case '2':
        return 'rgb(86, 24, 227)';
      case '3':
        return 'rgb(232, 70, 61)';
      case '4':
        return 'rgb(17, 37, 140)';
      case '5':
        return 'rgb(65, 32, 8)';
      case '6':
        return 'rgb(69, 138, 47)';
      case '7':
        return '#ff8400';

      case '12h-24h':
        return 'rgb(237, 81, 81)';
      case '4h-11h':
        return 'rgb(167, 198, 54)';
      case '2h-3h':
        return 'rgb(197, 0, 255)';
      case 'Ei rajoitusta':
        return 'rgb(252, 146, 31)';
      case 'Lyhytaikainen':
        return 'rgb(247, 137, 216)';
      case 'Maksullinen':
        return 'rgb(255, 0, 0)';
      case 'Muu':
        return 'rgb(60, 175, 153)';
      case 'Varattu päivisin':
        return 'rgb(107, 107, 214)';

      default:
        return '#ff8400';
    }
  };

  const parkingLayerClass = css({
    zIndex: theme.zIndex.infront,
  });

  function getHelsinkiTooltipText(extraData) {
    const messages = [
      intl.formatMessage({ id: `parkingArea.popup.payment${extraData.class}` }),
      extraData.max_duration
        ? intl.formatMessage(
            { id: `parkingArea.popup.duration${extraData.class}` },
            { duration: extraData.max_duration }
          )
        : '',
      extraData.validity_period
        ? intl.formatMessage(
            { id: `parkingArea.popup.validity${extraData.class}` },
            { validity: extraData.validity_period }
          )
        : '',
      extraData.class === '5'
        ? intl.formatMessage({ id: 'parkingArea.popup.duration5' })
        : '',
    ];
    return messages.filter((message) => message).join(' - ');
  }

  function resolveTooltipText(area) {
    const type = area?.type;
    if (type === 'park_and_ride_area') {
      return intl.formatMessage({
        id: 'area.parking.tooltip.park_and_ride_area',
      });
    }
    if (type === 'hgv_no_parking_area') {
      return intl.formatMessage({
        id: 'area.parking.tooltip.hgv_no_parking_area',
      });
    }
    if (type === 'hgv_street_parking_area' || type === 'hgv_parking_area') {
      return (
        `${area.extra?.area_key ?? ''}${getLocaleText(area.name)} - ` +
        intl.formatMessage({ id: 'area.list.heavy_traffic' })
      );
    }
    if (area.name) {
      if (area.municipality === 'helsinki') {
        return getHelsinkiTooltipText(area.extra);
      }
      const translationKey = `area.list.${type}`;
      return `${area.extra?.area_key ?? ''}${getLocaleText(area.name)} - ${intl.formatMessage({ id: translationKey })}`;
    }
    return null;
  }

  return (
    <>
      {selectedAreas.map((area) => {
        const mainColor = getColor(area);
        const boundary = area.boundary.coordinates.map((coords) =>
          swapCoordinates(coords)
        );
        const tooltipText = resolveTooltipText(area);
        return (
          <Polygon
            key={area.id}
            positions={boundary}
            className={parkingLayerClass}
            color={mainColor}
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
            {tooltipText && (
              <Tooltip sticky direction="top" autoPan={false}>
                {tooltipText}
              </Tooltip>
            )}
          </Polygon>
        );
      })}
      {areaPopup?.textContent ? (
        <Popup onClose={() => setAreaPopup(null)} position={areaPopup.position}>
          <StyledAreaPopup>{areaPopup.textContent}</StyledAreaPopup>
        </Popup>
      ) : null}
    </>
  );
}

export default ParkingAreas;
