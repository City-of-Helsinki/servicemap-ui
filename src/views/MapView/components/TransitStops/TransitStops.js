/* eslint-disable global-require, no-use-before-define */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';

import {
  selectSelectedDistrictType,
  selectSelectedSubdistricts,
} from '../../../../redux/selectors/district';
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
  const selectedSubdistricts = useSelector(selectSelectedSubdistricts);
  const selectedDistrictType = useSelector(selectSelectedDistrictType);
  const { Marker, Popup } = global.rL;
  const theme = useTheme();

  const [transitStops, setTransitStops] = useState([]);
  const [cachedTransitStops, setCachedTransitStops] = useState([]);
  const [transitStopsLoaded, setTransitStopsLoaded] = useState(false);
  const [rentalBikeStations, setRentalBikeStations] = useState([]);
  const [visibleBikeStations, setVisibleBikeStations] = useState([]);
  const [bikeStationsLoaded, setBikeStationsLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(0);
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
    moveend: handleMapChange,
    zoomend: handleMapChange,
  });

  function handleMapChange() {
    const newZoom = map.getZoom();

    // ALWAYS update zoom state to trigger re-render
    setCurrentZoom(newZoom);

    handleTransit(newZoom);
  }

  // Check if transit stops should be shown
  const showTransitStops = (zoomLevel = null) => {
    const transitZoom = isMobile
      ? mapObject.options.detailZoom - 1
      : mapObject.options.detailZoom;

    const zoomToCheck = zoomLevel ?? currentZoom ?? (map ? map.getZoom() : 0);

    const url = new URL(window.location);
    const embeded = isEmbed({ url: url.toString() });
    const showTransit = !embeded || url.searchParams.get('transit') === '1';

    return zoomToCheck >= transitZoom && showTransit;
  };

  const fetchTransitStops = () => {
    if (!transitStopsLoaded) {
      setTransitStopsLoaded(true);
      fetchStops(map)
        .then((stops) => {
          setCachedTransitStops(stops);
          setTransitStops(stops);
        })
        .catch(() => {
          setTransitStopsLoaded(false);
        });
    }
  };

  const loadBikeStations = () => {
    if (!bikeStationsLoaded) {
      setBikeStationsLoaded(true);
      fetchBikeStations()
        .then((stations) => {
          const list = stations?.data?.bikeRentalStations || [];
          setRentalBikeStations(list);
          setVisibleBikeStations(list);
        })
        .catch(() => {
          setBikeStationsLoaded(false);
        });
    }
  };

  const handleTransit = (zoomLevel = null) => {
    if (showTransitStops(zoomLevel)) {
      if (transitStopsLoaded) {
        setTransitStops(cachedTransitStops);
      } else {
        fetchTransitStops();
      }

      if (bikeStationsLoaded) {
        setVisibleBikeStations(rentalBikeStations);
      } else {
        loadBikeStations();
      }
    } else {
      setTransitStops([]);
      setVisibleBikeStations([]);
    }
  };

  useEffect(() => {
    fetchTransitStops();
    loadBikeStations();
    handleTransit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map) {
      setCurrentZoom(map.getZoom());
    }
  }, [map]);

  // Clear transit stops when district selection changes
  useEffect(() => {
    setTransitStops([]);
    setCachedTransitStops([]);
    setTransitStopsLoaded(false);
    setVisibleBikeStations([]);
    setRentalBikeStations([]);
    setBikeStationsLoaded(false);
  }, [selectedSubdistricts, selectedDistrictType]);

  const getTransitIcon = (type) => {
    const { divIcon } = global.L;
    const { color, className } = getTypeAndClass(type);
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span
            aria-hidden
            className={`${transitBackgroundClass} icon-icon-hsl-background`}
          />
          <StyledTransitIconMap
            aria-hidden
            color={useContrast ? '#000000' : color}
            className={className}
          />
        </>
      ),
      iconSize: [transitIconSize, transitIconSize],
      popupAnchor: [0, -13],
    });
  };

  const closePopup = () => {
    map.closePopup();
  };

  if (!showTransitStops()) {
    return null;
  }

  return (
    <>
      {transitStops.map((stop) => {
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
      {visibleBikeStations.map((station) => {
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
