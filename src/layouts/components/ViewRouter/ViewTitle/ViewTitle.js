import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Typography, RootRef } from '@material-ui/core';

class ViewTitle extends React.Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    const { initialLoad, actionSetInitialLoad, location } = this.props;
    if (location.hash && location.hash !== '') {
      const elem = document.querySelector(location.hash);
      if (elem) {
        elem.focus();
        return;
      }
    }
    if (initialLoad) {
      if (this.titleRef.current) {
        this.titleRef.current.focus();
      }
    } else {
      actionSetInitialLoad();
      // Focus to site title on first load
      const appTitle = document.getElementById('app-title');
      if (appTitle) {
        appTitle.focus();
      }
    }
  }

  render() {
    const { messageId, match } = this.props;
    const type = match.params.type || '';

    return (
      <RootRef rootRef={this.titleRef}>
        <Typography id="view-title" variant="srOnly" component="h2" tabIndex="-1">
          <FormattedMessage id={messageId + type} />
        </Typography>
      </RootRef>
    );
  }
}

ViewTitle.propTypes = {
  initialLoad: PropTypes.bool.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  messageId: PropTypes.string.isRequired,
  actionSetInitialLoad: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ViewTitle;
