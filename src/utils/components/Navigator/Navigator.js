import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnits } from '../../../redux/actions/unit';
import { generatePath } from '../../path';
import { parseSearchParams } from '../..';
import paths from '../../../../config/paths';

class Navigator extends React.Component {
  unlisten = null;

  constructor(props) {
    super(props);

    const {
      history,
    } = props;

    this.state = {
      breadcrumb: [],
    };

    // Listen history and handle changes
    this.unlisten = history.listen((location, action) => {
      const {
        fetchUnits, previousSearch,
      } = this.props;

      // Get search params
      const searchParams = parseSearchParams(location.search);
      const searchParam = searchParams.q || null;

      // If page is search
      // and previousSearch is not current location's params
      // then fetch units with location's search params
      if (paths.search.regex.exec(location.pathname) && previousSearch !== searchParam) {
        fetchUnits([], null, searchParam);
      }

      // Update breadcrumbs
      switch (action) {
        case 'PUSH':
          this.breadcrumbPush(location);
          break;
        case 'POP':
          this.breadcrumbPop();
          break;
        case 'REPLACE':
          this.breadcrumbReplace(location);
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
   * Push new value to breadcrumbs
   */
  breadcrumbPush = (location) => {
    const { breadcrumb } = this.state;
    this.setState({
      breadcrumb: [
        ...breadcrumb,
        location,
      ],
    });
  }

  /**
   * Remove last location in breadcrumbs
   */
  breadcrumbPop = () => {
    const { breadcrumb } = this.state;
    const newBreadcrumb = Array.from(breadcrumb);
    newBreadcrumb.pop();
    this.setState({
      breadcrumb: newBreadcrumb,
    });
  }

  /**
   * Replace current value in breadcrumbs
   * @param location - Url string of path or object for history location
   */
  breadcrumbReplace = (location) => {
    const { breadcrumb } = this.state;
    const newBreadcrumb = Array.from(breadcrumb);
    newBreadcrumb.pop();
    this.setState({
      breadcrumb: [
        ...newBreadcrumb,
        location,
      ],
    });
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
      history,
    } = this.props;
    const {
      breadcrumb,
    } = this.state;

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

  render = () => null;
}

Navigator.propTypes = {
  fetchUnits: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  previousSearch: PropTypes.string,
};

Navigator.defaultProps = {
  previousSearch: null,
};

// Listen to redux state
const mapStateToProps = (state) => {
  const { units } = state;
  const { previousSearch } = units;
  return {
    previousSearch,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUnits,
  },
  null,
  { forwardRef: true },
)(Navigator);
