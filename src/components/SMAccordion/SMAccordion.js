import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Collapse } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

const SMAccordion = ({
  isOpen,
  defaultOpen,
  adornment,
  titleContent,
  collapseContent,
  onOpen,
  disabled,
  openButtonSrText,
  className,
  classes,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [pendingOpen, setPendingOpen] = useState(false);

  const openState = isOpen !== null ? isOpen : open;

  const icon = <ArrowDropDown className={`${classes.icon} ${openState ? classes.iconOpen : ''}`} />;

  const handleOpen = (e) => {
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

  return (
    <div className={classes.accordionContainer}>
      <div className={`${classes.accordion} ${className}`}>
        {adornment}
        {!disabled ? (
          <ButtonBase
            className={classes.clickArea}
            aria-label={openButtonSrText}
            aria-expanded={openState}
            onClick={e => handleOpen(e)}
          >
            {titleContent}
            {icon}
          </ButtonBase>
        ) : titleContent}
      </div>
      <Collapse className={classes.collapseContainer} in={openState}>
        {openState && collapseContent}
      </Collapse>
    </div>
  );
};


SMAccordion.propTypes = {
  isOpen: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  titleContent: PropTypes.objectOf(PropTypes.any).isRequired,
  collapseContent: PropTypes.arrayOf(PropTypes.any),
  adornment: PropTypes.objectOf(PropTypes.any),
  onOpen: PropTypes.func,
  disabled: PropTypes.bool,
  openButtonSrText: PropTypes.string.isRequired,
  className: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

SMAccordion.defaultProps = {
  isOpen: null,
  defaultOpen: false,
  collapseContent: null,
  adornment: null,
  onOpen: () => {},
  disabled: false,
  className: '',
};

export default SMAccordion;
