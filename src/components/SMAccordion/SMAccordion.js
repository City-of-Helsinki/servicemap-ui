import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Collapse } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import styled from '@emotion/styled';

const SMAccordion = ({
  isOpen = null,
  defaultOpen = false,
  adornment = null,
  titleContent,
  collapseContent = null,
  onOpen = () => {},
  disabled = false,
  disableUnmount = false, // Disables accordion collapse content unmount on accordion close
  simpleItem = false,
  openButtonSrText = null,
  className = '',
  elevated = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  // This state makes sure that the component does not initially render closed accordion contents
  const [hasBeenOpened, setHasBeenOpened] = useState(defaultOpen);
  const [pendingOpen, setPendingOpen] = useState(false);

  const openState = isOpen !== null ? isOpen : open;

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
    <StyledAccordionContainer data-sm="AccordionComponent">
      <StyledAccordion className={`${className}`}>
        {adornment}
        {!simpleItem ? (
          <StyledClickAreaButton
            disabled={disabled}
            aria-label={openButtonSrText}
            aria-expanded={openState}
            onClick={e => handleOpen(e)}
          >
            {titleContent}
            <StyledArrowDropDown open={openState || undefined} disabled={disabled || undefined} />
          </StyledClickAreaButton>
        ) : titleContent}
      </StyledAccordion>
      <StyledCollapse elevated={+elevated} in={openState}>
        {shouldRenderCollapse ? (
          collapseContent
        ) : null}
      </StyledCollapse>
    </StyledAccordionContainer>
  );
};

const StyledArrowDropDown = styled(ArrowDropDown)(({ theme, open, disabled }) => {
  const styles = {
    fontSize: '1.5rem',
    transition: '0.3s',
    marginLeft: 'auto',
    color: theme.palette.primary.main,
  };
  if (open) {
    Object.assign(styles, {
      transform: 'rotate(180deg)',
    });
  }
  if (disabled) {
    Object.assign(styles, {
      color: theme.palette.disabled.strong,
    });
  }
  return styles;
});

const StyledAccordionContainer = styled('div')(() => ({
  flexDirection: 'column',
  width: '100%',
}));

const StyledAccordion = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  height: theme.spacing(7),
  display: 'flex',
  flexDirection: 'row',
  padding: 0,
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  alignItems: 'center',
}));

const StyledClickAreaButton = styled(ButtonBase)(() => ({
  width: '100%',
  height: '100%',
  justifyContent: 'left',
  textAlign: 'start',
  wordBreak: 'break-word',
}));

const StyledCollapse = styled(Collapse)(({ elevated }) => {
  const styles = {
    width: '100%',
  };
  if (elevated) {
    Object.assign(styles, {
      boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
      position: 'relative',
    });
  }
  return styles;
});


SMAccordion.propTypes = {
  isOpen: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  titleContent: PropTypes.objectOf(PropTypes.any).isRequired,
  collapseContent: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.any), PropTypes.objectOf(PropTypes.any)],
  ),
  adornment: PropTypes.objectOf(PropTypes.any),
  onOpen: PropTypes.func,
  disabled: PropTypes.bool,
  simpleItem: PropTypes.bool,
  elevated: PropTypes.bool,
  openButtonSrText: PropTypes.string,
  className: PropTypes.string,
  disableUnmount: PropTypes.bool,
};

export default SMAccordion;
