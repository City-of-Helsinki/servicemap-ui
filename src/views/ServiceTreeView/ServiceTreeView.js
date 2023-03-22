import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List, Checkbox, Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import styled from '@emotion/styled';
import config from '../../../config';
import useLocaleText from '../../utils/useLocaleText';
import { SMAccordion, SMButton, TitleBar } from '../../components';
import useMobileStatus from '../../utils/isMobile';
import { getUnitCount } from "../../utils/units";

const ServiceTreeView = (props) => {
  const {
    classes,
    navigator,
    intl,
    setTreeState,
    prevServices,
    prevSelected,
    prevOpened,
    settings,
  } = props;
  const getLocaleText = useLocaleText();
  const isMobile = useMobileStatus();

  // State
  const [services, setServices] = useState(prevServices);
  const [opened, setOpened] = useState(prevOpened);
  const [selected, setSelected] = useState(prevSelected);

  let citySettings = [];
  config.cities.forEach((city) => {
    citySettings.push(...settings.cities[city] ? [city] : []);
  });

  if (citySettings.length === config.cities.length) {
    citySettings = [];
  }

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
    fetch(`${config.serviceMapAPI.root}${config.serviceMapAPI.version}/service_node/?level=0&page=1&page_size=100`)
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
    fetch(`${config.serviceMapAPI.root}${config.serviceMapAPI.version}/service_node/?parent=${service}&page=1&page_size=1000`)
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
      <svg key={`innerLine${id}`} className={classes.checkBoxLines}>
        <path d={line} stroke={strokeColor} fill="transparent" />
      </svg>
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
      <svg key={`outerLine${level + i}`} className={classes.outerLines}>
        {generateDrawPath(last, level === i + 1, i, id)}
      </svg>
    ))
  );

  useEffect(() => {
    if (!services.length) {
      setInitialServices();
    }
  }, []);

  const expandingComponent = (item, level, last = []) => {
    const hasChildren = item.children.length;
    const isOpen = opened.includes(item.id);
    const children = hasChildren ? services.filter(e => e.parent === item.id) : null;

    let resultCount = 0;

    if (!citySettings.length || citySettings.length === config.cities.length) {
      resultCount = item.unit_count.total;
    } else {
      config.cities
        .filter(city => settings.cities[city])
        .forEach((city) => {
          resultCount += getUnitCount(item, city);
        });
    }

    const checkboxSrTitle = `${intl.formatMessage({ id: 'services.tree.level' })} ${level + 1} ${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.select' })}`;
    const itemSrTitle = `${getLocaleText(item.name)} ${intl.formatMessage({ id: 'services.category.open' })}`;

    const isSelected = selected.some(e => e.id === item.id);

    // Check if any child grandchild node is checked, so we can display indeterminate mark.
    const childIsSelected = checkChildNodes(item)
      .some(node => selected.some(item => item.id === node.id));

    return (
      <li key={item.id}>
        <SMAccordion
          className={`${classes.listItem} ${classes[`level${level}`]}`}
          onOpen={hasChildren ? () => handleExpand(item, isOpen) : () => null}
          simpleItem={!hasChildren}
          defaultOpen={isOpen}
          openButtonSrText={itemSrTitle}
          adornment={(
            <>
              {level > 0 && (drawOuterLines(level, last, item.id))}
              <div className={classes.checkBox}>
                {drawCheckboxLines(isOpen, level, item.id)}
                <Checkbox
                  focusVisibleClassName={classes.checkboxFocus}
                  inputProps={{ title: checkboxSrTitle }}
                  onClick={e => handleCheckboxClick(e, item)}
                  icon={<span className={classes.checkBoxIcon} />}
                  color="primary"
                  checked={isSelected}
                  indeterminate={childIsSelected && !isSelected}
                />
              </div>
            </>
          )}
          titleContent={(
            <Typography aria-hidden className={classes.text}>
              {`${getLocaleText(item.name)} (${resultCount})`}
            </Typography>
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
      <TitleBar
        title={intl.formatMessage({ id: 'general.pageTitles.serviceTree.title' })}
        titleComponent="h3"
        backButton={!isMobile}
        className={classes.topBarColor}
      />
      <Typography className={classes.guidanceInfoText} variant="body2">{intl.formatMessage({ id: 'services.info' })}</Typography>
      <div className={classes.mainContent}>
        {renderServiceNodeList()}
      </div>
      <StyledFloatingDiv>
        <SMButton
          className={classes.searchButton}
          color="primary"
          disabled={!ids.length}
          icon={<Search />}
          messageID="services.search"
          onClick={() => {
            setTreeState({ services, selected, opened });
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

ServiceTreeView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  setTreeState: PropTypes.func.isRequired,
  prevServices: PropTypes.arrayOf(PropTypes.any),
  prevSelected: PropTypes.arrayOf(PropTypes.any),
  prevOpened: PropTypes.arrayOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

ServiceTreeView.defaultProps = {
  navigator: null,
  prevServices: [],
  prevSelected: [],
  prevOpened: [],
};

export default ServiceTreeView;
