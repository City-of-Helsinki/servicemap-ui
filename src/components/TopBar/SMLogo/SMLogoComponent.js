import { ButtonBase, NoSsr } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { selectThemeMode } from '../../../redux/selectors/user';
import HomeLogo from '../../Logos/HomeLogo';
import { isHomePage } from '../../../utils/path';
import useMobileStatus from '../../../utils/isMobile';

const SMLogoComponent = ({ onClick, small }) => {
  const intl = useIntl();
  const themeMode = useSelector(selectThemeMode);
  const location = useLocation();
  const isOnHomePage = isHomePage(location?.pathname);
  const isMobile = useMobileStatus();
  return (
    <ButtonBase aria-current={isOnHomePage ? 'page' : null} aria-label={intl.formatMessage({ id: 'general.home.logo.ariaLabel' })} role="link" onClick={onClick}>
      <NoSsr>
        <StyledHomeLogo aria-hidden contrast={themeMode === 'dark'} mobile={+isMobile} small={small} />
      </NoSsr>
    </ButtonBase>
  );
};

const StyledHomeLogo = styled(HomeLogo)(({ mobile }) => ({
  height: mobile ? 25 : 29,
}));

SMLogoComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

SMLogoComponent.defaultProps = {
  small: false,
};

export default SMLogoComponent;
