import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Collapse } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

const SMAccordion = ({
  isOpen,
  defaultOpen,
  adornment,
  adornmentSeparated,
  titleContent,
  collapseContent,
  onOpen,
  disabled,
  disableUnmount, // Disables accordion collapse content unmount on accordion close
  simpleItem,
  openButtonSrText,
  className,
  classes,
  elevated,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  // This state makes sure that the component does not initially render closed accordion contents
  const [hasBeenOpened, setHasBeenOpened] = useState(defaultOpen);
  const [pendingOpen, setPendingOpen] = useState(false);

  const openState = isOpen !== null ? isOpen : open;

  const icon = <ArrowDropDown className={`${classes.icon} ${openState ? classes.iconOpen : ''}  ${disabled ? classes.iconDisabled : ''}`} />;

  const handleOpen = (e) => {
    if (!hasBeenOpened) setHasBeenOpened(true);
    onOpen(e, openState);
    /* If no content is provided (usually because content is loading), set open event as pending.
      This makes accordion opening smoother once content is loaded */
    if (!openState && !collapseContent) {
      setPendingOpen(true);
    } else {
      setOpen(!openState);
    }
  };

  useEffect(() => {
    // If accordion open event is set as pending, finish it when content is available
    if (collapseContent && pendingOpen) {
      setOpen(true);
      setPendingOpen(false);
    }
  }, [collapseContent, pendingOpen]);

  const shouldRenderCollapse = disableUnmount ? hasBeenOpened : openState;

  return (
    <div className={classes.accordionContainer}>
      <div className={`${classes.accordion} ${className}`}>
        {adornmentSeparated && adornment}
        {!simpleItem ? (
          <ButtonBase
            disabled={disabled}
            className={classes.clickArea}
            aria-label={openButtonSrText}
            aria-expanded={openState}
            onClick={e => handleOpen(e)}
          >
            {!adornmentSeparated && adornment}
            {titleContent}
            {icon}
          </ButtonBase>
        ) : titleContent}
      </div>
      <Collapse className={`${classes.collapseContainer} ${elevated ? classes.elevated : ''}`} in={openState}>
        {shouldRenderCollapse ? (
          collapseContent
        ) : null}
      </Collapse>
    </div>
  );
};


SMAccordion.propTypes = {
  isOpen: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  titleContent: PropTypes.objectOf(PropTypes.any).isRequired,
  collapseContent: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.any), PropTypes.objectOf(PropTypes.any)],
  ),
  adornment: PropTypes.objectOf(PropTypes.any),
  adornmentSeparated: PropTypes.bool,
  onOpen: PropTypes.func,
  disabled: PropTypes.bool,
  simpleItem: PropTypes.bool,
  elevated: PropTypes.bool,
  openButtonSrText: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  disableUnmount: PropTypes.bool,
};

SMAccordion.defaultProps = {
  isOpen: null,
  defaultOpen: false,
  collapseContent: null,
  adornment: null,
  adornmentSeparated: true,
  onOpen: () => {},
  disabled: false,
  simpleItem: false,
  elevated: false,
  openButtonSrText: null,
  className: '',
  disableUnmount: false,
};

export default SMAccordion;
