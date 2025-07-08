/* eslint-disable react/forbid-prop-types */
import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { List, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Checkbox as HDSCheckbox } from 'hds-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import config from '../../../config';
import { SMAccordion, SMButton, TitleBar } from '../../components';
import { setMobilityTree } from '../../redux/actions/mobilityTree';
import { setServiceTree } from '../../redux/actions/serviceTree';
import { selectNavigator } from '../../redux/selectors/general';
import {
  selectSelectedCities,
  selectSelectedOrganizations,
} from '../../redux/selectors/settings';
import {
  selectMobilityTreeOpened,
  selectMobilityTreeSelected,
  selectMobilityTreeServices,
  selectServiceTreeOpened,
  selectServiceTreeSelected,
  selectServiceTreeServices,
} from '../../redux/selectors/tree';
import useMobileStatus from '../../utils/isMobile';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import useLocaleText from '../../utils/useLocaleText';

const SERVICE_TREE = 'ServiceTree';
const MOBILITY_TREE = 'MobilityTree';

const getVariantDependentVariables = (
  variant,
  serviceTreeServices,
  mobilityTreeServices
) => {
  if (variant === SERVICE_TREE) {
    return {
      ...serviceTreeServices,
      serviceApi: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/service_node/`,
      titleKey: 'general.pageTitles.serviceTree.title',
      guidanceKey: 'services.info',
    };
  }
  return {
    ...mobilityTreeServices,
    serviceApi: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/mobility/`,
    titleKey: 'general.pageTitles.mobilityTree.title',
    guidanceKey: 'mobilityTree.info',
  };
};

function ServiceTreeView({ intl, variant }) {
  const navigator = useSelector(selectNavigator);
  const citySettings = useSelector(selectSelectedCities);
  const organizationSettings = useSelector(selectSelectedOrganizations);
  const serviceTreeServices = {
    prevServices: useSelector(selectServiceTreeServices),
    prevSelected: useSelector(selectServiceTreeSelected),
    prevOpened: useSelector(selectServiceTreeOpened),
  };
  const mobilityTreeServices = {
    prevServices: useSelector(selectMobilityTreeServices),
    prevSelected: useSelector(selectMobilityTreeSelected),
    prevOpened: useSelector(selectMobilityTreeOpened),
  };
  const dispatch = useDispatch();
  const getLocaleText = useLocaleText();
  const isMobile = useMobileStatus();
  const {
    serviceApi,
    titleKey,
    guidanceKey,
    prevServices,
    prevSelected,
    prevOpened,
  } = getVariantDependentVariables(
    variant,
    serviceTreeServices,
    mobilityTreeServices
  );

  // State
  const [services, setServices] = useState(prevServices);
  const [opened, setOpened] = useState(prevOpened);
  const [selected, setSelected] = useState(prevSelected);
  const [unitCounts, setUnitCounts] = useState([]);

  useEffect(() => {
    setOpened(prevOpened);
    setSelected(prevSelected);
  }, [prevSelected, prevOpened]);

  const checkChildNodes = (node, nodes = []) => {
    // Find all visible child nodes, so they can be selected when the parent checkbox is selected
    if (services.find((e) => e.id === node.children[0])) {
      const nodeObjects = node.children.map((child) =>
        services.find((e) => e.id === child)
      );
      nodes.push(...nodeObjects);
      // Check if any child nodes are opened to repeat this function on them
      nodeObjects.forEach((obj) => {
        if (obj?.id && opened.some((item) => item === obj.id)) {
          nodes.push(...checkChildNodes(obj));
        }
      });
      return nodes;
    }
    return [];
  };

  const fetchRootNodes = () =>
    // Fetch all top level 0 nodes (root nodes)
    fetch(`${serviceApi}?level=0&page=1&page_size=100`)
      .then((response) => response.json())
      .then((data) => data.results);

  const fetchNodeCounts = async (nodes, fullSearch) => {
    const idList = nodes.map((node) => node.id);
    // Do not fetch unit counts again for nodes that have the data, unless specified by fullSearch
    const filteredIdList = fullSearch
      ? idList
      : idList.filter((id) => !unitCounts.some((count) => count.id === id));

    const smAPI = new ServiceMapAPI();
    const fetchOptions = {};
    if (organizationSettings.length) {
      fetchOptions.organization = organizationSettings.map(
        (setting) => setting.id
      );
      fetchOptions.no_private_services = true;
    }
    if (citySettings.length) {
      fetchOptions.municipality = citySettings;
    }
    const counts = await Promise.all(
      filteredIdList.map(async (id) => {
        const count = await smAPI.serviceNodeSearch(
          variant,
          id,
          fetchOptions,
          true
        );
        return { id, count };
      })
    );
    if (fullSearch) {
      setUnitCounts(counts);
    } else {
      setUnitCounts([...unitCounts, ...counts]);
    }
  };

  const setInitialServices = () => {
    // Fetch initially shown service nodes when first entering the pag
    fetchRootNodes().then((data) => {
      setServices(data);
      if (variant === SERVICE_TREE) {
        fetchNodeCounts(data);
      }
    });
  };

  const fetchChildServices = async (service) => {
    // Fetch and set to state the child nodes of the opened node
    fetch(`${serviceApi}?parent=${service}&page=1&page_size=1000`)
      .then((response) => response.json())
      .then((data) => {
        setServices([...services, ...data.results]);
        if (variant === SERVICE_TREE) {
          fetchNodeCounts(data.results);
        }
        // Expand the opened parent node once the child nodes have been fetched
        setOpened([...opened, service]);
        if (selected.find((e) => e.id === service)) {
          setSelected([...selected, ...data.results]);
        }
      });
  };

  const getSelectedParentNodes = (item, data = []) => {
    if (item.parent) {
      const checkdedParent = selected.find(
        (e) => e.id === item.parent && e.name
      );
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
      child = selected.find((e) => e.id === item);
    }
    if (child?.children) {
      data.push(...child.children);
      child.children.forEach((c) => {
        getSelectedChildNodes(c, data);
      });
    }
    return data;
  };

  const handleExpand = (service, isOpen) => {
    if (isOpen) {
      // Close expanded item
      setOpened(opened.filter((e) => e !== service.id));
    } else if (services.some((e) => e.parent === service.id)) {
      // Expand item without fetching
      setOpened([...opened, service.id]);
    } else {
      // Fetch child nodes then expand
      fetchChildServices(service.id);
    }
  };

  const handleCheckboxClick = (e, item) => {
    // If checbox is already checked, remove checkbox selections
    if (selected.some((element) => element.id === item.id)) {
      const parentsToRemove = getSelectedParentNodes(item);
      const childrenToRemove = getSelectedChildNodes(item);
      const nodesToRemove = [...parentsToRemove, ...childrenToRemove];
      // Remove nodes from selected state
      if (nodesToRemove.length) {
        setSelected(
          selected.filter(
            (element) =>
              element.id !== item.id && !nodesToRemove.includes(element.id)
          )
        );
      } else {
        setSelected(selected.filter((element) => element.id !== item.id));
      }

      // If checbox is not checked, add checkbox selections
    } else {
      // Select all visible child nodes as well
      let newState = [item, ...checkChildNodes(item)];

      // If all other sibling nodes are selected too, select parent node as well
      const parent = services.find((service) => service.id === item.parent);
      if (
        parent?.children.every((child) =>
          [...selected, item].some((i) => i.id === child)
        )
      ) {
        newState = [...newState, parent];
      }

      // Filter duplicates
      newState = newState.filter((e) => !selected.some((i) => i.id === e.id));
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
      return (
        <path
          key={`outerPath${id}`}
          d="M 17 0 V 30 H 26"
          stroke="black"
          fill="transparent"
        />
      );
    }
    if (bottom && !currentLast) {
      return (
        <path
          key={`outerPath${id}`}
          d="M 17 0 V 60 M 17 30 H 26"
          stroke="black"
          fill="transparent"
        />
      );
    }
    return (
      <path
        key={`outerPath${id}`}
        d="M 17 0 V 60"
        stroke="black"
        fill="transparent"
      />
    );
  };

  const drawOuterLines = (level, last, id) =>
    [...Array(level)].map((none, i) => (
      <StyledOuterLines key={`outerLine${level + i}`}>
        {generateDrawPath(last, level === i + 1, i, id)}
      </StyledOuterLines>
    ));

  useEffect(() => {
    if (!services.length) {
      setInitialServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (variant === SERVICE_TREE) {
      setUnitCounts([]);
      fetchNodeCounts(services, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citySettings, organizationSettings]);

  function calculateTitle(item) {
    if (variant === MOBILITY_TREE) {
      return getLocaleText(item.name);
    }

    // Calculate count
    const countItem = unitCounts.find((countItem) => countItem.id === item.id);
    return `${getLocaleText(item.name)} ${countItem !== null && countItem !== undefined ? `(${countItem.count})` : ''}`;
  }

  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren
      ? services.filter((e) => e.parent === item.id)
      : null;
    const titleText = calculateTitle(item);

    const checkboxSrTitle = `${intl.formatMessage({
      id: 'services.tree.level',
    })} ${level + 1} ${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.select' })}`;
    const itemSrTitle = `${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.open' })}`;

    const isSelected = selected.some((e) => e.id === item.id);

    // Check if any child grandchild node is checked, so we can display indeterminate mark.
    const childIsSelected = checkChildNodes(item).some((node) =>
      selected.some((item) => item.id === node.id)
    );

    return (
      <li key={item.id}>
        <StyledAccordion
          level={level}
          onOpen={hasChildren ? () => handleExpand(item, isOpen) : () => null}
          simpleItem={!hasChildren}
          isOpen={isOpen}
          openButtonSrText={itemSrTitle}
          adornment={
            <>
              {level > 0 && drawOuterLines(level, last, item.id)}
              <StyledCheckBox>
                {drawCheckboxLines(isOpen, level, item.id)}
                <HDSCheckbox
                  id={item.id}
                  name={item.id}
                  label={
                    <Typography component="span" style={visuallyHidden}>
                      {checkboxSrTitle}
                    </Typography>
                  }
                  checked={isSelected}
                  indeterminate={childIsSelected && !isSelected}
                  onChange={(e) => handleCheckboxClick(e, item)}
                  style={{ '--size': '1rem' }}
                />
              </StyledCheckBox>
            </>
          }
          titleContent={<StyledText aria-hidden>{titleText}</StyledText>}
          collapseContent={
            children?.length ? (
              <List disablePadding>
                {children.map((child, i) =>
                  expandingComponent(
                    child, // child service node
                    level + 1, // child node level
                    // If this node is last of its level, add to list
                    i + 1 === children.length ? [...last, level] : last
                  )
                )}
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
      {services?.map(
        (service) => !service.parent && expandingComponent(service, 0)
      )}
    </List>
  );

  // If node's parent is also checked, add only parent to list of selected nodes for search
  const selectedList = [];
  selected.forEach((e) => {
    if (!selected.some((i) => i.id === e.parent)) {
      selectedList.push(e);
    }
  });

  const ids = selectedList.map((i) => i.id);

  return (
    <StyledFlexContainer>
      <StyledTitleBar
        title={intl.formatMessage({ id: titleKey })}
        titleComponent="h3"
        backButton={!isMobile}
      />
      <StyledGuidanceInfoText variant="body2">
        {intl.formatMessage({ id: guidanceKey })}
      </StyledGuidanceInfoText>
      <StyledMainContent>{renderServiceNodeList()}</StyledMainContent>
      <StyledFloatingDiv>
        <StyledSearchButton
          id="ServiceTreeSearchButton"
          color="primary"
          disabled={!ids.length}
          icon={<Search />}
          messageID="services.search"
          onClick={() => {
            const stateVariables = { services, selected, opened };
            if (variant === SERVICE_TREE) {
              dispatch(setServiceTree(stateVariables));
              navigator.push('search', { service_node: ids });
            } else {
              dispatch(setMobilityTree(stateVariables));
              navigator.push('search', { mobility_node: ids });
            }
          }}
        />
      </StyledFloatingDiv>
    </StyledFlexContainer>
  );
}

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
  variant: PropTypes.oneOf([SERVICE_TREE, MOBILITY_TREE]).isRequired,
};

export default ServiceTreeView;
