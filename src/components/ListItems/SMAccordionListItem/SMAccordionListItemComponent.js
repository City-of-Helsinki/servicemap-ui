import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Checkbox, FormControlLabel, ListItem, styled, Switch, Typography } from '@mui/material';
import { getIcon } from '../../SMIcon';
import { uppercaseFirst } from '../../../utils';
import SimpleListItem from '../SimpleListItem';
import useLocaleText from '../../../utils/useLocaleText';
import { setNewCurrentService } from '../../../redux/actions/services';
import SMAccordion from '../../SMAccordion';
import DistrictToggleButton from '../../../views/AreaView/components/DistrictToggleButton';
import SMSwitch from '../../SMSwitch';

const backgroundColorMapping = {
  accordion: {
    1: 'white',
    2: 'rgb(250,250,250)',
    3: 'rgb(245,245,245)',
    4: 'rgb(240,240,240)',
    5: 'rgb(235,235,235)',
    6: 'rgb(230,230,230)',
  },
  content: {
    1: 'rgb(250,250,250)',
    2: 'rgb(245,245,245)',
    3: 'rgb(240,240,240)',
    4: 'rgb(235,235,235)',
    5: 'rgb(230,230,230)',
    6: 'rgb(225,225,225)',
  },
};

const TitleText = (props) => {
  const { children } = props;
  return (
    <StyledTitleTypography
      {...props}
      // id={`${id}Name`}
      // component={titleTypographyComponent}
    >
      {children}
    </StyledTitleTypography>
  );
};

TitleText.propTypes = {
  children: PropTypes.node.isRequired,
};

const Accordion = ({
  checkbox,
  checkboxChecked,
  checkboxProps,
  defaultOpen,
  switchProps,
  collapseContent,
  isOpen,
  onOpen,
  icon,
  id,
  level,
  title,
  titleTypographyComponent,
}) => {
  // Rendered title content
  const titleContent = () => {
    return (
      <StyledTitleContainer>
        {
          typeof title === 'string' ? (
            <TitleText
              variant={level === 1 ? 'subtitle1' : 'body2'}
              component={titleTypographyComponent}
            >
              { title }
            </TitleText>
          ) : title
        }
      </StyledTitleContainer>
    );
  };

  const componentCheckbox = () => (
    <StyledFormControlLabel
      control={(
        <Checkbox
          color="primary"
          {...checkboxProps}
        />
      )}
    />
  );

  const componentSwitchCheckbox = () => (
    <SMSwitch
      tabIndex={-1}
      color="primary"
      size="small"
      value={id}
      inputProps={{
        role: 'button',
        // 'aria-setsize': selectionSize ? selectionSize.toString() : null,
        // 'aria-pressed': selected,
        // 'aria-labelledby': `${`${district.id}Name`} ${`${district.id}Period`}`,
      }}
      onChange={e => onOpen(e)}
      checked={checkboxChecked}
      {...switchProps}
    />
  );

  // Rendered adornment
  let adornment = null;

  switch (checkbox) {
    case 'default':
      adornment = componentCheckbox();
      break;
    case 'switch':
      adornment = componentSwitchCheckbox();
      break;
    default:
  }

  const renderAdornment = () => icon || adornment || null;

  const props = {};
  if (isOpen !== null) {
    props.isOpen = isOpen;
  }

  return (
    <StyledSMAccorion // Layers in top level category
      defaultOpen={defaultOpen}
      onOpen={(e, open) => onOpen && onOpen(e, open)}
      // isOpen={isOpen}
      elevated={isOpen}
      adornment={renderAdornment()}
      adornmentSeparated={checkbox === 'default'}
      titleContent={titleContent()}
      collapseContent={(
        <StyledCollapseContainer padding={level}>
          {collapseContent}
        </StyledCollapseContainer>
      )}
      level={level}
      {...props}
    />
  );
};

Accordion.propTypes = {
  titleTypographyComponent: PropTypes.oneOf(['h2', 'h3', 'h4', 'h5', 'h6', 'p']).isRequired,
  checkbox: PropTypes.oneOf(['default', 'switch', false]),
  defaultOpen: PropTypes.bool,
  icon: PropTypes.node,
  isOpen: PropTypes.bool,
  id: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
};

Accordion.defaultProps = {
  collapseContent: null,
  defaultOpen: false,
  selected: null,
  onOpen: null,
  onToggle: null,
  icon: null,
  isOpen: false,
  checkbox: false,
};

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const StyledSMAccorion = styled(SMAccordion)(({ theme, level }) => ({
  backgroundColor: `${backgroundColorMapping.accordion[level]}`,
  paddingLeft: `${theme.spacing(level * 3)} !important`,
}));

const StyledTitleContainer = styled('div')`

`;

const StyledCollapseContainer = styled('div')(({ padding }) => ({
  display: 'block',
  backgroundColor: `${backgroundColorMapping.content[padding]}`,
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.06)',
  padding: 0,
}));


const SMAccordionListItemComponent = ({
  checkbox,
  checkboxProps,
  content,
  defaultOpen,
  divider,
  level,
  listItemProps,
  icon,
  id,
  subtitle,
  title,
  selected,
  onSelection,
  switchProps,
}) => {
  // Render icon component
  const renderIcon = () => (icon ? (
    <StyledIconContainer>
      {icon}
    </StyledIconContainer>
  ) : undefined);

  const renderInnerContent = () => (
    <StyledListItemContentContainer padding={level}>
      {
        icon ? renderIcon() : (<StyledContentPadder />)
      }
      <StyledFlexContainer>
        {
          typeof title === 'string'
            ? (
              <TitleText variant={level === 1 ? 'subtitle' : 'body2'}>
                {title}
              </TitleText>
              // <StyledTitleTypography variant="subtitle1">
              //   {title}
              // </StyledTitleTypography>
            )
            : title
        }
        {
          subtitle
          && (
            <StyledSubtitleTypography variant="body2">
              {subtitle}
            </StyledSubtitleTypography>
          )
        }
      </StyledFlexContainer>
    </StyledListItemContentContainer>
  );

  const renderContent = () => (content ? (
    <Accordion
      id={id}
      title={title}
      titleTypographyComponent="h2"
      collapseContent={content}
      checkbox={checkbox}
      checkboxChecked={selected}
      checkboxProps={checkboxProps}
      defaultOpen={defaultOpen}
      icon={renderIcon()}
      isOpen={selected}
      level={level}
      onOpen={onSelection || null}
      switchProps={switchProps}
    />
  ) : renderInnerContent());

  return (
    <StyledListItem
      divider={divider}
      disableGutters
      key={id}
      className={`${id}`}
      {...listItemProps}
    >
      {renderContent()}
    </StyledListItem>
  );
};

export default SMAccordionListItemComponent;

SMAccordionListItemComponent.propTypes = {
  checkboxProps: PropTypes.objectOf(PropTypes.any),
  content: PropTypes.node,
  defaultOpen: PropTypes.bool,
  divider: PropTypes.bool,
  level: PropTypes.number.isRequired,
  listItemProps: PropTypes.objectOf(PropTypes.any),
  icon: PropTypes.node,
  id: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  subtitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  checkbox: PropTypes.oneOf(['default', 'switch', false]),
};

SMAccordionListItemComponent.defaultProps = {
  checkboxProps: {},
  content: null,
  defaultOpen: false,
  divider: false,
  icon: null,
  subtitle: null,
  checkbox: false,
  listItemProps: {},
  selected: null,
};

const StyledContentPadder = styled('span')(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  // padding: `${theme.spacing(2.5)} ${theme.spacing(2)}`,
  padding: 0,
  minHeight: theme.spacing(7),
}));

const StyledListItemContentContainer = styled('div')(({ theme, padding }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  paddingLeft: `${theme.spacing((padding * 3))}`,
  flexDirection: 'row',
  display: 'flex',
}));

const StyledFlexContainer = styled('div')(({ theme, padding }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTitleTypography = styled(Typography)`

`;

const StyledSubtitleTypography = styled(Typography)`
`;

const StyledIconContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  marginRight: theme.spacing(2),
}));
