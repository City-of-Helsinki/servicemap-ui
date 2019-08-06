import React from 'react';
import PropTypes from 'prop-types';
import { DesktopComponent, MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import SearchBar from '../SearchBar';
import TitleBar from '../TitleBar';

const TopArea = ({
  classes, icon, title, placeholder,
}) => (
  <div className={`${classes.topContainer} sticky`}>
    <DesktopComponent>
      <SearchBar placeholder={placeholder} />
      <TitleBar icon={icon} title={title} primary />
    </DesktopComponent>
    <MobileComponent>
      <TitleBar title={title} primary backButton />
    </MobileComponent>
  </div>
);

TopArea.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  icon: PropTypes.objectOf(PropTypes.any),
  placeholder: PropTypes.string.isRequired,
  title: PropTypes.string,
};

TopArea.defaultProps = {
  icon: null,
  title: '',
};

export default TopArea;
