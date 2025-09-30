/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  breadcrumbPop,
  breadcrumbPush,
  breadcrumbReplace,
} from '../../redux/actions/breadcrumb';
import { selectBreadcrumb } from '../../redux/selectors/general';
import { selectResultsPreviousSearch } from '../../redux/selectors/results';
import { generatePath as generatePathUtil, isEmbed } from '../../utils/path';

const Navigator = forwardRef((props, ref) => {
  const { breadcrumb, breadcrumbPush, breadcrumbPop } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const prevPathNameRef = useRef(null);

  /**
   * Generate url based on path string and data
   * @param target - Key string for path config
   * @param data - Data for path used if target is path key
   * @param embed - Override isEmbed() check
   */
  const generatePath = useCallback(
    (target, data, embed) => {
      const locale = params && params.lng;

      const isEmbeddableView = target !== 'info' && target !== 'feedback';

      let embedValue = false;

      if (isEmbeddableView) {
        embedValue = typeof embed !== 'undefined' ? embed : isEmbed();
      }

      return generatePathUtil(target, locale, data, embedValue);
    },
    [params]
  );

  /**
   * Go back in history if breadcrumbs has values otherwise return to home view
   */
  const goBack = useCallback(() => {
    // If breadcrumb has values go back else take user to home
    if (breadcrumb && breadcrumb.length > 0) {
      const previousLocation = breadcrumb[breadcrumb.length - 1]?.location;
      breadcrumbPop();

      if (previousLocation) {
        // Navigate to the specific previous location instead of using navigate(-1)
        if (typeof previousLocation === 'string') {
          navigate(previousLocation);
        } else if (previousLocation.pathname) {
          const path =
            previousLocation.pathname + (previousLocation.search || '');
          navigate(path);
        } else {
          navigate(-1); // Fallback to browser back
        }
      } else {
        navigate(-1); // Fallback to browser back
      }
    } else {
      navigate(generatePath('home', null, false));
      breadcrumbPush({ location });
    }
  }, [
    breadcrumb,
    navigate,
    breadcrumbPop,
    generatePath,
    breadcrumbPush,
    location,
  ]);

  /**
   * Push current location to history
   * @param target - String key for path config or object for history location
   * @param data - Data for path used if target is path key
   */
  const push = useCallback(
    (target, data, focusTarget) => {
      try {
        if (typeof target === 'string') {
          const path = generatePath(target, data);
          navigate(path);
          breadcrumbPush({ location, focusTarget });
        } else if (typeof target === 'object') {
          navigate(target);
          breadcrumbPush({ location, focusTarget });
        } else {
          throw Error(`Invalid target given to navigator push: ${target}`);
        }
      } catch (e) {
        console.warn('Warning:', e.message);
      }
    },
    [generatePath, navigate, breadcrumbPush, location]
  );

  /**
   * Replace current location in history
   * @param target - String key for path config or object for history location
   * @param data - Data for path used if target is path key
   */
  const replace = useCallback(
    (target, data) => {
      try {
        if (typeof target === 'string') {
          navigate(generatePath(target, data), { replace: true });
        } else if (typeof target === 'object') {
          navigate(target, { replace: true });
        } else {
          throw Error('Invalid target given to navigator replace');
        }
      } catch (e) {
        console.warn('Warning:', e.message);
      }
    },
    [generatePath, navigate]
  );

  // Add map param to url
  const openMap = useCallback(() => {
    const url = new URL(window.location);

    url.searchParams.set('showMap', 'true');
    // TODO: better way to normalize spaces in url
    const searchString = url.search.replace('+', ' ');
    navigate(url.pathname + searchString);
  }, [navigate]);

  // Remove map param from url
  const closeMap = useCallback(
    (replace) => {
      const url = new URL(window.location);

      url.searchParams.delete('showMap');
      if (replace) {
        navigate(-1);
      } else {
        navigate(url.pathname + url.search);
      }
    },
    [navigate]
  );

  const closeFeedback = useCallback(
    (unitID) => {
      if (unitID && !breadcrumb.length) {
        replace('unit', { id: unitID });
        return;
      }
      goBack();
    },
    [breadcrumb, replace, goBack]
  );

  const setParameter = useCallback(
    (param, value) => {
      const url = new URL(window.location);

      url.searchParams.set(param, value);
      navigate(url.pathname + url.search, { replace: true });
    },
    [navigate]
  );

  const removeParameter = useCallback(
    (param) => {
      const url = new URL(window.location);

      url.searchParams.delete(param);
      navigate(url.pathname + url.search, { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    prevPathNameRef.current = location.pathname;
  }, [location.pathname]);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      generatePath,
      goBack,
      push,
      replace,
      openMap,
      closeMap,
      closeFeedback,
      setParameter,
      removeParameter,
    }),
    [
      generatePath,
      goBack,
      push,
      replace,
      openMap,
      closeMap,
      closeFeedback,
      setParameter,
      removeParameter,
    ]
  );

  return null;
});

Navigator.propTypes = {
  breadcrumb: PropTypes.arrayOf(PropTypes.any).isRequired,
  breadcrumbPush: PropTypes.func.isRequired,
  breadcrumbPop: PropTypes.func.isRequired,
};

// Listen to redux state
const mapStateToProps = (state) => ({
  breadcrumb: selectBreadcrumb(state),
  previousSearch: selectResultsPreviousSearch(state),
});

export default connect(
  mapStateToProps,
  {
    breadcrumbPush,
    breadcrumbPop,
    breadcrumbReplace,
  },
  null,
  { forwardRef: true }
)(Navigator);
