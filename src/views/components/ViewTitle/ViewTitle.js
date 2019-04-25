import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Typography, RootRef } from '@material-ui/core';
import { setInitialLoadAction } from '../../../redux/actions/user';

class ViewTitle extends React.Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    const { initialLoad, setInitialLoadAction } = this.props;
    if (initialLoad) {
      if (this.titleRef.current) {
        this.titleRef.current.focus();
      }
    } else {
      setInitialLoadAction();
      // Focus to site title on first load
      const siteTitle = document.getElementById('site-title');
      if (siteTitle) {
        siteTitle.focus();
      }
    }
  }

  render() {
    const { messageId } = this.props;
    return (
      <RootRef rootRef={this.titleRef}>
        <Typography id="view-title" variant="srOnly" component="h2" tabIndex="-1">
          <FormattedMessage id={messageId} />
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

export default connect(
  mapStateToProps,
  { setInitialLoadAction },
)(ViewTitle);

ViewTitle.propTypes = {
  initialLoad: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  setInitialLoadAction: PropTypes.func.isRequired,
};
