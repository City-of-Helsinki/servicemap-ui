import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnits } from '../../redux/actions/unit';
import { breadcrumbPush, breadcrumbPop, breadcrumbReplace } from '../../redux/actions/breadcrumb';
import { generatePath } from '../../utils/path';
import { parseSearchParams } from '../../utils';
import paths from '../../../config/paths';

class Navigator extends React.Component {
  unlisten = null;

  constructor(props) {
    super(props);

    const {
      history,
    } = props;

    // Listen history and handle changes
    this.unlisten = history.listen((newLocation, action) => {
      const {
        breadcrumbPush, breadcrumbPop, breadcrumbReplace, fetchUnits, location, previousSearch,
      } = this.props;

      // Get search params
      const searchParams = parseSearchParams(newLocation.search);
      const searchParam = searchParams.q || null;

      // If page is search
      // and previousSearch is not current new location's params
      // then fetch units with new location's search params
      if (paths.search.regex.exec(newLocation.pathname) && previousSearch !== searchParam) {
        // fetchUnits([], null, searchParam);
      }

      // Update breadcrumbs
      switch (action) {
        case 'PUSH':
          breadcrumbPush(location);
          break;
        case 'POP':
          breadcrumbPop();
          break;
        case 'REPLACE':
          breadcrumbReplace(location);
          break;
        default:
      }
      // this.unlisten();
    });
  }

  componentWillUnmount() {
    // Remove history listener
    if (this.unlisten) {
      this.unlisten();
    }
  }

  /**
   * Generate url based on path string and data
   * @param target - Key string for path config
   * @param data - Data for path used if target is path key
   */
  generatePath = (target, data) => {
    const { match } = this.props;
    const { params } = match;
    const locale = params && params.lng;

    return generatePath(target, locale, data);
  }


  /**
   * Go back in history if breadcrumbs has values otherwise return to home view
   */
  goBack = () => {
    const {
      breadcrumb,
      history,
    } = this.props;

    // If breadcrumb has values go back else take user to home
    if (breadcrumb && breadcrumb.length > 0) {
      history.goBack();
    } else {
      history.push(this.generatePath('home'));
    }
  }


  /**
   * Push current location to history
   * @param target - String key for path config or object for history location
   * @param data - Data for path used if target is path key
   */
  push = (target, data) => {
    const {
      history,
    } = this.props;

    try {
      if (typeof target === 'string') {
        history.push(this.generatePath(target, data));
      } else if (typeof target === 'object') {
        history.push(target);
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

    url.searchParams.set('map', 'true');
    // TODO: better way to normalize spaces in url
    const searchString = url.search.replace('+', ' ');
    history.push(url.pathname + searchString);
  }

  // Remove map param from url
  closeMap = (replace) => {
    const { history } = this.props;
    const url = new URL(window.location);

    url.searchParams.delete('map');
    if (replace) {
      history.goBack();
    } else {
      history.push(url.pathname + url.search);
    }
  }

  render = () => null;
}

Navigator.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  breadcrumbPush: PropTypes.func.isRequired,
  breadcrumbPop: PropTypes.func.isRequired,
  breadcrumbReplace: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  previousSearch: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
};

Navigator.defaultProps = {
  previousSearch: null,
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { breadcrumb, units } = state;
  const { previousSearch } = units;
  return {
    breadcrumb,
    previousSearch,
  };
};

export default connect(
  mapStateToProps,
  {
    breadcrumbPush, breadcrumbPop, breadcrumbReplace, fetchUnits,
  },
  null,
  { forwardRef: true },
)(Navigator);
