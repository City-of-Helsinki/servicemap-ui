import {
  Add,
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
  Remove,
} from '@material-ui/icons';
import { ButtonBase } from '@material-ui/core';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMap } from 'react-leaflet';
import isClient from '../../../../utils';
import { isEmbed } from '../../../../utils/path';

const embedded = isEmbed();

const panOffset = 100;

const PanControl = ({ classes }) => {
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
  }, []);

  // Prevent rendering for server
  if (!isClient()) {
    return null;
  }

  return (
    <div className={classes.container}>
      {!embedded && (
        <>
          <ButtonBase
            type="button"
            aria-hidden
            className={classes.top}
            onClick={() => callback('up')}
            onKeyDown={keyboardCallback}
            tabIndex="0"
          >
            <ArrowDropUp />
          </ButtonBase>
          <ButtonBase
            type="button"
            aria-hidden
            className={classes.left}
            onClick={() => callback('left')}
            onKeyDown={keyboardCallback}
            tabIndex="0"
          >
            <ArrowLeft />
          </ButtonBase>
          <ButtonBase
            type="button"
            aria-hidden
            className={classes.right}
            onClick={() => callback('right')}
            onKeyDown={keyboardCallback}
            tabIndex="0"
          >
            <ArrowRight />
          </ButtonBase>
          <ButtonBase
            type="button"
            aria-hidden
            className={classes.bottom}
            onClick={() => callback('down')}
            onKeyDown={keyboardCallback}
            tabIndex="0"
          >
            <ArrowDropDown />
          </ButtonBase>
        </>
      )}
      <ButtonBase
        type="button"
        aria-hidden
        className={`${classes.zoomIn} ${embedded ? classes.embedded : ''} zoomIn `}
        onClick={() => callback('in')}
        onKeyDown={keyboardCallback}
        tabIndex="0"
      >
        <Add />
      </ButtonBase>
      <ButtonBase
        type="button"
        aria-hidden
        className={`${classes.zoomOut} ${embedded ? classes.embedded : ''} zoomOut`}
        onClick={() => callback('out')}
        onKeyDown={keyboardCallback}
        tabIndex="0"
      >
        <Remove />
      </ButtonBase>
    </div>
  );
};

PanControl.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    top: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.string,
    embedded: PropTypes.string,
  }).isRequired,
};

export default PanControl;
