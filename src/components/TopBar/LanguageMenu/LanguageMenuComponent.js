import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Language } from '@mui/icons-material';
import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getLocale } from '../../../redux/selectors/user';
import LocaleUtility from '../../../utils/locale';
import MobileNavButton from '../MobileNavButton/MobileNavButton';

function LanguageMenuComponent({ mobile = false }) {
  const locale = useSelector(getLocale);
  const location = useLocation();
  const [langAnchorEl, setLangAnchorEl] = useState(null);

  const changeLang = (value) => {
    const newLocation = location;
    const newPath = location.pathname.replace(/^\/[a-zA-Z]{2}/, `/${value}`);
    newLocation.pathname = newPath;
    window.location = `${newLocation.pathname}${newLocation.search}`;
  };

  if (!mobile) {
    const topButtonFocusedClass = css({
      boxShadow: '0 0 0 2px !important',
    });
    return (
      <>
        {LocaleUtility.availableLocales.map((currentLocale) => (
          <ButtonBase
            sx={{ mr: 3, height: '100%', whiteSpace: 'nowrap' }}
            aria-current={currentLocale === locale ? 'true' : false}
            role="link"
            key={currentLocale}
            focusVisibleClassName={topButtonFocusedClass}
            lang={currentLocale}
            onClick={() => changeLang(currentLocale)}
          >
            <StyledTypography
              mobile={+!!mobile}
              bold={+(currentLocale === locale)}
              color="inherit"
              variant="body2"
            >
              <FormattedMessage id={`general.language.${currentLocale}`} />
            </StyledTypography>
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
        {LocaleUtility.availableLocales.map((currentLocale) => (
          <MenuItem
            key={currentLocale}
            sx={{ pt: 0, pb: 0, justifyContent: 'center' }}
            onClick={() => handleMobileClose(currentLocale)}
          >
            <Typography>
              <FormattedMessage id={`general.language.${currentLocale}`} />
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const StyledTypography = styled(Typography)(({ theme, mobile, bold }) => {
  const styles = {};
  if (mobile) {
    Object.assign(styles, {
      ...theme.typography.caption,
      lineHeight: '13px',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      color: 'inherit',
    });
  }
  if (bold) {
    Object.assign(styles, {
      fontWeight: 'bold',
    });
  } else {
    // grey text
    Object.assign(styles, {
      color: '#DEDFE1',
    });
  }
  return styles;
});

LanguageMenuComponent.propTypes = {
  mobile: PropTypes.bool,
};

export default LanguageMenuComponent;
