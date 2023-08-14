/* eslint-disable global-require, no-use-before-define */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';
import TransitStopInfo from './TransitStopInfo';
import { fetchBikeStations, fetchStops } from '../../utils/transitFetch';
import { transitIconSize } from '../../config/mapConfig';
import { isEmbed } from '../../../../utils/path';
import useMobileStatus from '../../../../utils/isMobile';

const TransitStops = ({ mapObject, classes }) => {
  const isMobile = useMobileStatus();
  const { Marker, Popup } = global.rL;

  const [transitStops, setTransitStops] = useState([]);
  const [rentalBikeStations, setRentalBikeStations] = useState([]);
  const [visibleBikeStations, setVisibleBikeStations] = useState([]);
  const [bikeStationsLoaded, setBikeStationsLoaded] = useState(false);

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
      .then((stops) => {
        if (showTransitStops()) {
          setTransitStops(stops);
        }
      });
  };

  const clearTransitStops = () => {
    setTransitStops([]);
  };

  const handleTransit = () => {
    if (showTransitStops()) {
      fetchTransitStops();
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
    if (!bikeStationsLoaded) {
      fetchBikeStations()
        .then((stations) => {
          const list = stations?.data?.bikeRentalStations || [];
          if (list?.length) setRentalBikeStations(list);
          setBikeStationsLoaded(true);
          setVisibleBikeStations(showTransitStops() ? list : []);
        });
    }
  }, []);

  const getTransitIcon = (type) => {
    const { divIcon } = require('leaflet');
    let icon;

    switch (type) {
      case 3: // Bus stops
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
      case 0: // Tram stops
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.tramIconColor} icon-icon-hsl-tram`} />;
        break;
      case 109: // Train stops
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.trainIconColor} icon-icon-hsl-train`} />;
        break;
      case 1: // Subway stops
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.metroIconColor} icon-icon-hsl-metro`} />;
        break;
      case 7: // Bike stations
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.bikeIconColor} icon-icon-hsl-bike`} />;
        break;
      case -999: case 4: // Ferry stops
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
        break;
      default:
        icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
    }

    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span aria-hidden className={`${classes.transitBackground} icon-icon-hsl-background`} />
          {icon}
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
      {transitStops.map((stop) => {
        const icon = getTransitIcon(stop.vehicleType);
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
      {rentalBikeStations.map((station) => {
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
};

TransitStops.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

TransitStops.defaultProps = {
};

export default TransitStops;
