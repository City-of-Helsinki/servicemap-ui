import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { children, classes, errorComponent } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      const defaultComponent = (
        <div className={classes.container}>
          <h1 className={classes.text}>Something went wrong</h1>
        </div>
      );
      const renderedContent = errorComponent || defaultComponent;
      // You can render any custom fallback UI
      return renderedContent;
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
