import { ButtonBase, NoSsr } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import HomeLogo from '../../Logos/HomeLogo';
import { isHomePage } from '../../../utils/path';
import useMobileStatus from '../../../utils/isMobile';

const SMLogoComponent = ({
  onClick,
  classes,
  small,
}) => {
  const intl = useIntl();
  const theme = useSelector(state => state.user.theme);
  const location = useLocation();
  const isOnHomePage = isHomePage(location?.pathname);
  const isMobile = useMobileStatus();
  return (
    <ButtonBase aria-current={isOnHomePage ? 'page' : null} aria-label={intl.formatMessage({ id: 'general.home.logo.ariaLabel' })} role="link" onClick={onClick}>
      <NoSsr>
        <HomeLogo aria-hidden contrast={theme === 'dark'} className={isMobile ? classes.mobileLogo : classes.logo} small={small} />
      </NoSsr>
    </ButtonBase>
  );
};

SMLogoComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
  classes: PropTypes.shape({
    logo: PropTypes.string,
    mobileLogo: PropTypes.string,
  }).isRequired,
};

SMLogoComponent.defaultProps = {
  small: false,
};

export default SMLogoComponent;
