import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Typography, RootRef } from '@material-ui/core';
import { actionSetInitialLoad } from '../../../redux/actions/user';

class ViewTitle extends React.Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    const { initialLoad, actionSetInitialLoad } = this.props;
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

// State mapping to props
const mapStateToProps = (state) => {
  const { user } = state;
  return {
    initialLoad: user.initialLoad,
  };
};

export default withRouter(connect(
  mapStateToProps,
  { actionSetInitialLoad },
)(ViewTitle));

ViewTitle.propTypes = {
  initialLoad: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  actionSetInitialLoad: PropTypes.func.isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};
