import React from 'react';
import PropTypes from 'prop-types';
import ErrorComponent from './ErrorComponent';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <ErrorComponent error="error" />;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  errorComponent: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  errorComponent: null,
};

export default ErrorBoundary;
