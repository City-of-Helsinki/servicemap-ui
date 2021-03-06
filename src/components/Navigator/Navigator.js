import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUnits } from '../../redux/actions/unit';
import { breadcrumbPush, breadcrumbPop, breadcrumbReplace } from '../../redux/actions/breadcrumb';
import { generatePath } from '../../utils/path';

class Navigator extends React.Component {
  unlisten = null;

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
      breadcrumbPop,
      history,
      location,
    } = this.props;

    // If breadcrumb has values go back else take user to home
    if (breadcrumb && breadcrumb.length > 0) {
      history.goBack();
      breadcrumbPop();
    } else {
      history.push(this.generatePath('home'));
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

  render = () => null;
}

Navigator.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  breadcrumbPush: PropTypes.func.isRequired,
  breadcrumbPop: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

Navigator.defaultProps = {};

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
