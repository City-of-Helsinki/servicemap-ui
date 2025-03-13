/* eslint-disable global-require, no-use-before-define */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { selectMapType } from '../../../../redux/selectors/settings';
import useMobileStatus from '../../../../utils/isMobile';
import { isEmbed } from '../../../../utils/path';
import { transitIconSize } from '../../config/mapConfig';
import { fetchBikeStations, fetchStops } from '../../utils/transitFetch';
import TransitStopInfo from './TransitStopInfo';
import getTypeAndClass from './util/util';

const StyledTransitIconMap = styled.span(({ color, className }) => ({
  fontSize: transitIconSize,
  height: transitIconSize,
  margin: 0,
  lineHeight: 1,
  textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
  color,
  className,
}));

function TransitStops({ mapObject }) {
  const isMobile = useMobileStatus();
  const useContrast = useSelector(selectMapType) === 'accessible_map';
  const { Marker, Popup } = global.rL;
  const theme = useTheme();

  const [transitStops, setTransitStops] = useState([]);
  const [rentalBikeStations, setRentalBikeStations] = useState([]);
  const [visibleBikeStations, setVisibleBikeStations] = useState([]);
  const [bikeStationsLoaded, setBikeStationsLoaded] = useState(false);
  // Theme was undefined inside styled component for some reason
  const transitBackgroundClass = css({
    fontFamily: 'hsl-piktoframe',
    position: 'absolute',
    lineHeight: 0,
    zIndex: theme.zIndex.behind,
    color: 'white',
    fontSize: transitIconSize,
    marginTop: '8px',
  });

  const map = useMapEvents({
    moveend() {
      handleTransit();
    },
  });

  // Check if transit stops should be shown
  const showTransitStops = () => {
    const transitZoom = isMobile
      ? mapObject.options.detailZoom - 1 : mapObject.options.detailZoom;
    const currentZoom = map.getZoom();

    const url = new URL(window.location);
    const embeded = isEmbed({ url: url.toString() });
    const showTransit = !embeded || url.searchParams.get('transit') === '1';

    return (currentZoom >= transitZoom) && showTransit;
  };

  const fetchTransitStops = () => {
    fetchStops(map)
      .then(stops => {
        if (showTransitStops()) {
          setTransitStops(stops);
        }
      });
  };

  const loadBikeStations = () => {
    if (!bikeStationsLoaded && showTransitStops()) {
      setBikeStationsLoaded(true);
      // Load bike stations only once as all the bike stations are fetched.
      fetchBikeStations()
        .then(stations => {
          const list = stations?.data?.bikeRentalStations || [];
          setRentalBikeStations(list);
          setVisibleBikeStations(showTransitStops() ? list : []);
        });
    }
  };

  const clearTransitStops = () => {
    setTransitStops([]);
  };

  const handleTransit = () => {
    if (showTransitStops()) {
      fetchTransitStops();
      loadBikeStations();
      setVisibleBikeStations(rentalBikeStations);
    } else {
      if (transitStops.length) {
        clearTransitStops();
      }
      if (visibleBikeStations.length) {
        setVisibleBikeStations([]);
      }
    }
  };

  useEffect(() => {
    loadBikeStations();
  }, []);

  const getTransitIcon = type => {
    const { divIcon } = global.L;
    const { color, className } = getTypeAndClass(type);
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span aria-hidden className={`${transitBackgroundClass} icon-icon-hsl-background`} />
          <StyledTransitIconMap aria-hidden color={useContrast ? '#000000' : color} className={className} />
        </>,
      ),
      iconSize: [transitIconSize, transitIconSize],
      popupAnchor: [0, -13],
    });
  };

  const closePopup = () => {
    map.closePopup();
  };

  if (!showTransitStops()) return null;

  return (
    <>
      {transitStops.map(stop => {
        const icon = getTransitIcon(stop.vehicleMode);
        return (
          <Marker
            icon={icon}
            key={stop.name.fi + stop.gtfsId}
            position={[stop.lat, stop.lon]}
            keyboard={false}
          >
            <div aria-hidden>
              <Popup closeButton={false} className="popup" autoPan={isMobile}>
                <TransitStopInfo
                  stop={stop}
                  onCloseClick={() => closePopup()}
                />
              </Popup>
            </div>
          </Marker>
        );
      })}
      {rentalBikeStations.map(station => {
        const icon = getTransitIcon(7);
        return (
          <Marker
            icon={icon}
            key={`${station.name}+${station.stationId}`}
            position={[station.lat, station.lon]}
            keyboard={false}
          >
            <div aria-hidden>
              <Popup closeButton={false} className="popup" autoPan={isMobile}>
                <TransitStopInfo
                  stop={station}
                  type="bikeStation"
                  onCloseClick={() => closePopup()}
                />
              </Popup>
            </div>
          </Marker>
        );
      })}
    </>
  );
}

TransitStops.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TransitStops;
