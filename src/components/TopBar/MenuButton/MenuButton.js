import PropTypes from 'prop-types';
import { Close, Menu } from '@mui/icons-material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import MobileNavButton from '../MobileNavButton/MobileNavButton';


const MenuButton = ({
  drawerOpen, pageType, toggleDrawerMenu,
}) => {
  const intl = useIntl();
  const buttonLabelClass = css({
    display: 'flex',
    flexDirection: 'column',
  });

  return (
    <StyledMobileNavButton
      id="MenuButton"
      aria-label={intl.formatMessage({ id: 'general.menu' })}
      aria-expanded={drawerOpen}
      aria-haspopup="true"
      largebutton={+(pageType !== 'mobile')}
      classes={{ label: buttonLabelClass }}
      onClick={() => toggleDrawerMenu()}
      icon={drawerOpen ? <Close /> : <Menu />}
      text={drawerOpen ? <FormattedMessage id="general.close" /> : <FormattedMessage id="general.menu" />}
    />
  );
};

const StyledMobileNavButton = styled(MobileNavButton)(({ largebutton }) => (
  largebutton ? { height: 66 } : {}
));

MenuButton.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  toggleDrawerMenu: PropTypes.func.isRequired,
};

MenuButton.defaultProps = {
  pageType: null,
};

export default MenuButton;
