import { ButtonBase, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import LocaleUtility from '../../../utils/locale';

const LanguageMenuComponent = ({
  mobile,
  classes,
}) => {
  const locale = useSelector(state => state.user.locale);
  const location = useLocation();
  const typographyClass = className => `${mobile ? classes.mobileFont : ''} ${className || ''}`;
  return (
    <>
      {LocaleUtility.availableLocales
        .map(currentLocale => (
          <ButtonBase
            aria-current={currentLocale === locale ? 'true' : false}
            role="link"
            key={currentLocale}
            focusVisibleClassName={classes.topButtonFocused}
            lang={currentLocale}
            onClick={() => {
              const newLocation = location;
              const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}/, `/${currentLocale}`);
              newLocation.pathname = newPath;
              window.location = `${newLocation.pathname}${newLocation.search}`;
            }}
          >
            <Typography
              className={typographyClass(
                currentLocale === locale
                  ? classes.bold
                  : classes.greyText,
              )}
              color="inherit"
              variant="body2"
            >
              <FormattedMessage id={`general.language.${currentLocale}`} />
            </Typography>
          </ButtonBase>
        ))}
    </>
  );
};

LanguageMenuComponent.propTypes = {
  classes: PropTypes.shape({
    bold: PropTypes.string,
    greyText: PropTypes.string,
    mobileFont: PropTypes.string,
    topButtonFocused: PropTypes.string,
  }).isRequired,
  mobile: PropTypes.bool,
};

LanguageMenuComponent.defaultProps = {
  mobile: false,
};

export default LanguageMenuComponent;
