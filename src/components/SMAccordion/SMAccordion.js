import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Collapse } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

const SMAccordion = ({
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

  const icon = <ArrowDropDown className={`${classes.icon} ${open ? classes.iconOpen : ''}`} />;

  const handleOpen = (e) => {
    onOpen(e, open);
    /* If no content is provided (usually because content is loading), set open event as pending.
      This makes accordion opening smoother once content is loaded */
    if (!open && !collapseContent) {
      setPendingOpen(true);
    } else {
      setOpen(!open);
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
            aria-expanded={open}
            onClick={e => handleOpen(e)}
          >
            {titleContent}
            {icon}
          </ButtonBase>
        ) : titleContent}
      </div>
      <Collapse className={classes.collapseContainer} aria-hidden={!open} in={open}>
        {collapseContent}
      </Collapse>
    </div>
  );
};


SMAccordion.propTypes = {
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
  defaultOpen: false,
  collapseContent: null,
  adornment: null,
  onOpen: () => {},
  disabled: false,
  className: '',
};

export default SMAccordion;
