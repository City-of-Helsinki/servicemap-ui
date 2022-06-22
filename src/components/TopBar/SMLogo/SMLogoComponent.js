import { ButtonBase, NoSsr } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import HomeLogo from '../../Logos/HomeLogo';
import { isHomePage } from '../../../utils/path';

const SMLogoComponent = ({
  onClick,
  classes,
}) => {
  const intl = useIntl();
  const theme = useSelector(state => state.user.theme);
  const location = useLocation();
  const isOnHomePage = isHomePage(location?.pathname);
  return (
    <ButtonBase aria-current={isOnHomePage ? 'page' : null} aria-label={intl.formatMessage({ id: 'general.home.logo.ariaLabel' })} role="link" onClick={onClick}>
      <NoSsr>
        <HomeLogo aria-hidden contrast={theme === 'dark'} className={classes.logo} />
      </NoSsr>
    </ButtonBase>
  );
};

SMLogoComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    logo: PropTypes.string,
  }).isRequired,
};

export default SMLogoComponent;
