import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { Checkbox, List, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config';
import { SMAccordion, SMButton, TitleBar } from '../../components';
import setServiceTree from '../../redux/actions/serviceTree';
import useMobileStatus from '../../utils/isMobile';
import { getUnitCount } from '../../utils/units';
import useLocaleText from '../../utils/useLocaleText';

const getVariantDependentVariables = (variant, serviceTreeServices, mobilityServices) => {
  if (variant === 'ServiceTree') {
    return {
      ...serviceTreeServices,
      serviceApi: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/service_node/`,
      titleKey: 'general.pageTitles.serviceTree.title',
      guidanceKey: 'services.info',
    };
  }
  return {
    ...mobilityServices,
    serviceApi: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/mobility/`,
    titleKey: 'general.pageTitles.mobility.title',
    guidanceKey: 'mobility.info',
  };
};

const ServiceTreeView = ({ intl, variant }) => {
  const navigator = useSelector(state => state.navigator);
  const cities = useSelector(state => state.settings.cities);
  const organizations = useSelector(state => state.settings.organizations);
  const serviceTreeServices = {
    prevServices: useSelector(state => state.serviceTree.services),
    prevSelected: useSelector(state => state.serviceTree.selected),
    prevOpened: useSelector(state => state.serviceTree.opened),
  };
  const mobilityServices = {
    prevServices: useSelector(state => state.serviceTree.services),
    prevSelected: useSelector(state => state.serviceTree.selected),
    prevOpened: useSelector(state => state.serviceTree.opened),
  };
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const isMobile = useMobileStatus();
  const theme = useTheme();
  const {
    serviceApi,
    titleKey,
    guidanceKey,
    prevServices,
    prevSelected,
    prevOpened,
  } = getVariantDependentVariables(variant, serviceTreeServices, mobilityServices);

  // State
  const [services, setServices] = useState(prevServices);
  const [opened, setOpened] = useState(prevOpened);
  const [selected, setSelected] = useState(prevSelected);

  const citySettings = config.cities?.filter((city) => cities[city]) || [];
  const organizationSettings = config.organizations?.filter((city) => organizations[city]) || [];

  const checkChildNodes = (node, nodes = []) => {
    // Find all visible child nodes, so they can be selected when the parent checkbox is selected
    if (services.find(e => e.id === node.children[0])) {
      const nodeObjects = node.children.map(child => services.find(e => e.id === child));
      nodes.push(...nodeObjects);
      // Check if any child nodes are opened to repeat this function on them
      nodeObjects.forEach((obj) => {
        if (obj?.id && opened.some(item => item === obj.id)) {
          nodes.push(...checkChildNodes(obj));
        }
      });
      return nodes;
    }
    return [];
  };

  const fetchRootNodes = () => (
    // Fetch all top level 0 nodes (root nodes)
    fetch(`${serviceApi}?level=0&page=1&page_size=100`)
      .then(response => response.json())
      .then(data => data.results)
  );

  const setInitialServices = () => {
    // Fetch initially shown service nodes when first entering the pag
    fetchRootNodes()
      .then(data => setServices(data));
  };

  const fetchChildServices = async (service) => {
    // Fetch and set to state the child nodes of the opened node
    fetch(`${serviceApi}?parent=${service}&page=1&page_size=1000`)
      .then(response => response.json())
      .then((data) => {
        setServices([...services, ...data.results]);
        // Expand the opened parent node once the child nodes have been fetched
        setOpened([...opened, service]);
        if (selected.find(e => e.id === service)) {
          setSelected([...selected, ...data.results]);
        }
      });
  };

  const getSelectedParentNodes = (item, data = []) => {
    if (item.parent) {
      const checkdedParent = selected.find(e => e.id === item.parent && e.name);
      if (checkdedParent) {
        data.push(checkdedParent.id);
        if (checkdedParent.parent) {
          getSelectedParentNodes(checkdedParent, data);
        } else {
          return data;
        }
        return data;
      }
    }
    return [];
  };

  const getSelectedChildNodes = (item, data = []) => {
    // Loop through each checked child node and their checked childs
    let child = item;
    if (typeof item === 'number') {
      child = selected.find(e => e.id === item);
    }
    if (child && child.children) {
      data.push(...child.children);
      child.children.forEach((c) => {
        getSelectedChildNodes(c, data);
      });
    } return data;
  };


  const handleExpand = (service, isOpen) => {
    if (isOpen) { // Close expanded item
      setOpened(opened.filter(e => e !== service.id));
    } else if (services.some(e => e.parent === service.id)) { // Expand item without fetching
      setOpened([...opened, service.id]);
    } else { // Fetch child nodes then expand
      fetchChildServices(service.id);
    }
  };

  const handleCheckboxClick = (e, item) => {
    // If checbox is already checked, remove checkbox selections
    if (selected.some(element => element.id === item.id)) {
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove, ...childrenToRemove];
      // Remove nodes from selected state
      if (nodesToRemove.length) {
        setSelected(
          selected.filter(element => element.id !== item.id && !nodesToRemove.includes(element.id)),
        );
      } else {
        setSelected(selected.filter(element => element.id !== item.id));
      }

    // If checbox is not checked, add checkbox selections
    } else {
      // Select all visible child nodes as well
      let newState = [item, ...checkChildNodes(item)];

      // If all other sibling nodes are selected too, select parent node as well
      const parent = services.find(service => service.id === item.parent);
      if (parent && parent.children.every(child => [...selected, item].some(i => i.id === child))) {
        newState = [...newState, parent];
      }

      // Filter duplicates
      newState = newState.filter(e => !selected.some(i => i.id === e.id));
      setSelected([...selected, ...newState]);
      e.stopPropagation();
    }
  };

  const drawCheckboxLines = (isOpen, level, id) => {
    const paths = [];
    let strokeColor = '#000';

    if (isOpen) {
      paths.push('M 17 38 V 60');
    }
    if (level > 0) {
      strokeColor = '#323232';
      paths.push('M 0 30 H 7');
    }

    const line = paths.join(' ');

    return (
      <StyledCheckboxLines key={`innerLine${id}`}>
        <path d={line} stroke={strokeColor} fill="transparent" />
      </StyledCheckboxLines>
    );
  };

  const generateDrawPath = (last, bottom, i, id) => {
    const currentLast = last.includes(i);
    if (!bottom && currentLast) {
      return null;
    }
    if (bottom && currentLast) {
      return <path key={`outerPath${id}`} d="M 17 0 V 30 H 26" stroke="black" fill="transparent" />;
    }
    if (bottom && !currentLast) {
      return <path key={`outerPath${id}`} d="M 17 0 V 60 M 17 30 H 26" stroke="black" fill="transparent" />;
    }
    return <path key={`outerPath${id}`} d="M 17 0 V 60" stroke="black" fill="transparent" />;
  };

  const drawOuterLines = (level, last, id) => (
    [...Array(level)].map((none, i) => (
      <StyledOuterLines key={`outerLine${level + i}`}>
        {generateDrawPath(last, level === i + 1, i, id)}
      </StyledOuterLines>
    ))
  );

  useEffect(() => {
    if (!services.length) {
      setInitialServices();
    }
  }, []);

  function calculateTitle(item) {
    if (variant === 'Mobility') {
      return getLocaleText(item.name);
    }

    // Calculate count
    const hasCitySettings = citySettings.length && citySettings.length !== config.cities.length;
    const hasOrganizationSettings = organizationSettings.length;
    const sum = (a, b) => a + b;

    let resultCount;
    if (!hasCitySettings) {
      resultCount = item.unit_count?.total || 0;
    } else {
      resultCount = citySettings
        .map((city) => getUnitCount(item, city))
        .reduce(sum, 0);
    }

    if (hasOrganizationSettings) {
      const organisationCount = organizationSettings
        .map((org) => org.name.fi.toLowerCase())
        .map((orgNameId) => getUnitCount(item, orgNameId))
        .reduce(sum, 0);
      resultCount = Math.min(resultCount, organisationCount);
    }

    if (hasOrganizationSettings) {
      const approximationText = resultCount
        ? `${intl.formatMessage({ id: 'general.approximate' }).toLowerCase()} `
        : '';
      return `${getLocaleText(item.name)} (${approximationText}${resultCount})`;
    }
    return `${getLocaleText(item.name)} (${resultCount})`;
  }

  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;
    const titleText = calculateTitle(item);

    const checkboxSrTitle = `${intl.formatMessage({ id: 'services.tree.level' })} ${level + 1} ${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.select' })}`;
    const itemSrTitle = `${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.open' })}`;

    const isSelected = selected.some(e => e.id === item.id);

    // Check if any child grandchild node is checked, so we can display indeterminate mark.
    const childIsSelected = checkChildNodes(item)
      .some(node => selected.some(item => item.id === node.id));

    const checkBoxFocusClass = css({
      boxShadow: `inset 0 0 0 4px ${theme.palette.primary.main} !important`,
    });

    return (
      <li key={item.id}>
        <StyledAccordion
          level={level}
          onOpen={hasChildren ? () => handleExpand(item, isOpen) : () => null}
          simpleItem={!hasChildren}
          defaultOpen={isOpen}
          openButtonSrText={itemSrTitle}
          adornment={(
            <>
              {level > 0 && (drawOuterLines(level, last, item.id))}
              <StyledCheckBox>
                {drawCheckboxLines(isOpen, level, item.id)}
                <Checkbox
                  focusVisibleClassName={checkBoxFocusClass}
                  inputProps={{ title: checkboxSrTitle }}
                  onClick={e => handleCheckboxClick(e, item)}
                  icon={<StyledCheckBoxIcon />}
                  color="primary"
                  checked={isSelected}
                  indeterminate={childIsSelected && !isSelected}
                />
              </StyledCheckBox>
            </>
          )}
          titleContent={(
            <StyledText aria-hidden>
              {titleText}
            </StyledText>
          )}
          collapseContent={
            children && children.length ? (
              <List disablePadding>
                {children.map((child, i) => (
                  expandingComponent(
                    child, // child service node
                    level + 1, // child node level
                    // If this node is last of its level, add to list
                    i + 1 === children.length ? [...last, level] : last,
                  )
                ))}
              </List>
            ) : null
          }
        />
      </li>
    );
  };

  // Render components:

  const renderServiceNodeList = () => (
    <List role="list" disablePadding>
      {services && services.map(service => (
        !service.parent && (
          expandingComponent(service, 0)
        )
      ))}
    </List>
  );

  // If node's parent is also checked, add only parent to list of selected nodes for search
  const selectedList = [];
  selected.forEach((e) => {
    if (!selected.some(i => i.id === e.parent)) {
      selectedList.push(e);
    }
  });

  const ids = selectedList.map(i => i.id);

  return (
    <StyledFlexContainer>
      <StyledTitleBar
        title={intl.formatMessage({ id: titleKey })}
        titleComponent="h3"
        backButton={!isMobile}
      />
      <StyledGuidanceInfoText variant="body2">{intl.formatMessage({ id: guidanceKey })}</StyledGuidanceInfoText>
      <StyledMainContent>
        {renderServiceNodeList()}
      </StyledMainContent>
      <StyledFloatingDiv>
        <StyledSearchButton
          id="ServiceTreeSearchButton"
          color="primary"
          disabled={!ids.length}
          icon={<Search />}
          messageID="services.search"
          onClick={() => {
            dispatch(setServiceTree({ services, selected, opened }));
            navigator.push('search', { service_node: ids });
          }}
        />
      </StyledFloatingDiv>
    </StyledFlexContainer>
  );
};

const StyledFlexContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const StyledFloatingDiv = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(2),
  position: 'sticky',
  bottom: 0,
  backgroundColor: '#fff',
  marginTop: 'auto',
  boxSizing: 'border-box',
  boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.36)',
}));

const StyledCheckboxLines = styled.svg(() => ({
  height: 'inherit',
  width: 'inherit',
  position: 'absolute',
}));

const StyledOuterLines = styled.svg(() => ({
  height: '100%',
  width: 26,
  flexShrink: 0,
}));

const StyledMainContent = styled.div(() => ({
  textAlign: 'left',
}));

const StyledTitleBar = styled(TitleBar)(({ theme }) => ({
  background: theme.palette.primary.main,
}));

const StyledSearchButton = styled(SMButton)(() => ({
  flexGrow: 1,
  marginRight: 0,
}));

const StyledGuidanceInfoText = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  paddingTop: theme.spacing(1),
  color: '#fff',
  textAlign: 'left',
}));

const StyledCheckBoxIcon = styled('span')(() => ({
  margin: -1,
  width: 15,
  height: 15,
  backgroundColor: '#fff',
  border: '1px solid #323232;',
  borderRadius: 1,
}));

const StyledCheckBox = styled('div')(() => ({
  width: 40,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  position: 'relative',
  flexShrink: 0,
}));

const StyledText = styled(Typography)(() => ({
  fontSize: '0.938rem',
  lineHeight: '1.125rem',
}));

const StyledAccordion = styled(SMAccordion)(({ level }) => {
  switch (level) {
    case 0:
      return {
        borderBottom: '0.5px solid rgba(151, 151, 151, 0.5)',
        backgroundColor: '#fff',
        '& p': {
          fontWeight: 'bold',
        },
      };
    case 1:
      return {
        backgroundColor: '#e3f3ff',
        borderBottom: '0.5px solid #fff',
        '& p': {
          fontWeight: 'bold',
        },
      };
    case 2:
      return {
        borderBottom: '0.5px solid #fff',
        backgroundColor: '#f5f5f5',
      };
    default:
      return {};
  }
});

ServiceTreeView.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  variant: PropTypes.oneOf(['ServiceTree', 'Mobility']).isRequired,
};

export default ServiceTreeView;
