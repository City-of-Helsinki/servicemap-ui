import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import styles from '../../styles';
import useLocaleText from '../../../../utils/useLocaleText';
import swapCoordinates from '../../utils/swapCoordinates';

// This component renders parking areas to map
const ParkingAreas = ({ classes }) => {
  const { Polygon, Tooltip, Popup } = global.rL;

  const getLocaleText = useLocaleText();
  const intl = useIntl();
  const parkingAreas = useSelector(state => state.districts.parkingAreas);
  const selectedParkingAreas = useSelector(state => state.districts.selectedParkingAreas);

  const [areaPopup, setAreaPopup] = useState(null);

  const createPopup = (area, e) => {
    e.originalEvent.view.L.DomEvent.stopPropagation(e);
    const extraData = area.extra;
    const generateTextContent = texts => (
      <List>
        {texts.map(text => <ListItem key={text}><Typography>{text}</Typography></ListItem>)}
      </List>
    );

    const textContent = generateTextContent([
      intl.formatMessage({ id: `parkingArea.popup.payment${extraData.class}` }),
      ...(extraData.max_duration ? [intl.formatMessage({ id: `parkingArea.popup.duration${extraData.class}` }, { duration: extraData.max_duration })] : []),
      ...(extraData.validity_period ? [intl.formatMessage({ id: `parkingArea.popup.validity${extraData.class}` }, { validity: extraData.validity_period })] : []),
      ...(extraData.class === '5' ? [intl.formatMessage({ id: 'parkingArea.popup.duration5' })] : []),
      intl.formatMessage({ id: 'parkingArea.popup.info' }),
      intl.formatMessage({ id: `parkingArea.popup.info${extraData.class}` }),
    ]);


    setAreaPopup({
      position: e.latlng,
      textContent,
    });
  };

  const getColor = (area) => {
    switch (area.extra?.class) {
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
      default:
        return '#ff8400';
    }
  };

  const selectedAreas = parkingAreas.filter(obj => selectedParkingAreas.includes(obj.extra.class));

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
      {areaPopup ? (
        <Popup onClose={() => setAreaPopup(null)} position={areaPopup.position}>
          <div className={classes.areaPopup}>
            {areaPopup.textContent && (
              areaPopup.textContent
            )}
          </div>
        </Popup>
      ) : null}
    </>
  );
};


export default withStyles(styles)(ParkingAreas);

ParkingAreas.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};
