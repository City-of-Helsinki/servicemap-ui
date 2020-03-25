/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import TransitStopInfo from './TransitStopInfo';
import { fetchStops } from '../../utils/transitFetch';
import { transitIconSize } from '../../config/mapConfig';

class TransitStops extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transitStops: [],
    };
  }

  componentDidMount() {
    const { map } = this.props;
    map.leafletElement.on('moveend', () => {
      this.handleTransit(map.leafletElement.getZoom());
    });
  }

  handleTransit = () => {
    const { transitStops } = this.state;
    if (this.showTransitStops()) {
      this.fetchTransitStops();
    } else if (transitStops.length) {
      this.clearTransitStops();
    }
  }

  fetchTransitStops = () => {
    const { map } = this.props;
    fetchStops(map.leafletElement)
      .then((stops) => {
        if (this.showTransitStops()) {
          this.setState({ transitStops: stops });
        }
      });
  }

  clearTransitStops = () => {
    this.setState({ transitStops: [] });
  }

  // Check if transit stops should be shown
  showTransitStops = () => {
    const { isMobile, mapObject, map } = this.props;
    const transitZoom = isMobile
      ? mapObject.options.mobileTransitZoom : mapObject.options.transitZoom;
    const currentZoom = map.leafletElement.getZoom();
    return currentZoom >= transitZoom;
  }

  getTransitIcon = (type) => {
    const { divIcon } = require('leaflet');
    const { classes } = this.props;
    let icon;

    switch (type) {
      case 3: // Bus stops
        icon = <span className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
      case 0: // Tram stops
        icon = <span className={`${classes.transitIconMap} ${classes.tramIconColor} icon-icon-hsl-tram`} />;
        break;
      case 109: // Train stops
        icon = <span className={`${classes.transitIconMap} ${classes.trainIconColor} icon-icon-hsl-train`} />;
        break;
      case 1: // Subway stops
        icon = <span className={`${classes.transitIconMap} ${classes.metroIconColor} icon-icon-hsl-metro`} />;
        break;
      case -999: case 4: // Ferry stops
        icon = <span className={`${classes.transitIconMap} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
        break;
      default:
        icon = <span className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
        break;
    }

    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span className={`${classes.transitBackground} icon-icon-hsl-background`} />
          {icon}
        </>,
      ),
      iconSize: [transitIconSize, transitIconSize],
    });
  }

  closePopup = () => {
    const { map } = this.props;
    map.leafletElement.closePopup();
  }

  render() {
    const { Marker, Popup, getLocaleText } = this.props;
    const { transitStops } = this.state;

    return (
      transitStops.map((stop) => {
        const icon = this.getTransitIcon(stop.vehicleType);
        return (
          <Marker
            icon={icon}
            key={stop.name.fi + stop.gtfsId}
            position={[stop.lat, stop.lon]}
            keyboard={false}
          >
            <Popup closeButton={false} className="popup" autoPan={false}>
              <TransitStopInfo
                stop={stop}
                onCloseClick={() => this.closePopup()}
                getLocaleText={getLocaleText}
              />
            </Popup>
          </Marker>
        );
      })
    );
  }
}

TransitStops.propTypes = {
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
};

TransitStops.defaultProps = {
  isMobile: false,
};

export default TransitStops;
