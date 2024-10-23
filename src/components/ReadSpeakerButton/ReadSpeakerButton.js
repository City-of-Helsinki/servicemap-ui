/* eslint-disable jsx-a11y/no-access-key */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import config from '../../../config';

const ReadSpeakerButton = ({
  className = null,
  encodedURL = null,
  intl,
  readID,
}) => {
  useEffect(() => {
    /**
     * ReadSpeaker fixes to fix click events and stop active player from
     * when changing view.
     * Important rspkr is not defined anywhere and works with internal query
     */
    const rs = window.ReadSpeaker;
    if (rs) {
      // eslint-disable-next-line no-undef
      rs.q(() => { rspkr.ui.addClickEvents(); });
    }
    return () => {
      if (rs) {
        rs.q(() => {
          // eslint-disable-next-line no-undef
          if (rspkr.ui.getActivePlayer()) {
            // eslint-disable-next-line no-undef
            rspkr.ui.getActivePlayer().close();
          }
        });
      }
    };
  }, []);

  const locale = intl && intl.locale ? config.readspeakerLocales[intl.locale] : null;
  if (!locale || !readID) {
    return null;
  }
  return (
    <div aria-hidden="true" id="readspeaker_button1" className={`rs_skip rsbtn rs_preserve ${className || ''}`}>
      <a
        rel="nofollow"
        className="rsbtn_play"
        // accessKey="L"
        title={intl.formatMessage({ id: 'general.readspeaker.title' })}
        href={`//app-eu.readspeaker.com/cgi-bin/rsent?customerid=11515&amp;lang=${locale}&amp;readid=${readID}&amp;${encodedURL ? `url=${encodedURL}` : ''}`}
      >
        <span className="rsbtn_left rsimg rspart">
          <span className="rsbtn_text">
            <span>
              <FormattedMessage id="general.readspeaker.buttonText" />
            </span>
          </span>
        </span>
        <span className="rsbtn_right rsimg rsplay rspart" />
      </a>
    </div>
  );
};

ReadSpeakerButton.propTypes = {
  className: PropTypes.string,
  encodedURL: PropTypes.string,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  readID: PropTypes.string.isRequired,
};

export default ReadSpeakerButton;
