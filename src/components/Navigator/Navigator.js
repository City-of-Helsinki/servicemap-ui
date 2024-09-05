import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config';
import { breadcrumbPop, breadcrumbPush, breadcrumbReplace } from '../../redux/actions/breadcrumb';
import { selectBreadcrumb, selectTracker } from '../../redux/selectors/general';
import { selectResultsPreviousSearch } from '../../redux/selectors/results';
import { selectMobility, selectSenses } from '../../redux/selectors/settings';
import { generatePath, isEmbed } from '../../utils/path';
import { servicemapTrackPageView } from '../../utils/tracking';

const getHelsinkiCookie = () => {
  const pairs = document.cookie.split(';');
  const cookies = {};
  pairs.forEach(item => {
    const pair = item.split('=');
    const key = (`${pair[0]}`).trim();
    const string = pair.slice(1).join('=');
    cookies[key] = decodeURIComponent(string);
  });
  const helsinkiCookie = cookies?.['city-of-helsinki-cookie-consents'];
  return helsinkiCookie ? JSON.parse(helsinkiCookie) : null;
};

const shouldSentAnalytics = () => {
  if (typeof window === 'undefined' || isEmbed()) {
    return false;
  }
  return getHelsinkiCookie()?.matomo;
};

class Navigator extends React.Component {
  unlisten = null;

  /**
   * To prevent situation where setting an url param triggers history.listen callback resulting
   * in multiple sent "stats" calls
   */
  prevPathName = null;

  componentDidMount() {
    const {
      history,
      mobility,
      senses,
    } = this.props;

    this.prevPathName = history.location.pathname;
    // Initial pageView tracking on first load
    this.trackPageView({ mobility, senses });
    if (this.unlisten) {
      this.unlisten();
    }
    // Add event listener to listen history changes and track new pages
    this.unlisten = history.listen(this.historyCallBack(mobility, senses));
  }

  // We need to update history tracking event when settings change
  componentDidUpdate() {
    const {
      history,
      mobility,
      senses,
    } = this.props;

    if (this.unlisten) {
      this.unlisten();
    }
    this.unlisten = history.listen(this.historyCallBack(mobility, senses));
  }

  componentWillUnmount() {
    // Remove history listener
    if (this.unlisten) {
      this.unlisten();
    }
  }

  trackPageView = ({ mobility, senses }) => {
    const { tracker } = this.props;

    // Simple custom servicemap page view tracking
    servicemapTrackPageView();
    if (tracker && shouldSentAnalytics()) {
      setTimeout(() => {
        tracker.trackPageView({
          documentTitle: document.title,
          customDimensions: [
            { id: config.matomoMobilityDimensionID, value: mobility || '' },
            { id: config.matomoSensesDimensionID, value: senses?.join(',') },
          ],
        });
      }, 400);
    }
  };

  trackNoResultsPage = (noResultsQuery) => {
    const { tracker } = this.props;
    if (tracker && shouldSentAnalytics()) {
      this.unlisten = null;
      setTimeout(() => {
        tracker.trackPageView({
          documentTitle: document.title,
          customDimensions: [
            { id: config.matomoNoResultsDimensionID, value: noResultsQuery },
          ],
        });
      }, 400);
    }
  };

  /**
   * Generate url based on path string and data
   * @param target - Key string for path config
   * @param data - Data for path used if target is path key
   * @param embed - Override isEmbed() check
   */
  generatePath = (target, data, embed) => {
    const { match } = this.props;
    const { params } = match;
    const locale = params && params.lng;

    const isEmbeddableView = target !== 'info' && target !== 'feedback';
    const embedValue = isEmbeddableView ? (typeof embed !== 'undefined' ? embed : isEmbed()) : false;

    return generatePath(target, locale, data, embedValue);
  }


  /**
   * Go back in history if breadcrumbs has values otherwise return to home view
   */
  goBack = () => {
    const {
      breadcrumb,
      breadcrumbPop,
      history,
      location,
    } = this.props;

    // If breadcrumb has values go back else take user to home
    if (breadcrumb && breadcrumb.length > 0) {
      history.goBack();
      breadcrumbPop();
    } else {
      history.push(this.generatePath('home', null, false));
      breadcrumbPush({ location });
    }
  }


  /**
   * Push current location to history
   * @param target - String key for path config or object for history location
   * @param data - Data for path used if target is path key
   */
  push = (target, data, focusTarget) => {
    const {
      breadcrumbPush,
      history,
      location,
    } = this.props;

    try {
      if (typeof target === 'string') {
        const path = this.generatePath(target, data);
        history.push(path);
        breadcrumbPush({ location, focusTarget });
      } else if (typeof target === 'object') {
        history.push(target);
        breadcrumbPush({ location, focusTarget });
      } else {
        throw Error(`Invalid target given to navigator push: ${target}`);
      }
    } catch (e) {
      console.warn('Warning:', e.message);
    }
  }

  /**
   * Replace current location in history
   * @param target - String key for path config or object for history location
   * @param data - Data for path used if target is path key
   */
  replace = (target, data) => {
    const {
      history,
    } = this.props;

    try {
      if (typeof target === 'string') {
        history.replace(this.generatePath(target, data));
      } else if (typeof target === 'object') {
        history.replace(target);
      } else {
        throw Error('Invalid target given to navigator replace');
      }
    } catch (e) {
      console.warn('Warning:', e.message);
    }
  }

  // Add map param to url
  openMap = () => {
    const { history } = this.props;
    const url = new URL(window.location);

    url.searchParams.set('showMap', 'true');
    // TODO: better way to normalize spaces in url
    const searchString = url.search.replace('+', ' ');
    history.push(url.pathname + searchString);
  }

  // Remove map param from url
  closeMap = (replace) => {
    const { history } = this.props;
    const url = new URL(window.location);

    url.searchParams.delete('showMap');
    if (replace) {
      history.goBack();
    } else {
      history.push(url.pathname + url.search);
    }
  }

  closeFeedback = (unitID) => {
    const { breadcrumb } = this.props;
    if (unitID && !breadcrumb.length) {
      this.replace('unit', { id: unitID });
      return;
    }
    this.goBack();
  }

  setParameter = (param, value) => {
    const { history } = this.props;
    const url = new URL(window.location);

    url.searchParams.set(param, value);
    history.replace(url.pathname + url.search);
  }

  removeParameter = (param) => {
    const { history } = this.props;
    const url = new URL(window.location);

    url.searchParams.delete(param);
    history.replace(url.pathname + url.search);
  }

  historyCallBack(mobility, senses) {
    return (a) => {
      if (this.prevPathName === a.pathname) {
        return;
      }
      this.prevPathName = a.pathname;
      this.trackPageView({ mobility, senses });
    };
  }

  render = () => null;
}

Navigator.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  breadcrumbPush: PropTypes.func.isRequired,
  breadcrumbPop: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  senses: PropTypes.arrayOf(PropTypes.string),
  mobility: PropTypes.string,
  tracker: PropTypes.objectOf(PropTypes.any),
};

Navigator.defaultProps = {
  senses: null,
  mobility: null,
  tracker: null,
};

// Listen to redux state
const mapStateToProps = state => ({
  breadcrumb: selectBreadcrumb(state),
  previousSearch: selectResultsPreviousSearch(state),
  mobility: selectMobility(state),
  senses: selectSenses(state),
  tracker: selectTracker(state),
});

export default connect(
  mapStateToProps,
  {
    breadcrumbPush, breadcrumbPop, breadcrumbReplace,
  },
  null,
  { forwardRef: true },
)(Navigator);
