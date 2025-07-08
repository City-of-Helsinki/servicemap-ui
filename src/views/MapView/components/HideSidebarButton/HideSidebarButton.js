import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ButtonBase, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-leaflet';

function HideSidebarButton({ sidebarHidden, toggleSidebar }) {
  const map = useMap();
  const theme = useTheme();
  const keyboardFocusClass = css({
    boxShadow: 'none !important',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    maxWidth: 200,
    '& p': {
      display: 'block',
      maxWidth: 200,
    },
  });
  return (
    <StyledHideButton
      aria-hidden
      sidebarhidden={+sidebarHidden}
      classes={{ focusVisible: keyboardFocusClass }}
      onClick={() => {
        toggleSidebar();
        // Update lealfet map size after sidebar has been hidden
        setTimeout(() => map?.invalidateSize(), 1);
      }}
    >
      <StyledButtonContainer sidebarhidden={+sidebarHidden}>
        {sidebarHidden ? <ChevronRight /> : <ChevronLeft />}
        <Typography>
          <FormattedMessage
            id={
              sidebarHidden
                ? 'map.button.sidebar.show'
                : 'map.button.sidebar.hide'
            }
          />
        </Typography>
      </StyledButtonContainer>
    </StyledHideButton>
  );
}

const StyledButtonContainer = styled.div(({ sidebarhidden }) => {
  const styles = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };
  if (sidebarhidden) {
    Object.assign(styles, {
      flexDirection: 'row-reverse',
    });
  }
  return styles;
});

const StyledHideButton = styled(ButtonBase)(({ theme, sidebarhidden }) => {
  const styles = {
    pointerEvents: 'auto',
    maxWidth: 50,
    minWidth: 50,
    height: 40,
    marginLeft: -10,
    marginTop: -4,
    padding: 10,
    backgroundColor: '#fff',
    transition: '0.2s',
    '& p': {
      display: 'none',
      maxWidth: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      maxWidth: 200,
      '& p': {
        display: 'block',
        maxWidth: 200,
      },
    },
  };
  if (sidebarhidden) {
    Object.assign(styles, {
      minWidth: 200,
      maxWidth: 200,
      color: '#000',
      '& p': {
        display: 'block',
        maxWidth: 200,
      },
    });
  }
  return styles;
});

HideSidebarButton.propTypes = {
  sidebarHidden: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default HideSidebarButton;
