import {
  ArrowDropDown,
  ArrowDropUp,
  ArrowLeft,
  ArrowRight,
} from '@material-ui/icons';
import { ButtonBase } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import isClient from '../../../../utils';

const panOffset = 100;

const PanControl = ({ classes, Control, map }) => {
  // Prevent rendering for server
  if (!isClient()) {
    return null;
  }

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
      default:
    }

    map.panBy(point);
  }, []);

  return (
    <Control position="bottomright">
      <div className={classes.container}>
        <ButtonBase
          type="button"
          aria-hidden
          className={classes.top}
          onClick={() => callback('up')}
          tabIndex="0"
        >
          <ArrowDropUp />
        </ButtonBase>
        <ButtonBase
          type="button"
          aria-hidden
          className={classes.left}
          onClick={() => callback('left')}
          tabIndex="0"
        >
          <ArrowLeft />
        </ButtonBase>
        <ButtonBase
          type="button"
          aria-hidden
          className={classes.right}
          onClick={() => callback('right')}
          tabIndex="0"
        >
          <ArrowRight />
        </ButtonBase>
        <ButtonBase
          type="button"
          aria-hidden
          className={classes.bottom}
          onClick={() => callback('down')}
          tabIndex="0"
        >
          <ArrowDropDown />
        </ButtonBase>
      </div>
    </Control>
  );
};

PanControl.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    top: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
  }).isRequired,
  Control: PropTypes.objectOf(PropTypes.any).isRequired,
  map: PropTypes.shape({
    panBy: PropTypes.func,
  }).isRequired,
};

export default PanControl;
