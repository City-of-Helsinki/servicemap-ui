import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-leaflet';

const HideSidebarButton = ({
  classes, sidebarHidden, toggleSidebar,
}) => {
  const map = useMap();
  return (
    <ButtonBase
      aria-hidden
      className={`${classes.hideSidebarButton} ${sidebarHidden ? classes.fullLength : ''}`}
      classes={{ focusVisible: classes.keyboardFocus }}
      onClick={() => {
        toggleSidebar();
        // Update lealfet map size after sidebar has been hidden
        setTimeout(() => (
        map?.invalidateSize()
        ), 1);
      }}
    >
      <div className={`${classes.buttonContent} ${sidebarHidden ? classes.reversed : ''}`}>
        {sidebarHidden
          ? <ChevronRight />
          : <ChevronLeft />
      }
        <Typography>
          <FormattedMessage id={sidebarHidden ? 'map.button.sidebar.show' : 'map.button.sidebar.hide'} />
        </Typography>
      </div>
    </ButtonBase>
  );
};

HideSidebarButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  sidebarHidden: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};


export default HideSidebarButton;
