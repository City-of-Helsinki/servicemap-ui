import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { viewTitleID } from '../../../../utils/accessibility';
import { COOKIE_MODAL_ROOT_ID } from '../../../../utils/constants';

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

      setTimeout(() => {
        // If cookie modal is visible prevent focusing
        let shouldFocus = true;
        try {
          shouldFocus = !document.getElementById(COOKIE_MODAL_ROOT_ID);
        } catch (e) {
          console.warn(
            'Error while attempting to figure out if cookie modal exists'
          );
        }

        // Focus to site title on first load if cookihub banner is hidden
        const appTitle = document.getElementById('app-title');
        if (appTitle && shouldFocus) {
          appTitle.focus();
        }
      }, 800);
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
      <Typography
        id={viewTitleID}
        style={visuallyHidden}
        component="h2"
        tabIndex={-1}
        ref={this.titleRef}
      >
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
