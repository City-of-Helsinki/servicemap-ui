import {
  ButtonBase, Menu, MenuItem, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Language } from '@mui/icons-material';
import LocaleUtility from '../../../utils/locale';
import MobileNavButton from '../MobileNavButton/MobileNavButton';

const LanguageMenuComponent = ({
  mobile,
  classes,
}) => {
  const locale = useSelector(state => state.user.locale);
  const location = useLocation();
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const typographyClass = className => `${mobile ? classes.mobileFont : ''} ${className || ''}`;

  const changeLang = (value) => {
    const newLocation = location;
    const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}/, `/${value}`);
    newLocation.pathname = newPath;
    window.location = `${newLocation.pathname}${newLocation.search}`;
  };

  if (!mobile) {
    return (
      <>
        {LocaleUtility.availableLocales
          .map(currentLocale => (
            <ButtonBase
              sx={{ mr: 3, height: '100%', whiteSpace: 'nowrap' }}
              aria-current={currentLocale === locale ? 'true' : false}
              role="link"
              key={currentLocale}
              focusVisibleClassName={classes.topButtonFocused}
              lang={currentLocale}
              onClick={() => changeLang(currentLocale)}
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
  }

  // Mobile version

  const handleMobileClose = (value) => {
    setLangAnchorEl(null);
    if (value) {
      if (value === locale) return;
      changeLang(value);
    }
  };
  return (
    <>
      <MobileNavButton
        id="mobile-lang-button"
        text={<FormattedMessage id={`general.language.${locale}`} />}
        icon={<Language />}
        aria-haspopup="true"
        aria-expanded={!!langAnchorEl}
        showBorder
        onClick={(event) => {
          if (langAnchorEl) handleMobileClose();
          else setLangAnchorEl(event.currentTarget);
        }}
      />
      <Menu
        sx={{ ml: '-18px' }}
        anchorEl={langAnchorEl}
        open={!!langAnchorEl}
        onClose={() => handleMobileClose()}
        MenuListProps={{
          'aria-labelledby': 'mobile-lang-button',
          sx: { p: 0 },
        }}
      >
        {LocaleUtility.availableLocales
          .map(currentLocale => (
            <MenuItem key={currentLocale} sx={{ pt: 0, pb: 0, justifyContent: 'center' }} onClick={() => handleMobileClose(currentLocale)}>
              <Typography><FormattedMessage id={`general.language.${currentLocale}`} /></Typography>
            </MenuItem>
          ))
        }
      </Menu>
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
