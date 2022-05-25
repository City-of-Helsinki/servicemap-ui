import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { visuallyHidden } from '@mui/utils';
import { Typography } from '@mui/material';
import { viewTitleID } from '../../../../utils/accessibility';

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
      // If cookiehub banner is visible prevent focusing
      let shouldFocus = true;
      try {
        const chDialog = document.querySelectorAll('section.ch2 div[role="dialog"]');
        if (chDialog?.length > 0) {
          chDialog.forEach((v) => { shouldFocus = shouldFocus && v.style.display === 'none'; });
        }
      } catch (e) {
        console.warn('Error while attempting to figure out if cookiehub banner exists');
      }

      // Focus to site title on first load if cookihub banner is hidden
      const appTitle = document.getElementById('app-title');
      if (appTitle && shouldFocus) {
        appTitle.focus();
      }
    }
  }

  render() {
    const { messageId, match, location } = this.props;
    const type = match.params.type || '';

    let message = messageId;

    if (location.search.includes('feedback=true')) {
      message = 'general.pageTitles.feedback';
    }

    return (
      <Typography id={viewTitleID} style={visuallyHidden} component="h2" tabIndex="-1" ref={this.titleRef}>
        <FormattedMessage id={message + type} />
      </Typography>
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
