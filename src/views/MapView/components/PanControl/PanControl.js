import styled from '@emotion/styled';
import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
  Remove,
} from '@mui/icons-material';
import { ButtonBase } from '@mui/material';
import React, { useCallback } from 'react';
import { useMap } from 'react-leaflet';

import isClient from '../../../../utils';
import { isEmbed } from '../../../../utils/path';

const embedded = isEmbed();

const panOffset = 100;

function PanControl() {
  const map = useMap();
  // Button callback function
  const callback = useCallback((direction) => {
    if (!map || !direction) return;
    let point;
    switch (direction) {
      case 'up':
        point = new global.L.Point(0, -panOffset);
        break;
      case 'down':
        point = new global.L.Point(0, panOffset);
        break;
      case 'left':
        point = new global.L.Point(-panOffset, 0);
        break;
      case 'right':
        point = new global.L.Point(panOffset, 0);
        break;
      case 'in':
        map.zoomIn(1);
        break;
      case 'out':
        map.zoomOut(1);
        break;
      default:
    }

    if (point) {
      map.panBy(point);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle keyboard arrow functionality for leaflet map
  const keyboardCallback = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        callback('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        callback('up');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        callback('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        callback('right');
        break;
      case '+':
        e.preventDefault();
        callback('in');
        break;
      case '-':
        e.preventDefault();
        callback('out');
        break;
      default:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent rendering for server
  if (!isClient()) {
    return null;
  }

  return (
    <StyledContainer>
      {!embedded && (
        <>
          <StyledTopButton
            type="button"
            aria-hidden
            onClick={() => callback('up')}
            onKeyDown={keyboardCallback}
            tabIndex={0}
          >
            <ArrowDropUp />
          </StyledTopButton>
          <StyledLeftButton
            type="button"
            aria-hidden
            onClick={() => callback('left')}
            onKeyDown={keyboardCallback}
            tabIndex={0}
          >
            <ArrowLeft />
          </StyledLeftButton>
          <StyledRightButton
            type="button"
            aria-hidden
            onClick={() => callback('right')}
            onKeyDown={keyboardCallback}
            tabIndex={0}
          >
            <ArrowRight />
          </StyledRightButton>
          <StyledBottomButton
            type="button"
            aria-hidden
            onClick={() => callback('down')}
            onKeyDown={keyboardCallback}
            tabIndex={0}
          >
            <ArrowDropDown />
          </StyledBottomButton>
        </>
      )}
      <StyledZoomInButton
        type="button"
        aria-hidden
        className="zoomIn"
        embedded={+embedded}
        onClick={() => callback('in')}
        onKeyDown={keyboardCallback}
        tabIndex={0}
      >
        <Add />
      </StyledZoomInButton>
      <StyledZoomOutButton
        type="button"
        aria-hidden
        className="zoomOut"
        embedded={+embedded}
        onClick={() => callback('out')}
        onKeyDown={keyboardCallback}
        tabIndex={0}
      >
        <Remove />
      </StyledZoomOutButton>
    </StyledContainer>
  );
}

const StyledTopButton = styled(ButtonBase)(() => ({
  right: 34,
}));
const StyledBottomButton = styled(ButtonBase)(() => ({
  bottom: 76,
  right: 34,
}));
const StyledLeftButton = styled(ButtonBase)(() => ({
  left: 0,
  top: 34,
}));
const StyledRightButton = styled(ButtonBase)(() => ({
  right: 0,
  top: 34,
}));

const StyledZoomInButton = styled(ButtonBase)(({ embedded }) => {
  const styles = {
    bottom: 31,
    right: 34,
  };
  if (embedded) {
    Object.assign(styles, { right: 2 });
  }
  return styles;
});
const StyledZoomOutButton = styled(ButtonBase)(({ embedded }) => {
  const styles = {
    bottom: 0,
    right: 34,
  };
  if (embedded) {
    Object.assign(styles, { right: 2 });
  }
  return styles;
});

const StyledContainer = styled.div(() => ({
  height: 178,
  width: 102,
  '& button': {
    backgroundClip: 'padding-box',
    backgroundColor: '#fff',
    borderRadius: 2,
    border: '2px solid rgba(0,0,0,0.2)',
    color: '#000',
    position: 'absolute',
    width: 34,
    height: 34,
    lineHeight: '30px',
    padding: 0,
    pointerEvents: 'auto',
  },
}));

export default PanControl;
