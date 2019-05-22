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

  breadcrumbPush = (location) => {
    const { breadcrumb } = this.state;
    this.setState({
      breadcrumb: [
        ...breadcrumb,
        location,
      ],
    });
  }

  breadcrumbPop = () => {
    const { breadcrumb } = this.state;
    const newBreadcrumb = Array.from(breadcrumb);
    newBreadcrumb.pop();
    this.setState({
      breadcrumb: newBreadcrumb,
    });
  }

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

  generatePath = (target, data) => {
    const { match } = this.props;
    const { params } = match;
    const locale = params && params.lng;

    return generatePath(target, locale, data);
  }

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
