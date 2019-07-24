/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { withStyles } from '@material-ui/core';
import TransitStopInfo from './TransitStopInfo';
import { fetchStops } from '../utils/transitFetch';
import { transitIconSize } from '../config/mapConfig';
import styles from '../styles';

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
    const { isMobile, mapType, map } = this.props;
    const transitZoom = isMobile ? mapType.options.mobileTransitZoom : mapType.options.transitZoom;
    const currentZoom = map.leafletElement.getZoom();
    return currentZoom >= transitZoom;
  }

  getTransitIcon = (type) => {
    const { divIcon } = require('leaflet');
    const { classes } = this.props;
    let className = null;

    switch (type) {
      case 3: // Bus stops
        className = `${classes.busIcon} icon-icon-hsl-bus`;
        break;
      case 0: // Tram stops
        className = `${classes.tramIcon} icon-icon-hsl-tram`;
        break;
      case 109: // Train stops
        className = `${classes.trainIcon} icon-icon-hsl-train`;
        break;
      case 1: // Subway stops
        className = `${classes.metroIcon} icon-icon-hsl-metro`;
        break;
      case -999: // Ferry stops
        className = `${classes.ferryIcon} icon-icon-hsl-ferry`;
        break;
      default:
        className = `${classes.busIcon} icon-icon-hsl-bus`;
        break;
    }
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span className={`${classes.transitBackground} icon-icon-hsl-background`} />
          <span className={className} />
        </>,
      ),
      iconSize: [transitIconSize, transitIconSize],
    });
  }

  render() {
    const { Marker, Popup } = this.props;
    const { transitStops } = this.state;

    return (
      transitStops.map(stop => (
        <Marker
          icon={this.getTransitIcon(stop.vehicleType)}
          key={stop.name.fi + stop.gtfsId}
          position={[stop.lat, stop.lon]}
          keyboard={false}
        >
          <Popup autoPan={false}>
            <TransitStopInfo stop={stop} />
          </Popup>
        </Marker>
      ))
    );
  }
}

TransitStops.propTypes = {
  Marker: PropTypes.objectOf(PropTypes.any).isRequired,
  Popup: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.objectOf(PropTypes.any).isRequired,
  mapType: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
};

TransitStops.defaultProps = {
  isMobile: false,
};

export default withStyles(styles)(TransitStops);
