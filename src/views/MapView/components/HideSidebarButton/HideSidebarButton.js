import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

const HideSidebarButton = ({
  classes, sidebarHidden, mapRef, toggleSidebar,
}) => (
  <ButtonBase
    aaria-hidden
    className={`${classes.hideSidebarButton} ${sidebarHidden ? classes.fullLength : ''}`}
    classes={{ focusVisible: classes.keyboardFocus }}
    onClick={() => {
      toggleSidebar();
      // Update lealfet map size after sidebar has been hidden
      setTimeout(() => (
          mapRef?.current?.leafletElement.invalidateSize()
      ), 1);
    }}
  >
    <div className={`${classes.buttonContent} ${sidebarHidden ? classes.reversed : ''}`}>
      {sidebarHidden
        ? <ChevronRight />
        : <ChevronLeft />
      }
      <Typography>
        {sidebarHidden ? 'Laajenna sivupaneeli' : 'Pienennä sivupaneeli'}
      </Typography>
    </div>
  </ButtonBase>
);

HideSidebarButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  sidebarHidden: PropTypes.bool.isRequired,
  mapRef: PropTypes.objectOf(PropTypes.object),
  toggleSidebar: PropTypes.func.isRequired,
};

HideSidebarButton.defaultProps = {
  mapRef: null,
};


export default HideSidebarButton;
